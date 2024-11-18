#!/bin/bash

# Log file path
LOG_FILE="./update_log.txt"

# Function to log messages with a timestamp
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
}

# Log the start of the script
log_message "Update started."

# Get the current time in seconds
current_time=$(date +%s)

# Check if the log file exists and read the last run time
if [ -f "$LOG_FILE" ]; then
    last_run_time=$(grep "LAST_RUN_TIME" "$LOG_FILE" | tail -n 1 | awk -F= '{print $2}')
else
    last_run_time=0
fi

# Check if 24 hours (86400 seconds) have passed since the last run
if (( current_time - last_run_time < 86400 )); then
    log_message "Script already ran in the last 24 hours. Exiting."
    exit 0
fi

# Step 1: Navigate to the project directory (not needed now since we're already in the right folder)

# Step 2: Run the update data script
if /Users/ahsan/.nvm/versions/node/v16.15.0/bin/node ./updateData.js >> "$LOG_FILE" 2>&1; then
    log_message "Update data script completed successfully."
else
    log_message "Update data script failed. Exiting."
    exit 1
fi

# Step 3: Stage all changes
if git add . >> "$LOG_FILE" 2>&1; then
    log_message "Staged all changes."
else
    log_message "Failed to stage changes. Exiting."
    exit 1
fi

# Step 4: Commit changes with a message
if git commit -m "Update players" >> "$LOG_FILE" 2>&1; then
    log_message "Committed changes with message: Update players."
else
    log_message "No changes to commit or commit failed."
fi

# Step 5: Push changes to the GitHub repository
if git push origin >> "$LOG_FILE" 2>&1; then
    log_message "Pushed changes to GitHub repository."
else
    log_message "Failed to push changes to GitHub."
fi

# Update the last run time in the log file
log_message "LAST_RUN_TIME=$current_time"
log_message "Script completed."
