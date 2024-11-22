export interface User {
    id: string
    email: string
    full_name: string | null
    balance: number
    total_invested: number
    role: 'user' | 'admin'
  }
  
  export interface InvestmentPlan {
    id: string
    name: string
    duration_days: number
    return_percentage: number
    minimum_amount: number
    is_active: boolean
  }
  
  export interface Investment {
    id: string
    user_id: string
    plan_id: string
    amount: number
    status: 'pending' | 'active' | 'completed' | 'cancelled'
    start_date: string
    end_date: string
    return_amount: number
  }
  
  export interface Transaction {
    id: string
    user_id: string
    type: 'deposit' | 'withdrawal' | 'investment' | 'return'
    amount: number
    status: 'pending' | 'completed' | 'failed'
    reference_id: string | null
  }