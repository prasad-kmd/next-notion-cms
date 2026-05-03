const YTS_API_BASE = process.env.YTS_API || "https://yts.mx/api/v2/";

export interface YTSMovie {
  id: number;
  url: string;
  imdb_code: string;
  title: string;
  year: number;
  rating: number;
  runtime: number;
  genres: string[];
  summary: string;
  description_full: string;
  yt_trailer_code: string;
  language: string;
  mpa_rating: string;
  background_image: string;
  background_image_original: string;
  small_cover_image: string;
  medium_cover_image: string;
  large_cover_image: string;
  state: string;
  torrents: YTSTorrent[];
  date_uploaded: string;
  date_uploaded_unix: number;
}

export interface YTSTorrent {
  url: string;
  hash: string;
  quality: string;
  type: string;
  is_repack: string;
  video_codec: string;
  bit_depth: string;
  audio_channels: string;
  seeds: number;
  peers: number;
  size: string;
  size_bytes: number;
  date_uploaded: string;
  date_uploaded_unix: number;
}

export async function getYTSMovie(imdbId: string): Promise<YTSMovie | null> {
  if (!imdbId) return null;

  try {
    const url = `${YTS_API_BASE}list_movies.json?query_term=${imdbId}`;
    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) return null;
    const data = await response.json();

    if (data.status === "ok" && data.data.movie_count > 0) {
      // Find the exact match for imdbId
      const movie = data.data.movies.find((m: unknown) => (m as { imdb_code: string }).imdb_code === imdbId);
      return movie || data.data.movies[0];
    }

    return null;
  } catch (error) {
    console.error("YTS API Error:", error);
    return null;
  }
}

export function getMagnetLink(torrentHash: string, movieTitle: string): string {
  const trackers = [
    "udp://open.demonii.com:1337/announce",
    "udp://tracker.openbittorrent.com:80",
    "udp://tracker.coppersurfer.tk:6969",
    "udp://glotorrents.pw:6969/announce",
    "udp://tracker.opentrackr.org:1337/announce",
    "udp://torrent.gresille.org:80/announce",
    "udp://p4p.arenabg.com:1337",
    "udp://tracker.leechers-paradise.org:6969",
  ];
  const encodedTitle = encodeURIComponent(movieTitle);
  return `magnet:?xt=urn:btih:${torrentHash}&dn=${encodedTitle}&${trackers.map((t) => `tr=${encodeURIComponent(t)}`).join("&")}`;
}
