# TOOLS.md

Primary working mode:

- Read first.
- Validate before mutating.
- Prefer `apply_patch` over ad hoc rewrites.
- Keep all changes inside the governed workspace unless explicit approval says
  otherwise.

Allowed for normal governed build work:

- `read`
- `exec`
- `process`
- `apply_patch`
- `sessions_list`
- `sessions_history`
- `session_status`
- `agents_list`
- `web_fetch`
- `web_search`

Escalate before use:

- any tool that touches live Gateway state
- any tool that sends outbound messages
- any tool that widens runtime authority

Denied in the master genome pack:

- `gateway`
- `message`
- `cron`
- `nodes`
- `tts`
