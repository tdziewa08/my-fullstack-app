import styles from "./page.module.css";
import Link from 'next/link'
import Image from 'next/image'
import Post from "../components/post"

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section className={styles.attract}>
          <h1>Gamer Ranker Shitter</h1>
          <span>Please Sign-Up to rank our game of the day...</span>
        </section>
        <section className={styles.gameOfDay}>
          <div className={styles.post}>
            <div className={styles.postImgContainer}>
                <Image src="/globe.svg" alt="placeholder-img" height={300} width={400} />
            </div>
            <div className={styles.postDetails}>
                <h2>Resident Evil Requiem</h2>
                <span>2026</span>
                <span>Capcom</span>
                <span>Real good so far</span>
            </div>
        </div>
        </section>
        <section className={styles.postsContainer}>
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
        </section>
      </main>
    </div>
  );
}