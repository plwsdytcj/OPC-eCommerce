import { definePlugin, runWorker } from "@paperclipai/plugin-sdk";

const SKILL_KEYS = [
  "amazon-listing-optimization",
  "amazon-niche-finder",
  "amazon-keyword-research",
  "ecom-cfo",
  "cross-border-ecommerce",
];

const plugin = definePlugin({
  async setup(ctx) {
    const reconcileAll = async (companyId: string, label: string): Promise<void> => {
      for (const skillKey of SKILL_KEYS) {
        try {
          const result = await ctx.skills.managed.reconcile(skillKey, companyId);
          ctx.logger.info(`reconciled ${skillKey} → ${label}`, {
            status: result.status,
            skillId: result.skillId,
          });
        } catch (err) {
          ctx.logger.error(`failed to reconcile ${skillKey} → ${label}`, {
            error: err instanceof Error ? err.message : String(err),
          });
        }
      }
    };

    const companies = await ctx.companies.list();
    ctx.logger.info(`OPC skills: backfilling into ${companies.length} existing company(ies)`);
    for (const company of companies) {
      await reconcileAll(company.id, company.name ?? company.id);
    }

    ctx.events.on("company.created", async (event) => {
      const companyId = event.entityId;
      if (!companyId) return;
      ctx.logger.info(`OPC skills: company.created → installing into ${companyId}`);
      await reconcileAll(companyId, companyId);
    });

    ctx.actions.register("reconcile-now", async (params) => {
      const companyId = typeof params?.companyId === "string" ? params.companyId : null;
      const targets = companyId
        ? [{ id: companyId, name: companyId }]
        : await ctx.companies.list();
      for (const c of targets) {
        await reconcileAll(c.id, c.name ?? c.id);
      }
      return { reconciledCompanies: targets.length, skills: SKILL_KEYS.length };
    });

    ctx.data.register("status", async () => ({
      managedSkills: SKILL_KEYS,
      version: "0.1.0",
    }));
  },

  async onHealth() {
    return { status: "ok", message: "OPC cross-border-skills worker live" };
  },
});

export default plugin;
runWorker(plugin, import.meta.url);
