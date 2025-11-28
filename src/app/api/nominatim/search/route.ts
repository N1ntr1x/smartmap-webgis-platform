import { NextResponse } from "next/server";
import { APP_CONFIG } from "@/configs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        query
      )}&format=json&addressdetails=1&limit=10`,
      {
        headers: {
          "User-Agent": `${APP_CONFIG.name} Project (${APP_CONFIG.contact.email})`,
        },
      }
    );

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 });
  }
}
