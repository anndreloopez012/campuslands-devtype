import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SCORES_FILE = path.resolve(__dirname, '../public/scores.json');

async function main() {
  const issueBody = process.env.ISSUE_BODY || process.argv[2];
  const issueUser = process.env.ISSUE_USER || process.argv[3];

  if (!issueBody) {
    console.error('Error: No issue body provided.');
    process.exit(1);
  }

  // Extract JSON from markdown code block or raw string
  const jsonMatch = issueBody.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || [null, issueBody.trim()];
  let rawJson = jsonMatch[1];

  let record;
  try {
    record = JSON.parse(rawJson);
  } catch (err) {
    console.error('Error parseando JSON del score:', err.message);
    process.exit(1);
  }

  // Basic sanity validation
  if (!record.githubUsername || typeof record.wpm !== 'number' || typeof record.accuracy !== 'number') {
    console.error('Error: Estructura del score inválida.');
    process.exit(1);
  }

  // Anti-cheat bounds
  if (record.wpm < 5 || record.wpm > 280) {
    console.error('Error: WPM fuera de límites lógicos (5-280).');
    process.exit(1);
  }

  if (record.accuracy < 10 || record.accuracy > 100) {
    console.error('Error: Precisión fuera de rango (10-100%).');
    process.exit(1);
  }

  // If issueUser is passed from GitHub Action, verify it matches
  if (issueUser && issueUser.toLowerCase() !== record.githubUsername.toLowerCase()) {
    console.warn(`Aviso: Autor de la issue (@${issueUser}) difiere de @${record.githubUsername}. Se usará @${issueUser}.`);
    record.githubUsername = issueUser;
  }

  record.id = `score-git-${Date.now()}`;
  record.date = new Date().toISOString().split('T')[0];
  record.verifiedInGit = true;

  // Read existing scores
  let scores = [];
  try {
    const data = await fs.readFile(SCORES_FILE, 'utf-8');
    scores = JSON.parse(data);
  } catch (e) {
    console.log('Creando nuevo archivo de scores...');
    scores = [];
  }

  // Check if score already exists or replace if higher
  const existingIdx = scores.findIndex(
    s => s.githubUsername.toLowerCase() === record.githubUsername.toLowerCase() &&
         s.language === record.language &&
         s.mode === record.mode &&
         s.level === record.level
  );

  if (existingIdx !== -1) {
    if (record.wpm >= scores[existingIdx].wpm) {
      scores[existingIdx] = record;
      console.log(`Puntaje actualizado para @${record.githubUsername} (${record.wpm} WPM)`);
    } else {
      console.log(`El puntaje existente (${scores[existingIdx].wpm} WPM) es mayor o igual al nuevo (${record.wpm} WPM).`);
    }
  } else {
    scores.push(record);
    console.log(`Nuevo récord registrado para @${record.githubUsername} (${record.wpm} WPM)`);
  }

  // Sort: WPM descending, accuracy descending
  scores.sort((a, b) => {
    if (b.wpm !== a.wpm) return b.wpm - a.wpm;
    return b.accuracy - a.accuracy;
  });

  // Limit to top 150
  scores = scores.slice(0, 150);

  await fs.writeFile(SCORES_FILE, JSON.stringify(scores, null, 2), 'utf-8');
  console.log(`✅ Base de datos Git actualizada exitosamente en: ${SCORES_FILE}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
