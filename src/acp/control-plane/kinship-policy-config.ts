import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import type {
  SessionAcpRouteClassification,
  SessionAcpRouteLawEnvelope,
} from "../../config/sessions/types.js";
import { normalizeText } from "./runtime-options.js";

export const KINSHIP_POLICY_ENGINE_CONFIG_CONTRACT = "kinship-policy-engine-config.v1";
export const KINSHIP_POLICY_CONFIG_ENV = "OPENCLAW_KINSHIP_POLICY_CONFIG_PATH";

export type KinshipPolicyRouteRule = {
  allow: boolean;
  requireSourceRouteLaw: boolean;
  requireTargetRouteLaw: boolean;
  requireDecisionParity: boolean;
  requireParticipantMatch: boolean;
  requirePresidentMediation: boolean;
  requireArtifactReturn: boolean;
  requireCousinTicket: boolean;
};

export type KinshipInspectorPolicy = {
  defaultSubscriptionMode: "admitted_inspector" | "transport_inspector";
  supportedSubscriptionModes: string[];
  pushedEventKinds: string[];
  pushInspectorSections: string[];
};

export type KinshipPolicySet = {
  policySetId: string;
  label: string;
  scope: "global" | "workforce_alpha";
  state: "active" | "inactive";
  updatedAt: string;
  routeClasses: Partial<Record<SessionAcpRouteClassification, Partial<KinshipPolicyRouteRule>>>;
  inspector?: Partial<KinshipInspectorPolicy>;
  notes?: string[];
};

export type KinshipPolicyEngineConfig = {
  contractVersion: typeof KINSHIP_POLICY_ENGINE_CONFIG_CONTRACT;
  engineId: "kinship-policy-engine";
  engineVersion: string;
  activePolicySetId: string;
  updatedAt: string;
  policySets: KinshipPolicySet[];
  notes?: string[];
};

export type ResolvedKinshipPolicySet = Omit<KinshipPolicySet, "routeClasses" | "inspector"> & {
  routeClasses: Record<SessionAcpRouteClassification, KinshipPolicyRouteRule>;
  inspector: KinshipInspectorPolicy;
};

export type ResolvedKinshipPolicyEngineState = {
  path: string;
  source: "default" | "file";
  contractVersion: typeof KINSHIP_POLICY_ENGINE_CONFIG_CONTRACT;
  engineId: "kinship-policy-engine";
  engineVersion: string;
  activePolicySetId: string;
  updatedAt: string;
  policySets: ResolvedKinshipPolicySet[];
  activePolicySet: ResolvedKinshipPolicySet;
  notes: string[];
  configDigest: string;
  issues: string[];
};

type MaterializedKinshipPolicyState = Pick<
  ResolvedKinshipPolicyEngineState,
  | "contractVersion"
  | "engineId"
  | "engineVersion"
  | "activePolicySetId"
  | "updatedAt"
  | "policySets"
  | "notes"
>;

const ROUTE_CLASSIFICATIONS: SessionAcpRouteClassification[] = [
  "child",
  "sibling",
  "escalation",
  "cousin",
  "illegal",
];

const DEFAULT_ROUTE_RULES: Record<SessionAcpRouteClassification, KinshipPolicyRouteRule> = {
  child: {
    allow: true,
    requireSourceRouteLaw: true,
    requireTargetRouteLaw: true,
    requireDecisionParity: true,
    requireParticipantMatch: true,
    requirePresidentMediation: false,
    requireArtifactReturn: false,
    requireCousinTicket: false,
  },
  sibling: {
    allow: true,
    requireSourceRouteLaw: true,
    requireTargetRouteLaw: true,
    requireDecisionParity: true,
    requireParticipantMatch: true,
    requirePresidentMediation: false,
    requireArtifactReturn: false,
    requireCousinTicket: false,
  },
  escalation: {
    allow: true,
    requireSourceRouteLaw: true,
    requireTargetRouteLaw: true,
    requireDecisionParity: true,
    requireParticipantMatch: true,
    requirePresidentMediation: false,
    requireArtifactReturn: false,
    requireCousinTicket: false,
  },
  cousin: {
    allow: true,
    requireSourceRouteLaw: true,
    requireTargetRouteLaw: true,
    requireDecisionParity: true,
    requireParticipantMatch: true,
    requirePresidentMediation: true,
    requireArtifactReturn: true,
    requireCousinTicket: true,
  },
  illegal: {
    allow: false,
    requireSourceRouteLaw: true,
    requireTargetRouteLaw: true,
    requireDecisionParity: true,
    requireParticipantMatch: true,
    requirePresidentMediation: false,
    requireArtifactReturn: false,
    requireCousinTicket: false,
  },
};

const DEFAULT_INSPECTOR_POLICY: KinshipInspectorPolicy = {
  defaultSubscriptionMode: "admitted_inspector",
  supportedSubscriptionModes: ["overview", "transport_inspector", "admitted_inspector"],
  pushedEventKinds: [
    "policy_config.updated",
    "transport.admission.approved",
    "transport.admission.rejected",
    "transport.lifecycle.updated",
  ],
  pushInspectorSections: ["transport", "policy", "lifecycle"],
};

function defaultPolicySet(): ResolvedKinshipPolicySet {
  const updatedAt = "2026-03-24T00:00:00.000Z";
  return {
    policySetId: "workforce-alpha-default",
    label: "Workforce Alpha default Kinship policy",
    scope: "workforce_alpha",
    state: "active",
    updatedAt,
    routeClasses: {
      child: { ...DEFAULT_ROUTE_RULES.child },
      sibling: { ...DEFAULT_ROUTE_RULES.sibling },
      escalation: { ...DEFAULT_ROUTE_RULES.escalation },
      cousin: { ...DEFAULT_ROUTE_RULES.cousin },
      illegal: { ...DEFAULT_ROUTE_RULES.illegal },
    },
    inspector: {
      ...DEFAULT_INSPECTOR_POLICY,
      supportedSubscriptionModes: [...DEFAULT_INSPECTOR_POLICY.supportedSubscriptionModes],
      pushedEventKinds: [...DEFAULT_INSPECTOR_POLICY.pushedEventKinds],
      pushInspectorSections: [...DEFAULT_INSPECTOR_POLICY.pushInspectorSections],
    },
    notes: [
      "Default Kinship policy keeps current ACP transport law as the floor.",
      "Dynamic configuration may tighten admission behavior without weakening admitted Kinship law.",
    ],
  };
}

function defaultConfig(): ResolvedKinshipPolicyEngineState {
  const activePolicySet = defaultPolicySet();
  const materialized: MaterializedKinshipPolicyState = {
    contractVersion: KINSHIP_POLICY_ENGINE_CONFIG_CONTRACT,
    engineId: "kinship-policy-engine" as const,
    engineVersion: "2026.03.v2",
    activePolicySetId: activePolicySet.policySetId,
    updatedAt: activePolicySet.updatedAt,
    policySets: [activePolicySet],
    notes: ["No dynamic Kinship policy file was found; using the baked-in workforce policy floor."],
  };
  return {
    path: resolveKinshipPolicyConfigPath(),
    source: "default",
    ...materialized,
    activePolicySet,
    configDigest: digestPolicyConfig(materialized),
    issues: [],
  };
}

function isPresentString(value: string | undefined): value is string {
  return value !== undefined;
}

function normalizeStringList(values: unknown, fallback: string[]): string[] {
  if (!Array.isArray(values)) {
    return [...fallback];
  }
  return Array.from(new Set(values.map((item) => normalizeText(item)).filter(isPresentString)));
}

function digestPolicyConfig(value: unknown): string {
  return crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex").slice(0, 16);
}

function toAbsolutePolicyConfigPath(rawPath: string, homeDir: string): string {
  if (rawPath.startsWith("~/")) {
    return path.join(homeDir, rawPath.slice(2));
  }
  return path.resolve(rawPath);
}

export function resolveKinshipPolicyConfigPath(
  env: NodeJS.ProcessEnv = process.env,
  homeDir = normalizeText(env.HOME) || os.homedir(),
): string {
  const configured = normalizeText(env[KINSHIP_POLICY_CONFIG_ENV]);
  if (configured) {
    return toAbsolutePolicyConfigPath(configured, homeDir);
  }
  return path.join(homeDir, ".openclaw", "policies", "kinship-policy-engine.json");
}

function ensureNonEmptyString(value: unknown, fallback: string): string {
  return normalizeText(value) || fallback;
}

function tightenAllowRule(value: unknown, fallback: boolean): boolean {
  if (!fallback) {
    return false;
  }
  return value !== false;
}

function tightenRequiredRule(value: unknown, fallback: boolean): boolean {
  if (fallback) {
    return true;
  }
  return value === true;
}

function normalizeRouteRule(
  value: Partial<KinshipPolicyRouteRule> | undefined,
  fallback: KinshipPolicyRouteRule,
): KinshipPolicyRouteRule {
  return {
    allow: tightenAllowRule(value?.allow, fallback.allow),
    requireSourceRouteLaw: tightenRequiredRule(
      value?.requireSourceRouteLaw,
      fallback.requireSourceRouteLaw,
    ),
    requireTargetRouteLaw: tightenRequiredRule(
      value?.requireTargetRouteLaw,
      fallback.requireTargetRouteLaw,
    ),
    requireDecisionParity: tightenRequiredRule(
      value?.requireDecisionParity,
      fallback.requireDecisionParity,
    ),
    requireParticipantMatch: tightenRequiredRule(
      value?.requireParticipantMatch,
      fallback.requireParticipantMatch,
    ),
    requirePresidentMediation: tightenRequiredRule(
      value?.requirePresidentMediation,
      fallback.requirePresidentMediation,
    ),
    requireArtifactReturn: tightenRequiredRule(
      value?.requireArtifactReturn,
      fallback.requireArtifactReturn,
    ),
    requireCousinTicket: tightenRequiredRule(
      value?.requireCousinTicket,
      fallback.requireCousinTicket,
    ),
  };
}

function normalizeInspectorPolicy(
  value: Partial<KinshipInspectorPolicy> | undefined,
): KinshipInspectorPolicy {
  return {
    defaultSubscriptionMode:
      normalizeText(value?.defaultSubscriptionMode) === "transport_inspector"
        ? "transport_inspector"
        : "admitted_inspector",
    supportedSubscriptionModes: Array.from(
      new Set([
        ...DEFAULT_INSPECTOR_POLICY.supportedSubscriptionModes,
        ...normalizeStringList(value?.supportedSubscriptionModes, []),
      ]),
    ),
    pushedEventKinds: Array.from(
      new Set([
        ...DEFAULT_INSPECTOR_POLICY.pushedEventKinds,
        ...normalizeStringList(value?.pushedEventKinds, []),
      ]),
    ),
    pushInspectorSections: Array.from(
      new Set([
        ...DEFAULT_INSPECTOR_POLICY.pushInspectorSections,
        ...normalizeStringList(value?.pushInspectorSections, []),
      ]),
    ),
  };
}

function normalizePolicySet(
  value: KinshipPolicySet | undefined,
  fallback: ResolvedKinshipPolicySet,
): ResolvedKinshipPolicySet {
  const routeClasses = Object.fromEntries(
    ROUTE_CLASSIFICATIONS.map((classification) => [
      classification,
      normalizeRouteRule(
        value?.routeClasses?.[classification],
        fallback.routeClasses[classification],
      ),
    ]),
  ) as Record<SessionAcpRouteClassification, KinshipPolicyRouteRule>;

  return {
    policySetId: ensureNonEmptyString(value?.policySetId, fallback.policySetId),
    label: ensureNonEmptyString(value?.label, fallback.label),
    scope: normalizeText(value?.scope) === "global" ? "global" : "workforce_alpha",
    state: normalizeText(value?.state) === "inactive" ? "inactive" : "active",
    updatedAt: ensureNonEmptyString(value?.updatedAt, fallback.updatedAt),
    routeClasses,
    inspector: normalizeInspectorPolicy(value?.inspector),
    notes: normalizeStringList(value?.notes, fallback.notes || []),
  };
}

function parsePolicyConfigFile(filePath: string): unknown {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function normalizePolicyConfigCandidate(candidate: unknown): ResolvedKinshipPolicyEngineState {
  const fallback = defaultConfig();
  const value = candidate && typeof candidate === "object" ? candidate : {};
  const rawSets = Array.isArray((value as KinshipPolicyEngineConfig).policySets)
    ? (value as KinshipPolicyEngineConfig).policySets
    : [];
  const policySets =
    rawSets.length > 0
      ? rawSets.map((item) => normalizePolicySet(item, fallback.activePolicySet))
      : [fallback.activePolicySet];
  const activePolicySetId = ensureNonEmptyString(
    (value as KinshipPolicyEngineConfig).activePolicySetId,
    policySets.find((item) => item.state === "active")?.policySetId || policySets[0].policySetId,
  );
  const activePolicySet =
    policySets.find((item) => item.policySetId === activePolicySetId) ||
    policySets.find((item) => item.state === "active") ||
    policySets[0];
  if (!activePolicySet) {
    throw new Error("Kinship policy normalization could not resolve an active policy set.");
  }
  const materialized: MaterializedKinshipPolicyState = {
    contractVersion: KINSHIP_POLICY_ENGINE_CONFIG_CONTRACT,
    engineId: "kinship-policy-engine" as const,
    engineVersion: ensureNonEmptyString(
      (value as KinshipPolicyEngineConfig).engineVersion,
      fallback.engineVersion,
    ),
    activePolicySetId: activePolicySet.policySetId,
    updatedAt: ensureNonEmptyString(
      (value as KinshipPolicyEngineConfig).updatedAt,
      activePolicySet.updatedAt,
    ),
    policySets,
    notes: normalizeStringList((value as KinshipPolicyEngineConfig).notes, fallback.notes),
  };
  return {
    path: fallback.path,
    source: "file",
    ...materialized,
    activePolicySet,
    configDigest: digestPolicyConfig(materialized),
    issues: [],
  };
}

export function loadKinshipPolicyEngineState(params?: {
  env?: NodeJS.ProcessEnv;
  homeDir?: string;
}): ResolvedKinshipPolicyEngineState {
  const env = params?.env ?? process.env;
  const homeDir = (params?.homeDir ?? normalizeText(env.HOME)) || os.homedir();
  const filePath = resolveKinshipPolicyConfigPath(env, homeDir);
  const fallback = defaultConfig();
  fallback.path = filePath;

  try {
    const stat = fs.statSync(filePath);
    if (!stat.isFile()) {
      return {
        ...fallback,
        issues: [`Kinship policy path is not a file: ${filePath}`],
      };
    }
    const resolved = normalizePolicyConfigCandidate(parsePolicyConfigFile(filePath));
    return {
      ...resolved,
      path: filePath,
      source: "file",
    };
  } catch (error) {
    return {
      ...fallback,
      issues: [`Dynamic Kinship policy unavailable: ${String(error)}`],
    };
  }
}

export function writeKinshipPolicyEngineState(
  nextConfig: KinshipPolicyEngineConfig,
  params?: { env?: NodeJS.ProcessEnv; homeDir?: string },
): ResolvedKinshipPolicyEngineState {
  const env = params?.env ?? process.env;
  const homeDir = (params?.homeDir ?? normalizeText(env.HOME)) || os.homedir();
  const filePath = resolveKinshipPolicyConfigPath(env, homeDir);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const normalized = normalizePolicyConfigCandidate(nextConfig);
  const payload: KinshipPolicyEngineConfig = {
    contractVersion: KINSHIP_POLICY_ENGINE_CONFIG_CONTRACT,
    engineId: "kinship-policy-engine",
    engineVersion: normalized.engineVersion,
    activePolicySetId: normalized.activePolicySet.policySetId,
    updatedAt: normalized.updatedAt,
    policySets: normalized.policySets.map((policySet) => ({
      policySetId: policySet.policySetId,
      label: policySet.label,
      scope: policySet.scope,
      state: policySet.state,
      updatedAt: policySet.updatedAt,
      routeClasses: policySet.routeClasses,
      inspector: policySet.inspector,
      ...(policySet.notes?.length ? { notes: policySet.notes } : {}),
    })),
    ...(normalized.notes.length ? { notes: normalized.notes } : {}),
  };
  const tempPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  fs.writeFileSync(tempPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  fs.renameSync(tempPath, filePath);
  return {
    ...normalized,
    path: filePath,
    source: "file",
  };
}

export function routeRuleForClassification(
  state: ResolvedKinshipPolicyEngineState,
  classification: SessionAcpRouteClassification,
): KinshipPolicyRouteRule {
  return state.activePolicySet.routeClasses[classification];
}

export function validateRouteLawAgainstActivePolicy(
  routeLaw: SessionAcpRouteLawEnvelope,
  state: ResolvedKinshipPolicyEngineState,
): string[] {
  const rule = routeRuleForClassification(state, routeLaw.classification);
  const issues: string[] = [];
  if (!rule.allow) {
    issues.push(`classification ${routeLaw.classification} is disabled by active Kinship policy.`);
  }
  if (rule.requirePresidentMediation && routeLaw.requiresPresidentMediation !== true) {
    issues.push(`classification ${routeLaw.classification} requires President mediation.`);
  }
  if (rule.requireArtifactReturn && routeLaw.artifactReturnRequired !== true) {
    issues.push(`classification ${routeLaw.classification} requires artifact return.`);
  }
  if (rule.requireCousinTicket && !normalizeText(routeLaw.ticketId)) {
    issues.push(`classification ${routeLaw.classification} requires a cousin ticket.`);
  }
  return issues;
}
