#!/usr/bin/env node
'use strict';

const readline = require('readline');

function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const parts = [];
  if (hours) parts.push(`${hours}h`);
  if (minutes || hours) parts.push(`${minutes}m`);
  parts.push(`${seconds}s`);
  return parts.join(' ');
}

function help() {
  console.log('Commands:');
  console.log('  start [description]  Start a lap timer');
  console.log('  help                 Show this help');
  console.log('  exit                 Quit');
}

async function waitForEnter() {
  return new Promise((resolve) => {
    const onData = (buf) => {
      const str = buf.toString('utf8');
      if (str === '\r' || str === '\n') {
        cleanup();
        resolve();
      }
      // Allow Ctrl+C to exit and Ctrl+D to stop
      if (buf.length === 1 && buf[0] === 4) {
        cleanup();
        resolve();
      }
      if (buf.length === 1 && buf[0] === 3) {
        cleanup();
        process.exit(130);
      }
    };

    const cleanup = () => {
      process.stdin.off('data', onData);
      if (process.stdin.isTTY) process.stdin.setRawMode(false);
      process.stdin.pause();
    };

    process.stdin.resume();
    if (process.stdin.isTTY) process.stdin.setRawMode(true);
    process.stdin.on('data', onData);
  });
}

async function runLap(description) {
  const start = Date.now();
  console.log('Lap started. Press Enter or Ctrl+D to stop.');
  await waitForEnter();
  const elapsedMs = Date.now() - start;
  const label = description ? `"${description}"` : '(no description)';
  console.log(`Lap stopped: ${label} — ${formatDuration(elapsedMs)}`);
}

async function commandLoop(initialCommand) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'lap> ',
  });

  const execute = async (line) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    const [cmd, ...rest] = trimmed.split(' ');
    if (cmd === 'start') {
      const desc = rest.join(' ').trim();
      rl.pause();
      await runLap(desc);
      rl.close();
      return;
    } else if (cmd === 'help') {
      help();
    } else if (cmd === 'exit' || cmd === 'quit') {
      rl.close();
      return;
    } else {
      console.log(`Unknown command: ${cmd}`);
      help();
    }
  };

  rl.on('line', async (line) => {
    await execute(line);
    rl.prompt();
  });

  rl.on('close', () => {
    process.exit(0);
  });

  if (initialCommand) {
    await execute(initialCommand);
  } else {
    help();
  }
  rl.prompt();
}

function main() {
  const args = process.argv.slice(2);
  const initialCommand = args.length ? args.join(' ') : '';
  commandLoop(initialCommand).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

main();
