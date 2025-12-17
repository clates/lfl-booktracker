# Multi-Agent Workspace Guide

This repository is set up to support multiple concurrent AI agents working on independent tasks.

## Structure

The workspaces are located in `../lfl-booktracker-agents/`.
There are 5 pre-provisioned agent slots:
- `agent-1` (Branch: `agent-1-workspace`)
- `agent-2` (Branch: `agent-2-workspace`)
- `agent-3` (Branch: `agent-3-workspace`)
- `agent-4` (Branch: `agent-4-workspace`)
- `agent-5` (Branch: `agent-5-workspace`)

## How to Interface with Agents

### 1. IDE Setup Recommendations
**For Human Oversight (Manager Mode)**:
- Use "Add Folder to Workspace..." in VS Code to add `agent-1`, `agent-2`, etc. to your current window.
- This allows you to easily browse, compare, and copy-paste between agents and the main repo.

**For Running Agents (Simultaneous Mode)**:
- **Critical:** To run 5 agents simultaneously, you should usually open **5 separate VS Code windows** (one for each `agent-x` folder).
- Most AI agent plugins run one "session" per window.
- This ensures each agent has its own isolated context, terminal, and "brain".

### 2. Assigning a Task
When you want to run an agent:
1. Choose a free slot (e.g., `agent-1`).
2. **Copy the Template:** Open [docs/AGENT_TASK_TEMPLATE.md](file:///home/clates/lfl-booktracker/docs/AGENT_TASK_TEMPLATE.md), copy the text, fill in the agent ID, and paste it as your first message to the agent.
3. This ensures the agent understands its boundaries and git context immediately.

### 2. Git Workflow per Agent
Each workspace is a valid Git repository (linked via `git worktree`).
- **Commits**: Can be made normally.
- **Branches**: The workspace comes with a dedicated branch `agent-N-workspace`.
  - *Recommendation*: Agents should create feature branches off the HEAD of `main` if starting a fresh task: `git checkout -b feature/my-new-task`.
- **Pushing**: `git push origin feature/my-new-task` works as expected.

### 3. Environment
- **Node Modules**: Each workspace has its own isolated `node_modules` folder. Agents can run `npm install`, `npm run dev`, or tests without conflicting with others.
- **Environment Variables**: The setup script copies `.env.local` to each workspace. Ensure agents update this if they need specific keys.

### 4. Cleanup
To reset an agent workspace:
1. Commit or stash important changes.
2. Reset the branch: `git reset --hard main` (or origin/main).
3. Clean untracked files: `git clean -fd`.

## Maintenance
To update all workspaces with the latest `main`:

**Note**: Since all workspaces share the same `.git` directory, running `git fetch` in **any** workspace updates the remote references (like `origin/main`) for **all** of them. However, each workspace has its own local branch that won't automatically move.

To bring a specific agent up to date:
```bash
# In the agent dir (no need to fetch if you already fetched elsewhere)
git rebase origin/main
```
