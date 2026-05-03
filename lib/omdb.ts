const OMDB_API_KEY = process.env.OMDB_API;
const OMDB_BASE_URL = "https://www.omdbapi.com/";

export interface OMDBData {
  Ratings: Array<{ Source: string; Value: string }>;
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  DVD?: string;
  BoxOffice?: string;
  Website?: string;
  Response: string;
}

export async function getOMDBData(imdbId: string): Promise<OMDBData | null> {
  if (!OMDB_API_KEY || !imdbId) return null;

  try {
    const url = `${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&i=${imdbId}`;
    const response = await fetch(url, {
      next: { revalidate: 86400 }, // Cache for 24 hours
    });

    if (!response.ok) return null;
    const data = await response.json();
    return data.Response === "True" ? data : null;
  } catch (error) {
    console.error("OMDb API Error:", error);
    return null;
  }
}
