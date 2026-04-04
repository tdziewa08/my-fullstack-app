import styles from "./page.module.css";
import GameOfDay, { DailyGameFallback } from "@/components/dailyGame";
import Link from 'next/link'
import { getDailyGame } from '@/utils/daily-game'
import { getUser } from '@/app/auth/actions'
import { Suspense } from 'react'

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section className={styles.attract}>
            <h1>Gamer Ranker Shitter</h1>
            <span>Please Sign-Up to rank our game of the day...</span>
        </section>
        <Suspense fallback={<DailyGameFallback />}>
          <GameOfDayWrapper />
        </Suspense>
        <Link href="/blogs">View Blogs</Link>
      </main>
    </div>
  );
}

async function GameOfDayWrapper() {
  const [game, user] = await Promise.all([
    getDailyGame(),
    getUser()
  ]);
  
  return <GameOfDay game={game} user={user} />;
}
