import { NextResponse } from "next/server";
import { APP_CONFIG } from "@/configs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json({ error: "Missing coordinates" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
      {
        headers: {
            "User-Agent": `${APP_CONFIG.name} Project (${APP_CONFIG.contact.email})`,
        },
      }
    );
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 });
  }
}
