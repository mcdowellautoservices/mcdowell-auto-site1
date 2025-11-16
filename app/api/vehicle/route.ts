// app/api/vehicle/route.ts
import { NextResponse } from "next/server";

const UK_VEHICLE_DATA_KEY = process.env.UK_VEHICLE_DATA_KEY;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const reg = searchParams.get("reg")?.toUpperCase();
  if (!reg) return NextResponse.json({ error: "No reg provided" }, { status: 400 });

  const apiUrl = `https://api.ukvehicledata.co.uk/v1/decoded/${reg}`;
  const res = await fetch(apiUrl, {
    headers: { "x-api-key": UK_VEHICLE_DATA_KEY! },
  });

  if (!res.ok) return NextResponse.json({ error: "Not found" }, { status: res.status });
  const data = await res.json();

  const sizes = data.VehicleRegistration.TyreSizes; // example path
  const tyreSize = sizes?.[0]?.fullSize;
  if (!tyreSize) return NextResponse.json({ error: "Size not available" }, { status: 404 });

  return NextResponse.json({ size: tyreSize });
}
