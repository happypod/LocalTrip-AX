import fs from 'fs';
import path from 'path';

const sourceDir = 'C:/Users/happy/.gemini/antigravity/brain/b760c717-9036-4d61-9e34-c5f29b1862ef';
const targetDir = 'f:/moalab/LocalTrip AX/public/images/generated';

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const mappings = [
  { prefix: 'stay_bluebird_landscape_', name: 'stay_bluebird_landscape.png' },
  { prefix: 'stay_bluebird_people_', name: 'stay_bluebird_people.png' },
  { prefix: 'stay_bluebird_detail_', name: 'stay_bluebird_detail.png' },
  { prefix: 'stay_glamping_landscape_', name: 'stay_glamping_landscape.png' },
  { prefix: 'stay_glamping_people_', name: 'stay_glamping_people.png' },
  { prefix: 'stay_glamping_detail_', name: 'stay_glamping_detail.png' },
  { prefix: 'stay_sunset_landscape_', name: 'stay_sunset_landscape.png' },
  { prefix: 'stay_sunset_people_', name: 'stay_sunset_people.png' },
  { prefix: 'stay_sunset_detail_', name: 'stay_sunset_detail.png' },
  { prefix: 'stay_hanok_landscape_', name: 'stay_hanok_landscape.png' },
  { prefix: 'stay_hanok_people_', name: 'stay_hanok_people.png' },
  { prefix: 'stay_hanok_detail_', name: 'stay_hanok_detail.png' },
  { prefix: 'exp_morning_landscape_', name: 'exp_morning_landscape.png' },
  { prefix: 'exp_morning_people_', name: 'exp_morning_people.png' },
  { prefix: 'exp_morning_detail_', name: 'exp_morning_detail.png' },
  { prefix: 'exp_gamtae_landscape_', name: 'exp_gamtae_landscape.png' },
  { prefix: 'exp_gamtae_people_', name: 'exp_gamtae_people.png' },
];

async function run() {
  const sourceFiles = fs.readdirSync(sourceDir);
  
  for (const m of mappings) {
    const matches = sourceFiles.filter(f => f.startsWith(m.prefix) && f.endsWith('.png'));
    if (matches.length > 0) {
      // Get the latest one if multiple exist (by sorting)
      const latest = matches.sort().reverse()[0];
      fs.copyFileSync(path.join(sourceDir, latest), path.join(targetDir, m.name));
      console.log(`Copied ${latest} to ${m.name}`);
    } else {
      console.warn(`No files found for prefix: ${m.prefix}`);
    }
  }
}

run().catch(console.error);
