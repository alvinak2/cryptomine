import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { WalletManager } from '@/components/wallet/WalletManager'
import { TransactionHistory } from '@/components/transactions/TransactionHistory'

export default async function WalletPage() {
  const supabase = createServerComponentClient({ cookies })
  
  const { data: { session } } = await supabase.auth.getSession()
  const userId = session?.user.id

  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  const { data: walletAddresses } = await supabase
    .from('wallet_addresses')
    .select('*')
    .eq('user_id', userId)

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-2xl font-bold">Wallet Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold mb-4">Deposit/Withdrawal</h2>
          <WalletManager userId={userId!} />
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Your Wallet Addresses</h2>
          <div className="space-y-2">
            {walletAddresses?.map(wallet => (
              <div key={wallet.id} className="p-4 bg-gray-50 rounded">
                <p className="text-sm text-gray-500">{wallet.currency}</p>
                <p className="font-mono">{wallet.address}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section>
        <h2 className="text-xl font-bold mb-4">Transaction History</h2>
        <TransactionHistory transactions={transactions || []} />
      </section>
    </div>
  )
}