// src/app/api/admin/withdrawals/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import { Withdrawal } from "@/models/withdrawal";
import { Investment } from "@/models/investment";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const withdrawals = await Withdrawal.find({}).exec();
    return NextResponse.json(withdrawals, { status: 200 });
  } catch (error) {
    console.error("Error fetching withdrawals:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { withdrawalId, action } = await req.json();

  if (!withdrawalId || !action) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    await connectDB();
    const update =
      action === "accept" ? { status: "complete" } : { status: "rejected" };
    const withdrawal = await Withdrawal.findByIdAndUpdate(
      withdrawalId,
      update,
      { new: true }
    );

    if (action === "accept" && withdrawal) {
      await Investment.findByIdAndUpdate(withdrawal.investmentId, {
        status: "complete",
      });
    }

    return NextResponse.json(
      { message: "Withdrawal and investment updated successfully" },
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
