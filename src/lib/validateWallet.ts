// src/lib/validateWallet.ts
export function validateWalletAddress(currency: string, address: string): boolean {
    const patterns = {
      btc: /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/,
      eth: /^0x[a-fA-F0-9]{40}$/,
      usdt: /^T[A-Za-z1-9]{33}$/,
      sol: /[1-9A-HJ-NP-Za-km-z]{32,44}$/
    }
    
    return patterns[currency as keyof typeof patterns]?.test(address) ?? false
  }