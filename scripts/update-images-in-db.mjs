import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const { Pool } = pg;

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const updates = [
    {
      model: 'accommodation',
      id: 'cmp3pcfwm0007b07mbwdttxhc', // 천리포 파랑새 민박
      images: [
        '/images/generated/stay_bluebird_landscape.png',
        '/images/generated/stay_bluebird_people.png',
        '/images/generated/stay_bluebird_detail.png'
      ]
    },
    {
      model: 'accommodation',
      id: 'cmp3pcg110009b07mvcu8cc8y', // 만리포 바다 글램핑
      images: [
        '/images/generated/stay_glamping_landscape.png',
        '/images/generated/stay_glamping_people.png',
        '/images/generated/stay_glamping_detail.png'
      ]
    },
    {
      model: 'accommodation',
      id: 'cmp3pcfua0006b07m2e36wsgv', // 소원 낙조 펜션
      images: [
        '/images/generated/stay_sunset_landscape.png',
        '/images/generated/stay_sunset_people.png',
        '/images/generated/stay_sunset_detail.png'
      ]
    },
    {
      model: 'accommodation',
      id: 'cmp3pcfyu0008b07me9ky084m', // 의항 한옥 스테이
      images: [
        '/images/generated/stay_hanok_landscape.png',
        '/images/generated/stay_hanok_people.png',
        '/images/generated/stay_hanok_detail.png'
      ]
    },
    {
      model: 'experience',
      id: 'cmp3pcg7p000cb07mg910fl79', // 어촌 마을의 아침 산책
      images: [
        '/images/generated/exp_morning_landscape.png',
        '/images/generated/exp_morning_people.png',
        '/images/generated/exp_morning_detail.png'
      ]
    },
    {
      model: 'experience',
      id: 'cmp3pcg5i000bb07m337u5j5j', // 감태 미니 클래스
      images: [
        '/images/generated/exp_gamtae_landscape.png',
        '/images/generated/exp_gamtae_people.png'
      ]
    },
    {
      model: 'program',
      id: 'cmp3pcgwe000nb07myehplaqh', // 어촌식 한상 만들기 클래스
      images: [
        '/images/generated/prog_meal_landscape.png',
        '/images/generated/prog_meal_people.png',
        '/images/generated/prog_meal_detail.png'
      ]
    }
  ];

  try {
    for (const u of updates) {
      if (u.model === 'accommodation') {
        await prisma.accommodation.update({
          where: { id: u.id },
          data: { images: u.images }
        });
      } else if (u.model === 'experience') {
        await prisma.experience.update({
          where: { id: u.id },
          data: { images: u.images }
        });
      } else if (u.model === 'program') {
        await prisma.localIncomeProgram.update({
          where: { id: u.id },
          data: { images: u.images }
        });
      }
      console.log(`Updated ${u.model} with ID ${u.id}`);
    }
  } catch (err) {
    console.error('Error updating data:', err);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
