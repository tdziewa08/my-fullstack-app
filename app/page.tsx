import styles from "./page.module.css";
import GameOfDay, { DailyGameFallback } from "@/components/dailyGame";
import { getDailyGame } from '@/utils/daily-game'
import { getUser } from '@/app/auth/actions'
import { Suspense } from 'react'

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
            <h1>
              Gamer Ranker Shitter
              <span>Please Sign-Up to rank our game of the day!</span>
            </h1>
        <Suspense fallback={<DailyGameFallback />}>
          <GameOfDayWrapper />
        </Suspense>
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
