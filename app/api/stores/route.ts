import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const authUser = await auth(); // Tunggu hasilnya
    const userId = authUser?.userId; // Ambil userId

    const body = await req.json();
    const { name } = body;

    if (!userId) {
      return new NextResponse("Unathorized", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Nama toko perlu diinput", { status: 400 });
    }

    const store = await db.store.create({
      data: {
        name,
        userId,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log("[STORES_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
