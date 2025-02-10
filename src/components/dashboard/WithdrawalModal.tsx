"use client";

import { useState } from "react";
import { PaymentMethodForWithdrawal } from "./PaymentMethodForWithdrawal";
import toast from "react-hot-toast";

export default function WithdrawalModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (walletAddress: string, paymentMethod: string) => Promise<void>;
}) {
  const [walletAddress, setWalletAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!walletAddress || !paymentMethod) {
      toast.error(
        "Please provide a wallet address and select a payment method."
      );
      return;
    }

    setLoading(true);

    try {
      await onSubmit(walletAddress, paymentMethod);
      toast.success("Withdrawal request submitted successfully!");
      onClose();
    } catch (error) {
      console.error("Error submitting withdrawal request:", error);
      toast.error("Failed to submit withdrawal request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Withdraw Investment</h2>

        {/* Use PaymentMethodForWithdrawal Component */}
        <PaymentMethodForWithdrawal
          value={paymentMethod}
          onChange={setPaymentMethod}
          walletAddress={walletAddress}
          onWalletChange={setWalletAddress}
        />

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
