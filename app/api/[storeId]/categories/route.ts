import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const authUser = await auth(); // Tunggu hasilnya
    const userId = authUser?.userId; // Ambil userId

    const body = await req.json();
    const { name, bannerId } = body;

    if (!userId) {
      return new NextResponse("Unathorized", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Nama category perlu diinput", { status: 400 });
    }

    if (!bannerId) {
      return new NextResponse("Banner id perlu diinput", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id URL dibutuhkan");
    }

    const storeByUserId = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unathorized", { status: 403 });
    }

    const category = await db.category.create({
      data: {
        name,
        bannerId,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORIES_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store id URL dibutuhkan");
    }

    const categories = await db.category.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.log("[CATEGORIES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
