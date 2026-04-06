# Mission 014 Launch Checklist

- [ ] verify `v2026.4.5` from official release and npm sources
- [ ] capture current `2026.4.3` baseline:
  - `openclaw status --all`
  - `openclaw memory status --json`
  - `openclaw memory status --deep`
- [ ] confirm local config does not rely on removed legacy aliases
- [ ] define the exact go / no-go gates for the live update
- [ ] define rollback notes and return path to Mission 013
