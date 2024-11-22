// src/types/models.ts
export interface User {
    id: string
    email: string
    name: string | null
    role: 'USER' | 'ADMIN'
    createdAt: Date
    updatedAt: Date
  }
  
  export interface Investment {
    id: string
    type: 'BASIC' | 'PRO' | 'ELITE'
    amount: number
    returnAmount: number
    status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
    startDate: Date | null
    endDate: Date | null
    userId: string
    createdAt: Date
    updatedAt: Date
  }
  
  export interface WalletAddress {
    id: string
    type: 'BTC' | 'ETH' | 'USDT_TRC20' | 'SOL'
    address: string
    userId: string
    createdAt: Date
    updatedAt: Date
  }