"use client";

import { useState, useEffect, useCallback } from "react";
import { INVESTMENT_PLANS } from "@/lib/constants";
import { CalendarIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import WithdrawalModal from "./WithdrawalModal";

interface Investment {
  endDate: string;
  status: string;
  plan: keyof typeof INVESTMENT_PLANS;
  amount: number;
  userId: string;
  _id: string;
}

interface InvestmentCardProps {
  investment: Investment;
  onUpdate?: () => void;
}

export function InvestmentCard({ investment, onUpdate }: InvestmentCardProps) {
  const [loading, setLoading] = useState(false);
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const endDate = investment ? new Date(investment.endDate) : new Date();
  const now = new Date();
  const remainingDays = investment
    ? Math.max(
        0,
        Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 3600 * 24))
      )
    : 0;

  const isCompleted =
    investment && remainingDays === 0 && investment.status === "active";
  const planDuration = investment
    ? INVESTMENT_PLANS[investment.plan]?.duration || 15
    : 15;
  const progress = investment
    ? Math.min(100, ((planDuration - remainingDays) / planDuration) * 100)
    : 0;

  useEffect(() => {
    if (investment) {
      const timer = setTimeout(() => {
        setAnimatedProgress(progress);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [investment, progress]);

  const handleWithdrawal = useCallback(
    async (walletAddress: string, paymentMethod: string) => {
      if (!investment) return;

      setLoading(true);
      try {
        const res = await fetch("/api/withdrawals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: investment.userId,
            investmentId: investment._id,
            amount: investment.amount,
            walletAddress,
            paymentMethod,
          }),
        });

        if (!res.ok) throw new Error("Failed to submit withdrawal request");
        onUpdate?.();
      } catch (error) {
        console.error("Withdrawal error:", error);
      } finally {
        setLoading(false);
        setIsModalOpen(false);
      }
    },
    [investment, onUpdate]
  );

  const getProgressColor = (value: number) => {
    if (value < 33) return "bg-crypto-error";
    if (value < 66) return "bg-crypto-warning";
    return "bg-crypto-success";
  };

  if (!investment) {
    return <div className="text-gray-500">No investment data available.</div>;
  }

  return (
    <div className="bg-crypto-secondary text-gray-300 rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">{investment.plan} Plan</h3>
          <p className="text-crypto-success">${investment.amount.toFixed(2)}</p>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            investment.status === "active"
              ? "bg-crypto-success bg-opacity-20 text-crypto-success"
              : investment.status === "pending"
              ? "bg-crypto-warning bg-opacity-20 text-crypto-warning"
              : "bg-gray-500 bg-opacity-20 text-gray-400"
          }`}
        >
          {investment.status}
        </span>
      </div>

      <div className="space-y-4">
        <div className="flex items-center text-sm text-gray-500">
          <CalendarIcon className="h-4 w-4 mr-2" />
          {remainingDays > 0 ? (
            <span>
              {remainingDays} day{remainingDays !== 1 ? "s" : ""} remaining
            </span>
          ) : (
            <span>Investment period completed</span>
          )}
        </div>

        <div className="relative w-full bg-crypto-accent rounded-full h-2 overflow-hidden">
          <div
            className={`absolute left-0 top-0 h-full ${getProgressColor(
              animatedProgress
            )} transition-all duration-1000 ease-out`}
            style={{ width: `${animatedProgress}%` }}
          />
          <div
            className="absolute left-0 top-0 h-full bg-crypto-accent opacity-30 transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {isCompleted && (
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={loading}
            className="w-full py-2 px-4 bg-crypto-success text-white rounded hover:bg-crypto-success/90 disabled:opacity-50 transition-colors duration-300"
          >
            {loading ? (
              <ArrowPathIcon className="h-5 w-5 animate-spin mx-auto" />
            ) : (
              "Withdraw Investment"
            )}
          </button>
        )}
      </div>

      {isModalOpen && (
        <WithdrawalModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleWithdrawal}
        />
      )}
    </div>
  );
}
