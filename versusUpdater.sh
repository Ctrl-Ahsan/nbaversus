#!/bin/bash

# Log file path
LOG_FILE="./update_log.txt"

# Last run time file path
LAST_RUN_FILE="./last_run_time.txt"

# Function to log messages with a timestamp
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
}

# Log the start of the script
log_message "Update started."

# Get the current time in seconds
current_time=$(date +%s)

# Check if the last run time file exists and read the value
if [ -f "$LAST_RUN_FILE" ]; then
    last_run_time=$(cat "$LAST_RUN_FILE")
else
    last_run_time=0
fi

# Check if 24 hours (86400 seconds) have passed since the last run
if (( current_time - last_run_time < 86400 )); then
    log_message "Script already ran in the last 24 hours. Exiting."
    exit 0
fi

# Step 1: Run the update data script (suppress its logs)
if /Users/ahsan/.nvm/versions/node/v16.15.0/bin/node ./updateData.js > /dev/null 2>&1; then
    log_message "Data updated successfully."
else
    log_message "Data update failed. Exiting."
    exit 1
fi

# Step 2: Stage specific files
git add ./frontend/src/roster.json ./backend/roster.json ./backend/stats.json

# Step 3: Commit changes with a message
git commit -m "Update players"

# Step 4: Push changes to the GitHub repository
if git push origin >> "$LOG_FILE" 2>&1; then
    log_message "Changes pushed to production."
else
    log_message "Failed to push changes."
fi

# Update the last run time in the dedicated file
echo "$current_time" > "$LAST_RUN_FILE"
log_message "LAST_RUN_TIME updated to $current_time"
log_message "Update completed."
