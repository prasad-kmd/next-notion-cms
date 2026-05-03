import { NextResponse } from "next/server";
import { tmdb } from "@/lib/tmdb";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "admin") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json([]);
  }

  try {
    const results = await tmdb.searchMulti(query);
    const mappedResults = results.results
      .filter((item) => item.media_type === "movie" || item.media_type === "tv")
      .map((item) => {
        const isMovie = item.media_type === "movie";
        return {
          slug: item.id.toString(),
          title: isMovie ? item.title : item.name,
          description: (item as unknown).overview,
          type: item.media_type,
          date: isMovie ? item.release_date : item.first_air_date,
        };
      })
      .slice(0, 8);

    return NextResponse.json(mappedResults);
  } catch (error) {
    console.error("Failed to fetch TMDB search hints:", error);
    return NextResponse.json([]);
  }
}
