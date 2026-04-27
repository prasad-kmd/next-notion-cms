import { NextRequest, NextResponse } from "next/server";

const CHEAPSHARK_BASE = "https://www.cheapshark.com/api/1.0";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get("endpoint");

  if (!endpoint || !["stores", "deals"].includes(endpoint)) {
    return NextResponse.json({ error: "Invalid endpoint" }, { status: 400 });
  }

  try {
    // Build the upstream URL
    const upstreamParams = new URLSearchParams();
    searchParams.forEach((value, key) => {
      if (key !== "endpoint") {
        upstreamParams.append(key, value);
      }
    });

    const queryString = upstreamParams.toString();
    const url = `${CHEAPSHARK_BASE}/${endpoint}${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(url, {
      headers: { "User-Agent": "NextJS-GameDeals/1.0" },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `CheapShark API returned ${response.status}` },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("CheapShark proxy error:", err);
    return NextResponse.json(
      { error: "Failed to fetch from CheapShark" },
      { status: 502 },
    );
  }
}
