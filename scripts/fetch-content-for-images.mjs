import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const { Pool } = pg;

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const regions = await prisma.region.findMany({ where: { status: 'published' } });
    const regionIds = regions.map(r => r.id);

    if (regionIds.length === 0) {
      console.log(JSON.stringify({ accommodations: [], experiences: [], programs: [], courses: [] }, null, 2));
      return;
    }

    const accommodations = await prisma.accommodation.findMany({
      where: { status: 'published', regionId: { in: regionIds } },
      select: { id: true, title: true, category: true, summary: true }
    });

    const experiences = await prisma.experience.findMany({
      where: { status: 'published', regionId: { in: regionIds } },
      select: { id: true, title: true, category: true, summary: true }
    });

    const programs = await prisma.localIncomeProgram.findMany({
      where: { status: 'published', regionId: { in: regionIds } },
      select: { id: true, title: true, category: true, summary: true }
    });

    const courses = await prisma.course.findMany({
      where: { status: 'published', regionId: { in: regionIds } },
      select: { id: true, title: true, summary: true }
    });

    console.log(JSON.stringify({ accommodations, experiences, programs, courses }, null, 2));
  } catch (err) {
    console.error('Error fetching data:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
