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
        <section className={styles.dailyGameSkeleton}>
            <div className={`${styles.skeleton} ${styles.dailyGameSkeletonImg}`}></div>
            <div className={styles.dailyGameSkeletonDetails}>
                <div className={`${styles.skeleton} ${styles.dailyGameSkeletonTitle}`}></div>
                <div className={styles.dailyGameSkeletonMeta}>
                    <div className={`${styles.skeleton} ${styles.dailyGameSkeletonDate}`}></div>
                    <div className={`${styles.skeleton} ${styles.dailyGameSkeletonCompany}`}></div>
                    <div className={`${styles.skeleton} ${styles.dailyGameSkeletonGenres}`}></div>
                </div>
                <div className={`${styles.skeleton} ${styles.dailyGameSkeletonSummary}`}></div>
                <div className={`${styles.skeleton} ${styles.dailyGameSkeletonLink}`}></div>
            </div>
        </section>
    )
}