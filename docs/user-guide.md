# Harvest CCS User Guide

This guide provides instructions for using the Harvest Competition Control System.

## Getting Started

### Installation

1. Download the latest release for your platform from the [releases page](https://github.com/matthew-collett/harvest-ccs/releases)
2. Install the application:
   - Windows: Run the installer (.exe)
   - macOS: Mount the disk image (.dmg) and drag to Applications
   - Linux: Install the AppImage, deb, or snap package

### Login

1. Launch the application
2. Enter your email and password
3. Click "Login"

> Note: If you don't have login credentials, contact me.

## Navigation

The application has five main sections:

- **Settings**: Configure system settings
- **Teams**: Manage teams and devices
- **Competition**: Run active competitions
- **Scoring**: Review and adjust scores
- **Leaderboard**: View tournament brackets

You can collapse the sidebar by clicking the toggle icon in the top-right corner.

## Setting Up a Competition

### Configuring Serial Connection

1. Go to the **Settings** tab
2. Under "Serial Connection", select the appropriate port
3. Set the baud rate (default: 115200)
4. Click "Connect"

When connected successfully, you'll see a green "Connected" status message.

### Creating Teams

1. Go to the **Teams** tab
2. Click "New Team"
3. Enter a team ID and name
4. Click "Create Team"

### Adding Devices

1. Go to the **Teams** tab
2. Click "New Device"
3. Select the team, device type, and player ID
4. Click "Add Device"

## Running a Competition Round

1. Go to the **Competition** tab
2. Select the competing teams from the dropdowns
3. Click "Start Round" to begin
4. Use "Pause" or "End Round" as needed

During the round:

- Monitor team scores in real-time
- Track device status
- Watch task completion updates

## Scoring and Results

### Viewing Scores

1. Go to the **Scoring** tab
2. View the overall scores for each team
3. Expand rounds to see detailed scoring

### Adjusting Scores

1. Find the round you want to adjust
2. Click the edit icon next to the team's score
3. Use + and - buttons to adjust points
4. Click the checkmark to save

## Tournament Management

1. Go to the **Leaderboard** tab
2. For first-round matches, select teams from the dropdowns
3. Click "Win" buttons to advance teams in the bracket
4. The system automatically updates the tournament progress

### Tournament Structure

The tournament uses a double-elimination format:

- Teams are eliminated after losing twice
- In the championship, the winner of the loser's bracket must win twice against the winner's bracket champion

## Troubleshooting

### Device Connection Issues

- Ensure the correct port is selected
- Verify the baud rate matches the board
- Check that all cables are secure

### Data Not Syncing

- Verify your internet connection
- Confirm you have a valid login session
- Try logging out and back in

### Application Not Responding

- Refresh the application (`Cmd + Shift + R`)
- Restart the application
- Use `Cmd + i` to open developer tools
