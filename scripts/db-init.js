#!/usr/bin/env node
/**
 * Root entry point for database index initialization.
 * Ensures Mongoose indexes exist per data-model.md.
 *
 * Usage: node scripts/db-init.js
 */
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const backendDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'backend',
);

const result = spawnSync('npm', ['run', 'db:init'], {
  cwd: backendDir,
  stdio: 'inherit',
  shell: true,
});

process.exit(result.status ?? 1);
