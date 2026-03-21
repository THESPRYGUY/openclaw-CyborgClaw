# 02_SETUP

## Purpose

Make sure the workspace, access, repo, and execution cockpit are loaded the same way every time.

## Environment target

- Runtime cockpit: `terminal + editor + repo-local mission pack`
- Host: `voltaris`
- Workspace path: `/home/spryguy/openclaw-workspace`
- Repo path: `/home/spryguy/openclaw-workspace/repos/openclaw`
- Primary branch policy: `working-branch-only`
- Expected worktree / branch model: `stay on the current branch unless explicit approval is given to switch`

## Required tools

- terminal
- git
- editor
- runtime / package manager
- browser if UI validation is needed

## Required access / auth

- repo access: `local read/write access to the openclaw repo`
- runtime / service access: `none required for this artifact-only lane`
- reference artifact access: `local read access to /home/spryguy/.openclaw/workspace-voltaris-v2/ops/templates/dev-pack-v1/`

## Startup environment checklist

- [ ] correct workspace open
- [ ] correct repo path confirmed
- [ ] correct host confirmed
- [ ] expected instruction files present
- [ ] integrated terminal available
- [ ] Git available
- [ ] authentication / provider state checked if relevant
- [ ] mission dependencies available

## Do not proceed if

- wrong repo
- wrong host
- detached HEAD without approval
- dirty tree without explanation
- missing required artifacts
- unavailable services needed for proof
- missing shared template source needed to instantiate the continuity pack
