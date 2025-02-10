// src/app/admin/withdrawals/page.tsx
"use client";

import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

type Withdrawal = {
  _id: string;
  userId: string;
  amount: number;
  walletAddress: string;
  paymentMethod: string;
  status: string;
  createdAt: string;
  investmentId: string;
};

export default function AdminWithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [allCompleted, setAllCompleted] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    try {
      const response = await fetch("/api/admin/withdrawals");
      if (!response.ok) throw new Error("Failed to fetch withdrawals");
      const data = await response.json();
      setWithdrawals(data);
      setAllCompleted(
        data.every((withdrawal: Withdrawal) => withdrawal.status === "complete")
      );
    } catch (error) {
      console.error("Error fetching withdrawals:", error);
      setError("Failed to fetch withdrawals");
    } finally {
      setLoading(false);
    }
  }

  async function handleWithdrawal(id: string, status: "accept" | "reject") {
    try {
      const res = await fetch(`/api/admin/withdrawals`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ withdrawalId: id, action: status }),
      });
      if (!res.ok) throw new Error("Failed to process withdrawal");
      await fetchRequests();
    } catch (err: any) {
      setError(err.message);
    }
  }

  if (loading) return <div className="text-gray-300">Loading...</div>;

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
      </div>
    );
  }

  if (allCompleted) {
    return (
      <div className="p-6">
        <div className="bg-crypto-secondary rounded-lg shadow p-6 text-center text-gray-300">
          All investments are completed. No further actions can be taken.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-300">
        Withdrawal Requests
      </h1>
      {withdrawals.length === 0 ? (
        <div className="bg-crypto-secondary rounded-lg shadow p-6 text-center text-gray-300">
          No withdrawal requests pending
        </div>
      ) : (
        <div className="bg-crypto-secondary rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-crypto-accent">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                  Wallet Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                  Payment Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                  Requested At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-crypto-secondary divide-y divide-gray-700">
              {withdrawals.map((withdrawal) => (
                <tr key={withdrawal._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {withdrawal.userId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    ${withdrawal.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {withdrawal.walletAddress}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {withdrawal.paymentMethod}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {withdrawal.status}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {new Date(withdrawal.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {withdrawal.status === "pending" && (
                      <>
                        <button
                          onClick={() =>
                            handleWithdrawal(withdrawal._id, "accept")
                          }
                          className="text-crypto-success hover:text-crypto-success/90"
                        >
                          <CheckIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() =>
                            handleWithdrawal(withdrawal._id, "reject")
                          }
                          className="text-red-600 hover:text-red-900"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
