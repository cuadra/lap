# lap

A small command-line lap timer for quick time tracking.

## Requirements

- Node.js 18+ (or any recent Node.js version)
- npm

## Install (from this repo)

```bash
git clone <your-repo-url>
cd timetracker
npm install
npm link
```

After linking, the `lap` command is available globally on your machine.

## Usage

Run interactive mode:

```bash
lap
```

Run a lap immediately with a description:

```bash
lap start "Write README"
```

When a lap is running, press `Enter` (or `Ctrl+D`) to stop and print elapsed time.

## Commands

- `start [description]`: start a lap timer
- `help`: show help text
- `exit` / `quit`: close the CLI

## Example session

```text
$ lap
Commands:
  start [description]  Start a lap timer
  help                 Show this help
  exit                 Quit
lap> start Deep work
Lap started. Press Enter or Ctrl+D to stop.
Lap stopped: "Deep work" - 12m 4s
```
