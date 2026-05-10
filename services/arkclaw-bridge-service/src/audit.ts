import { db, schema } from "@opc/db";

interface AuditInput {
  workspaceId?: string | null;
  actorType: "user" | "agent" | "system" | "arkclaw";
  actorId?: string | null;
  action: string;
  targetType?: string | null;
  targetId?: string | null;
  payload?: Record<string, unknown>;
}

export async function writeAudit(input: AuditInput): Promise<void> {
  await db.insert(schema.auditLogs).values({
    workspaceId: input.workspaceId ?? null,
    actorType: input.actorType,
    actorId: input.actorId ?? null,
    action: input.action,
    targetType: input.targetType ?? null,
    targetId: input.targetId ?? null,
    payload: input.payload ?? {},
  });
}
