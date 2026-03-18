# M18 Non-Live Preset Runs

This path is a non-live rehearsal helper for Mission M18. It prepares preserved-style source artifacts, runs the mission-local harness, and emits a receipt bundle for inspection.

It does not execute a live official M18 lap.
It does not count as an official comparable M18 lap.

## `source-clean`

```sh
node --import tsx src/cyborgclaw/m18/official-richer-helper-presets.script.ts \
  --preset source-clean \
  --source-dir examples/m18-official-richer-helper-bundle/source-clean \
  --prepared-dir /tmp/m18-source-clean-prepared \
  --bundle-dir /tmp/m18-source-clean-bundle
```

Expected emitted artifacts in `/tmp/m18-source-clean-bundle`:

- `approval-checkpoint.json`
- `PK-L01.summary`
- `PK-L01.audit.json`
- `PK-L01.parent.delta.jsonl`
- `PK-L01.child.receipt.json`
- `comparable-lap-set.tsv`

## `source-known-bad`

```sh
node --import tsx src/cyborgclaw/m18/official-richer-helper-presets.script.ts \
  --preset source-known-bad \
  --source-dir examples/m18-official-richer-helper-bundle/source-known-bad \
  --prepared-dir /tmp/m18-source-known-bad-prepared \
  --bundle-dir /tmp/m18-source-known-bad-bundle
```

Expected emitted artifacts in `/tmp/m18-source-known-bad-bundle`:

- `approval-checkpoint.json`
- `PK-L03.summary`
- `PK-L03.audit.json`
- `PK-L03.parent.delta.jsonl`
- `PK-L03.child.receipt.json`
- `comparable-lap-set.tsv`
