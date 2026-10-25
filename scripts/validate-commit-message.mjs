import { readFileSync } from 'node:fs';

const messageFile = process.argv[2];

if (!messageFile) {
  process.stderr.write('Usage: node scripts/validate-commit-message.mjs <message-file>\n');
  process.exit(1);
}

const message = readFileSync(messageFile, 'utf8').split(/\r?\n/, 1)[0]?.trim() ?? '';
const conventionalCommit =
  /^(feat|fix|docs|style|refactor|test|chore|perf|ci|build|revert)(\([a-z0-9][a-z0-9._/-]*\))?: .{1,72}$/;

if (!conventionalCommit.test(message)) {
  process.stderr.write(
    'Invalid commit message. Use: type: short imperative description (for example, "feat: add cauldron screen").\n',
  );
  process.exit(1);
}
