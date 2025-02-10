// src/app/api/admin/withdrawals/[id]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import {Withdrawal} from "@/models/withdrawal";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = params;
  const { status } = await req.json();

  if (!id || !status) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    await connectDB();
    const update =
      status === "approved" ? { status: "complete" } : { status: "rejected" };
    await Withdrawal.findByIdAndUpdate(id, update);

    return NextResponse.json(
      { message: "Withdrawal updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating withdrawal:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
