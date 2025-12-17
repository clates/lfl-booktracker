#!/bin/bash
set -e

# Directory configurations
CURRENT_DIR=$(pwd)
PARENT_DIR=$(dirname "$CURRENT_DIR")
AGENTS_ROOT="$PARENT_DIR/lfl-booktracker-agents"

# Base branch to create workspaces from (defaulting to main, can be changed)
BASE_BRANCH="main"

echo "=========================================="
echo "Starting Agent Workspace Setup"
echo "Base Repository: $CURRENT_DIR"
echo "Agents Root: $AGENTS_ROOT"
echo "Base Branch: $BASE_BRANCH"
echo "=========================================="

# Create agents root directory
if [ ! -d "$AGENTS_ROOT" ]; then
    echo "Creating directory: $AGENTS_ROOT"
    mkdir -p "$AGENTS_ROOT"
else
    echo "Directory $AGENTS_ROOT already exists."
fi

# Loop to create 5 agent workspaces
for i in {1..5}; do
    AGENT_NAME="agent-$i"
    AGENT_DIR="$AGENTS_ROOT/$AGENT_NAME"
    BRANCH_NAME="agent-$i-workspace"

    echo ""
    echo "------------------------------------------"
    echo "Setting up $AGENT_NAME..."

    # Check if worktree directory already exists
    if [ -d "$AGENT_DIR" ]; then
        echo "Directory $AGENT_DIR already exists. Skipping worktree creation."
    else
        # Create git worktree
        # -b creates a new branch
        echo "Creating git worktree in $AGENT_DIR on branch $BRANCH_NAME..."
        if git worktree add -b "$BRANCH_NAME" "$AGENT_DIR" "$BASE_BRANCH"; then
            echo "Worktree created successfully."
        else
            echo "Failed to create worktree. It might already exist or branch name conflict."
            # Continue to next iteration or exit? Let's try to continue setup if dir exists now
            continue
        fi
    fi

    # Copy environment file
    if [ -f "$CURRENT_DIR/.env.local" ]; then
        echo "Copying .env.local to workspace..."
        cp "$CURRENT_DIR/.env.local" "$AGENT_DIR/"
    else
        echo "Warning: .env.local not found in base repo. Agent workspace will depend on defaults."
    fi

    # Install dependencies
    echo "Installing dependencies in $AGENT_DIR..."
    cd "$AGENT_DIR"
    
    # We use 'npm ci' for reliable builds if package-lock exists, otherwise 'npm install'
    if [ -f "package-lock.json" ]; then
        npm ci > /dev/null 2>&1
    else
        npm install > /dev/null 2>&1
    fi
    
    if [ $? -eq 0 ]; then
        echo "Dependencies installed successfully."
    else
        echo "Error installing dependencies."
    fi

    # Return to base dir for next iteration
    cd "$CURRENT_DIR"
done

echo ""
echo "=========================================="
echo "Setup Complete!"
echo "Workspaces available at: $AGENTS_ROOT"
echo "=========================================="
