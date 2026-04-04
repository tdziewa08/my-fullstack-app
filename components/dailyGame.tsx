import styles from "../app/page.module.css";
import Image from 'next/image'
import Link from 'next/link'
import type { Game } from "@/utils/daily-game"
import type { User } from '@supabase/supabase-js'

type DailyGameProps = {
    game: Game
    user: User | null
}

export default function DailyGame({ game, user }: DailyGameProps) {
    const releaseDate = new Date(game.first_release_date * 1000)
    const cleanDate = releaseDate.toLocaleDateString('en-US', {year: 'numeric', month:'long', day:'numeric'})
    const testGenres = game.genres.join(", ")

    return (
          <section className={styles.dailyGameCard}>
            <div className={styles.gameImgContainer}>
                <img src={game.image} alt={game.name} />
            </div>
            <div className={styles.dailyGameDetails}>
                <h2>{game.name}</h2>
                <div>
                    <span>{cleanDate}</span>
                    <span>{game.company}</span>
                    <div className={styles.genresContainer}>
                        {testGenres}
                    </div>
                </div>
                <p className={styles.dailyGameSummary}>{game.summary}</p>
                {user && <Link href="/new-blog">Write Post</Link>}
            </div>
        </section>
    )
}

export function DailyGameFallback() {
    return (
        <section className={styles.dailyGameCard}>
            <div className={styles.gameImgContainer}>
                <div style={{height: 350, width: 400, backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    Loading game...
                </div>
            </div>
            <div className={styles.dailyGameDetails}>
                <h2>Loading Game of the Day...</h2>
                <div>
                    <span>Loading date...</span>
                    <span>Loading company...</span>
                    <div className={styles.genresContainer}>
                        Loading genres...
                    </div>
                </div>
                <p className={styles.dailyGameSummary}>Loading game description...</p>
            </div>
        </section>
    )
}