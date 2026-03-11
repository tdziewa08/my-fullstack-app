import styles from "./page.module.css";
import GameOfDay from "@/components/dailyGame";
import Link from 'next/link'
import Image from 'next/image'

//CHECK HOW TO KEEP THE TOKEN ONLY EXECUTING EVERY 57 DAYS...4915617 seconds

// Revalidate this page every 24 hours (86400 seconds)
export const revalidate = 86400;

// Force static generation (override dynamic behavior)
// export const dynamic = 'force-static';

async function getToken() {
  const response = await fetch(
    'https://id.twitch.tv/oauth2/token?client_id=tw9b38rfdf3f49bwth8vajvp7ugzta&client_secret=4ilxc13p52i3mmhgcfcf2d1o4v98w0&grant_type=client_credentials', 
    { 
      method: 'POST',
      // next: { revalidate: 86400 } // Cache the token for 24 hours
    }
  )
  const data = await response.json()
  console.log("token function")
  // console.log(data)
  return data.access_token
}

async function getGamesTest(token: string) {
  const response = await fetch(
  "https://api.igdb.com/v4/covers", //CHANGE TO 'games ENDPOINT TO GET ALL DATA NEEDED FOR GAME OF THE DAY CARD
  { method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Client-ID': 'tw9b38rfdf3f49bwth8vajvp7ugzta',
      'Authorization': `Bearer ${token}`,
    },
    body: "fields url;",
    // next: { revalidate: 86400 } // Cache the games for 24 hours
  });
  const data = await response.json();
  
  // Use deterministic daily selection
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const gameIndex = dayOfYear % data.length;
  
  console.log('game cover code...')
  console.log(data)
  console.log(data[gameIndex].url)
  return data[gameIndex].url
}

export default async function Home() {

  const token = await getToken()
  let game = await getGamesTest(token)

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section className={styles.attract}>
          <h1>Gamer Ranker Shitter</h1>
          <span>Please Sign-Up to rank our game of the day...</span>
        </section>
        <GameOfDay />
          <Link href="/blogs">View Blogs</Link>
          {/* <img src={game} /> */}
          <Image src={`https:${game}`} alt="game" height={200} width={300}/>
      </main>
    </div>
  );
}