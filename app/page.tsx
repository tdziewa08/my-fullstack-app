import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>My App</h1>
        <p>Full stack app coming right up!</p>
      </main>
    </div>
  );
}