// src/services/PaymentService.ts
import { WalletType } from '@/types/models'

export class PaymentService {
  private static walletAddresses = {
    BTC: process.env.BTC_WALLET_ADDRESS,
    ETH: process.env.ETH_WALLET_ADDRESS,
    USDT_TRC20: process.env.USDT_WALLET_ADDRESS,
    SOL: process.env.SOL_WALLET_ADDRESS
  }

  static async createPayment(data: {
    amount: number
    walletType: WalletType
    userId: string
    investmentId: string
  }) {
    const payment = await prisma.payment.create({
      data: {
        amount: data.amount,
        walletType: data.walletType,
        status: 'PENDING',
        userId: data.userId,
        investmentId: data.investmentId,
        expiresAt: new Date(Date.now() + 3600000) // 1 hour expiry
      }
    })

    return {
      payment,
      walletAddress: this.walletAddresses[data.walletType]
    }
  }

  static async verifyPayment(paymentId: string) {
    // Implement blockchain verification logic here
    return true
  }
}