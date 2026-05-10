/**
 * SKILL.md 导入器
 * ────────────────
 * 解析 packages/db/seeds/skills/<category>/<slug>.md 这样的 Anthropic Skills
 * 风格 markdown 文件，转成 agent_templates 表的一行。
 *
 * frontmatter 至少要有 name + description，其他字段可选：
 *   - triggers: string[] | string
 *   - metadata: Record<string, unknown>（含 emoji / category 等）
 *
 * body 直接作为 soulPrompt 灌入。
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { glob } from "glob";

export interface ImportedSkill {
  /** 文件相对路径，调试用 */
  file: string;
  /** category = 父目录名，如 listing / sourcing / finance / ... */
  category: string;
  /** slug = 文件名 (不含 .md)，作为 agent_templates.slug */
  slug: string;
  /** 展示名（取 frontmatter.name 或文件名美化） */
  name: string;
  /** 简介 */
  description: string;
  /** 触发关键词，如有 */
  triggers: string[];
  /** 主提示词正文 */
  soulPrompt: string;
  /** 来源元数据（attribution） */
  source: {
    type: "official";
    file: string;
  };
  /** 原 frontmatter 留底 */
  raw: Record<string, unknown>;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/** packages/db/seeds/skills */
export const SKILLS_DIR = path.resolve(__dirname, "../seeds/skills");

function toTitle(slug: string): string {
  return slug
    .split("-")
    .map((s) => (s.length === 0 ? s : s[0]!.toUpperCase() + s.slice(1)))
    .join(" ");
}

function normalizeTriggers(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === "string");
  if (typeof value === "string") {
    return value
      .split(/[,\n]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

export async function loadAllSkills(rootDir: string = SKILLS_DIR): Promise<ImportedSkill[]> {
  if (!fs.existsSync(rootDir)) return [];
  const files = await glob("**/*.md", {
    cwd: rootDir,
    ignore: ["**/ATTRIBUTIONS.md", "**/README.md"],
    absolute: true,
  });

  const skills: ImportedSkill[] = [];
  for (const file of files.sort()) {
    const raw = fs.readFileSync(file, "utf8");
    const parsed = matter(raw);
    const fm = (parsed.data ?? {}) as Record<string, unknown>;

    const rel = path.relative(rootDir, file);
    const category = rel.split(path.sep)[0] ?? "uncategorized";
    const slugFromFile = path.basename(file, ".md");
    const fmName = typeof fm.name === "string" ? fm.name : "";
    const slug = fmName.match(/^[a-z0-9-]+$/) ? fmName : slugFromFile;
    const name = fmName && !fmName.match(/^[a-z0-9-]+$/) ? fmName : toTitle(slugFromFile);
    const description =
      typeof fm.description === "string"
        ? fm.description.replace(/\s+/g, " ").trim()
        : "";

    skills.push({
      file: rel,
      category,
      slug,
      name,
      description,
      triggers: normalizeTriggers(fm.triggers),
      soulPrompt: parsed.content.trim(),
      source: {
        type: "official",
        file: rel,
      },
      raw: fm,
    });
  }
  return skills;
}
