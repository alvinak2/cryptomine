import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { DashboardStats } from '@/components/dashboard/Stats';
import { PlanSelector } from '@/components/investments/PlanSelector';
import { InvestmentsList } from '@/components/investments/InvestmentsList';
import { TransactionHistory } from '@/components/transactions/TransactionHistory';

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .single();

  const { data: investments } = await supabase
    .from('investments')
    .select('*')
    .eq('user_id', user.id);

  const { data: plans } = await supabase
    .from('investment_plans')
    .select('*')
    .eq('is_active', true);

  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10);

  return (
    <div className="container mx-auto py-8 space-y-8">
      <DashboardStats 
        balance={user.balance}
        totalInvested={user.total_invested}
        activeInvestments={investments.filter(i => i.status === 'active').length}
      />
      
      <section>
        <h2 className="text-2xl font-bold mb-4">Investment Plans</h2>
        <PlanSelector plans={plans} onSelect={(plan) => {}} />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Your Investments</h2>
        <InvestmentsList investments={investments} />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Recent Transactions</h2>
        <TransactionHistory transactions={transactions} />
      </section>
    </div>
  );
}