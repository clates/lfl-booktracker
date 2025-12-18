# Agent Task Assignment Template

**Instructions:** Copy the text below. **Update the `AGENT_ID` variable at the top** with the correct agent identifier (e.g., `agent-1`). Then paste into the agent's chat.

---

**CONFIGURATION:**
`AGENT_ID` = "agent-1" 

**SYSTEM CONTEXT & BOUNDARIES:**
You are working in an isolated git worktree environment designed for simultaneous agent execution.

**STEP 0: NAVIGATE & VERIFY (CRITICAL)**
You will likely start in the main repository root (`/lfl-booktracker`). You MUST switch to your specific workspace immediately.

1.  **Navigate**: Run `cd ../lfl-booktracker-agents/$AGENT_ID` (substitute the value of `AGENT_ID`).
2.  **Verify**: Run `pwd`.
3.  **Validate**: 
    -   Check that the output path ends with the `AGENT_ID`.
    -   If it does not, **STOP**. Do not proceed until you are in the correct directory.

**CRITICAL RULES:**
1.  **Stay in CWD**: Once inside your workspace, do NOT access, search, or modify files in parent directories (e.g., `../`). Treat this workspace as your root.
2.  **Isolated Environment**: You have your own `node_modules`, `.env.local`, and git branch. 
3.  **Git Usage**:
    -   Your base branch is `$AGENT_ID-workspace`.
    -   Ensure that your HEAD is the tip of `main`.
    -   Create feature branches as needed: `git checkout -b feature/your-task-name`.
    -   Do NOT push to `main` directly.
    -   Commit small, regular, meaningful changes. 
    -   You have access to a github MCP server in order to push your changes and open pull requests.

**YOUR TASK:**

