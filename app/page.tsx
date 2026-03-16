import styles from "./page.module.css";
import GameOfDay from "@/components/dailyGame";
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/utils/supabase/client'



export type Game = {
  id: number,
  cover: {id: number, image_id: string},
  first_release_date: number,
  name: string,
  summary: string,
  game_type: number,
  image: string,
  company: string,
  genres: string[]
}
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
  "https://api.igdb.com/v4/games",
  { method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Client-ID': 'tw9b38rfdf3f49bwth8vajvp7ugzta',
      'Authorization': `Bearer ${token}`,
    },
    body: "fields cover.image_id, first_release_date, genres.name, involved_companies.company ,name ,summary; where cover != null & first_release_date != null;",
    // next: { revalidate: 86400 } // Cache the games for 24 hours
    //maybe limit to 1 and have random number to offset
  });
  const data = await response.json();
  
  // Use deterministic daily selection
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const gameIndex = dayOfYear % data.length;
  const selectedGame = data[gameIndex];
  console.log(selectedGame)
  const imageId = selectedGame.cover.image_id;
  const gameImage = await getGameImage(imageId);
  const gameCompany = await getGameCompany(token, selectedGame.involved_companies[0])

  const gameGenres = selectedGame.genres.map((item: {id: number, name: string}) => item.name)
  console.log('game genres,', gameGenres)

  return {...selectedGame, image: gameImage, company: gameCompany, genres: gameGenres};
}

async function getGameImage(id: string) {
  const imageUrl = `https://images.igdb.com/igdb/image/upload/t_1080p/${id}.jpg`;
  console.log(imageUrl);
  return imageUrl;
}

async function getGameCompany(token: string, ids: {id: number, company: number}) {
  const response = await fetch(
    "https://api.igdb.com/v4/companies",
    { method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Client-ID': 'tw9b38rfdf3f49bwth8vajvp7ugzta',
        'Authorization': `Bearer ${token}`,
      },
      body: `fields name; where id = ${ids.company}; limit 1;`,
    });
    const data = await response.json();
    console.log('company data, ', data)
    return data[0].name
}

export default async function Home() {

  const token = await getToken()
  let game: Game = await getGamesTest(token)

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section className={styles.attract}>
          <h1>Gamer Ranker Shitter</h1>
          <span>Please Sign-Up to rank our game of the day...</span>
        </section>
        <GameOfDay game={game} />
        <Link href="/blogs">View Blogs</Link>
      </main>
    </div>
  );
}
