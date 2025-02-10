"use client";

const PAYMENT_METHODS = [
  { id: "btc", name: "Bitcoin", icon: "₿" },
  { id: "eth", name: "Ethereum", icon: "Ξ" },
  { id: "usdt", name: "USDT(trc20)", icon: "₮" },
  { id: "sol", name: "Solana", icon: "◎" },
];

export function PaymentMethodForWithdrawal({
  value,
  onChange,
  walletAddress,
  onWalletChange,
}: {
  value: string;
  onChange: (method: string) => void;
  walletAddress: string;
  onWalletChange: (address: string) => void;
}) {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Select Payment Method</h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {PAYMENT_METHODS.map((method) => (
          <button
            key={method.id}
            onClick={() => onChange(method.id)}
            className={`p-4 rounded-lg border ${
              value === method.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <span className="text-2xl mr-2">{method.icon}</span>
            {method.name}
          </button>
        ))}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Wallet Address
        </label>
        <input
          type="text"
          value={walletAddress}
          onChange={(e) => onWalletChange(e.target.value)}
          placeholder="Enter your wallet address"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
    </div>
  );
}
