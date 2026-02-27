import styles from "./page.module.css";
import Link from 'next/link'

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Gamer Blogger Shitter</h1>
        <p>Full stack app coming right up!</p>
        <Link href="/about">About Page</Link>
      </main>
    </div>
  );
}