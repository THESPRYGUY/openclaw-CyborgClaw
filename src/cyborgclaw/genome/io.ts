import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { ZERO_DIGEST } from "./paths.js";
import type { JsonRecord } from "./types.js";

export function sha256(input: string | Uint8Array): string {
  return `sha256:${createHash("sha256").update(input).digest("hex")}`;
}

export function stableJson(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`;
}

export async function readText(filePath: string): Promise<string> {
  return await fs.readFile(filePath, "utf8");
}

export async function readJson(filePath: string): Promise<JsonRecord> {
  return JSON.parse(await readText(filePath)) as JsonRecord;
}

export async function fileDigest(filePath: string): Promise<string> {
  return sha256(await fs.readFile(filePath));
}

export function zeroDigestFields(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((entry) => zeroDigestFields(entry));
  }
  if (!value || typeof value !== "object") {
    return value;
  }
  const record = value as JsonRecord;
  const next: JsonRecord = {};
  for (const [key, entry] of Object.entries(record)) {
    if (key === "digest" || key.endsWith("Digest")) {
      next[key] = ZERO_DIGEST;
      continue;
    }
    next[key] = zeroDigestFields(entry);
  }
  return next;
}

export function getPathValue(target: JsonRecord, dottedPath: string): unknown {
  return dottedPath.split(".").reduce<unknown>((current, segment) => {
    if (!current || typeof current !== "object" || Array.isArray(current)) {
      return undefined;
    }
    return (current as JsonRecord)[segment];
  }, target);
}

export function toPosixPath(input: string): string {
  return input.split(path.sep).join("/");
}
