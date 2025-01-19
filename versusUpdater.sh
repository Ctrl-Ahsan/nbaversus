#!/bin/bash

# Navigate to the repository directory
REPO_DIR="/Users/ahsan/Desktop/Ctrl-Ahsan/nbaversus"
cd "$REPO_DIR" || { log_message "Failed to navigate to repository directory. Exiting."; exit 1; }

# Log file path
LOG_FILE="./versusUpdater.log"
LAST_UPDATE_FILE="./lastUpdate"

# Function to log messages with a timestamp
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
}

# Trap termination signals to handle interruptions
trap "log_message 'Script interrupted. Exiting.'; exit 1" TERM INT

# Log the start of the script
log_message "Update started."

# Get the current time in seconds
current_time=$(date +%s)

# Check if the last run time file exists and read the value
if [ -f "$LAST_UPDATE_FILE" ]; then
    last_update_time=$(cat "$LAST_UPDATE_FILE")
else
    last_update_time=0
fi

# Check if 24 hours (86400 seconds) have passed since the last run
if (( current_time - last_update_time < 86400 )); then
    log_message "Data already updated in the last 24 hours. Exiting."
    exit 0
fi

# Step 1: Run the update data script
if /Users/ahsan/.nvm/versions/node/v16.15.0/bin/node ./updateData.js >> ./updateData.log 2>&1; then

    log_message "Data updated successfully."
else
    log_message "Data update failed. Exiting."
    exit 1
fi



# Step 3: Stage specific files
if git add ./frontend/src/roster.json ./backend/data/roster.json ./backend/data/stats.json; then
    log_message "Files staged successfully."
else
    log_message "Failed to stage files. Exiting."
    exit 1
fi

# Step 4: Commit changes with a message
if git commit -m "Update players"; then
    log_message "Changes committed successfully."
else
    log_message "No changes to commit."
fi

# Step 5: Push changes to the GitHub repository
if git push origin >> "$LOG_FILE" 2>&1; then
    log_message "Changes pushed to production."
else
    log_message "Failed to push changes."
fi

# Step 6: Update the last run time
echo "$current_time" > "$LAST_UPDATE_FILE"
log_message "LAST_UPDATE_TIME updated to $current_time"
log_message "Update completed."
