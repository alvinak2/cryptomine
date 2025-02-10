// src/app/api/withdrawals/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import { Withdrawal } from "@/models/withdrawal";
import { Investment } from "@/models/investment";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { amount, walletAddress, paymentMethod, investmentId } =
    await req.json();

  if (!amount || !walletAddress || !paymentMethod || !investmentId) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    await connectDB();
    const newWithdrawal = new Withdrawal({
      userId: session.user.id,
      amount,
      walletAddress,
      paymentMethod,
      investmentId,
      status: "pending",
      createdAt: new Date(),
    });

    const result = await newWithdrawal.save();
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating withdrawal:", error);
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
