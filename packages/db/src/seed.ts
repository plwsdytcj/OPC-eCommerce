import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sql as sqlOp } from "drizzle-orm";
import {
  agentTemplates,
  workspaces,
} from "./schema/index";
import { loadAllSkills } from "./skill-importer";

const url = process.env.DATABASE_URL ?? "postgresql://opc:opc@localhost:5432/opc";

async function main(): Promise<void> {
  const sql = postgres(url, { max: 1 });
  const db = drizzle(sql);

  console.log("Loading SKILL.md files from packages/db/seeds/skills/ ...");
  const skills = await loadAllSkills();
  console.log(`  → loaded ${skills.length} skills`);
  for (const s of skills) {
    console.log(`    · [${s.category}] ${s.slug} (${(s.soulPrompt.length / 1024).toFixed(1)}KB)`);
  }

  if (skills.length === 0) {
    console.warn("⚠️  no skills found, skipping agent_templates seed");
  } else {
    // 清理 v0 硬编码留下的 stub（soul_prompt 极短的占位模板）
    const stubs = await db.execute(sqlOp`
      delete from agent_templates
      where source_type = 'official' and length(soul_prompt) < 500
      returning slug
    `);
    if (stubs.length > 0) {
      console.log(`  cleaned ${stubs.length} legacy stub(s):`, stubs.map((r) => r.slug));
    }
    console.log("Upserting agent_templates...");
    for (const s of skills) {
      await db
        .insert(agentTemplates)
        .values({
          slug: s.slug,
          name: s.name,
          category: s.category,
          sourceType: "official",
          status: "active",
          description: s.description,
          soulPrompt: s.soulPrompt,
          skills: [
            {
              id: s.slug,
              name: s.name,
              category: s.category,
              source_file: s.file,
            },
          ],
          tools: [],
          permissions: { read: [s.category], write: [] },
          outputSchema: { type: "object" },
          version: "0.1.0",
        })
        .onConflictDoUpdate({
          target: agentTemplates.slug,
          set: {
            name: s.name,
            category: s.category,
            description: s.description,
            soulPrompt: s.soulPrompt,
            updatedAt: sqlOp`now()`,
          },
        });
    }
  }

  console.log("Seeding sample workspace...");
  const ownerId = "00000000-0000-0000-0000-000000000001";
  const inserted = await db
    .insert(workspaces)
    .values({
      ownerId,
      name: "CJ Pet Global (Demo)",
      businessType: "shopify",
    })
    .onConflictDoNothing()
    .returning({ id: workspaces.id });

  console.log(
    "Seed complete. Templates:",
    skills.length,
    "| Sample workspace:",
    inserted[0]?.id ?? "(already existed)",
  );
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
