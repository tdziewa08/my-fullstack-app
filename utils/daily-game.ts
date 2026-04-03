
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

export async function getDailyGame(): Promise<Game> {
    'use cache'
    console.log('🎯 getDailyGame() - PROD TEST:', new Date().toISOString())
    
    const token = await getToken()
    return await getGamesTest(token)
}

export async function getToken() {
  console.log('🔑 getToken() - PROD TEST:', new Date().toISOString())
  const response = await fetch(
    'https://id.twitch.tv/oauth2/token?client_id=tw9b38rfdf3f49bwth8vajvp7ugzta&client_secret=4ilxc13p52i3mmhgcfcf2d1o4v98w0&grant_type=client_credentials', 
    { 
      method: 'POST',
      next: { revalidate: 86400 } // Cache the token for 24 hours
    }
  )
  const data = await response.json()
  console.log("token function")
  // console.log(data)
  return data.access_token
}

export async function getGamesTest(token: string) {
  console.log('🎮 getGamesTest() - PROD TEST:', new Date().toISOString())
  const response = await fetch(
    "https://api.igdb.com/v4/games",
    { 
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Client-ID': 'tw9b38rfdf3f49bwth8vajvp7ugzta',
        'Authorization': `Bearer ${token}`,
      },
      body: `
        fields cover.image_id, first_release_date, genres.name, involved_companies.company, name, summary, total_rating, follows;
        where 
          cover != null & 
          first_release_date != null & 
          involved_companies != null & 
          genres != null &
          total_rating >= 75;
        limit 50;
      `,
      next: { revalidate: 86400 } // Cache the games for 24 hours
    }
  );
  const data = await response.json();
  
  // Debug: Check API response
  console.log('IGDB Response status:', response.status);
  //console.log('IGDB Response data:', data);
  console.log('Number of games returned:', data.length);
  
  // Check if API returned an error instead of data
  if (data.error || !Array.isArray(data)) {
    console.error('IGDB API Error:', data);
    throw new Error('IGDB API returned an error');
  }
  
  if (data.length === 0) {
    console.warn('No games found with current filters');
    throw new Error('No games found - try different filters');
  }
  
  // Use deterministic daily selection
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const gameIndex = dayOfYear % data.length;
  const selectedGame = data[gameIndex];
  //console.log(selectedGame)
  const imageId = selectedGame.cover.image_id;
  const gameImage = await getGameImage(imageId);
  const gameCompany = await getGameCompany(token, selectedGame.involved_companies[0])

  const gameGenres = selectedGame.genres.map((item: {id: number, name: string}) => item.name)
  //console.log('game genres,', gameGenres)

  return {...selectedGame, image: gameImage, company: gameCompany, genres: gameGenres};
}

export async function getGameImage(id: string) {
  const imageUrl = `https://images.igdb.com/igdb/image/upload/t_1080p/${id}.jpg`;
  //console.log(imageUrl);
  return imageUrl;
}

export async function getGameCompany(token: string, ids: {id: number, company: number}) {
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
    //console.log('company data, ', data)
    return data[0].name
}