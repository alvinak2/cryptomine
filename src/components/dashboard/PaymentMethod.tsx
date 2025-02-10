"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { ClipboardIcon, CheckIcon } from "@heroicons/react/24/outline";

const PAYMENT_METHODS = [
  { id: "btc", name: "Bitcoin", icon: "₿" },
  { id: "eth", name: "Ethereum", icon: "Ξ" },
  { id: "usdt", name: "USDT", icon: "₮" },
  { id: "sol", name: "Solana", icon: "◎" },
];

export function PaymentMethod({
  investment,
  onPaymentConfirmed,
}: {
  investment: { _id?: string; amount?: number };
  onPaymentConfirmed: () => void;
}) {
  const [selectedMethod, setSelectedMethod] = useState(PAYMENT_METHODS[0]);
  const [walletAddress, setWalletAddress] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch wallet address when selected method changes
  useEffect(() => {
    fetchWalletAddress();
  }, [selectedMethod]);

  async function fetchWalletAddress() {
    try {
      const res = await fetch(`/api/wallet/address/${selectedMethod.id}`);
      if (!res.ok) throw new Error("Failed to fetch wallet address");
      const data = await res.json();
      setWalletAddress(data.address);
    } catch (error) {
      console.error("Error fetching wallet address:", error);
    }
  }

  async function handlePaymentConfirmation() {
    if (!investment || !investment._id) {
      console.error("No investment data available for confirmation.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/investments/confirm-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          investmentId: investment._id,
          paymentMethod: selectedMethod.id,
        }),
      });

      if (!res.ok) throw new Error("Failed to confirm payment");
      onPaymentConfirmed();
    } catch (error) {
      console.error("Payment confirmation error:", error);
    } finally {
      setLoading(false);
    }
  }

  // Safeguard against undefined or incomplete investment
  if (!investment || typeof investment.amount !== "number") {
    return (
      <div className="text-center text-gray-500">
        <p>Investment data is unavailable or incomplete.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Select Payment Method</h3>
        <div className="grid grid-cols-2 gap-4">
          {PAYMENT_METHODS.map((method) => (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method)}
              className={`p-4 rounded-lg border ${
                selectedMethod.id === method.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <span className="text-2xl mr-2">{method.icon}</span>
              {method.name}
            </button>
          ))}
        </div>
      </div>

      {walletAddress && (
        <div className="space-y-4">
          <div className="flex justify-center">
            <QRCodeSVG
              value={walletAddress}
              size={200}
              bgColor="#ffffff"
              fgColor="#000000"
              level="L"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={walletAddress}
              readOnly
              className="flex-1 p-2 border rounded bg-gray-50 font-mono text-sm"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(walletAddress);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              {copied ? (
                <CheckIcon className="h-5 w-5 text-green-500" />
              ) : (
                <ClipboardIcon className="h-5 w-5" />
              )}
            </button>
          </div>

          <p className="text-center text-sm text-gray-500">
            Please send exactly ${investment.amount.toFixed(2)} worth of{" "}
            {selectedMethod.name}
          </p>

          <button
            onClick={handlePaymentConfirmation}
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Confirming..." : "I Have Made the Payment"}
          </button>
        </div>
      )}
    </div>
  );
}
