'use client'

import { useState } from 'react';
import { InvestmentPlan } from '@/types';
import { Card } from '../ui/Card';

export function PlanSelector({ 
  plans,
  onSelect
}: { 
  plans: InvestmentPlan[];
  onSelect: (plan: InvestmentPlan) => void;
}) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {plans.map((plan) => (
        <Card 
          key={plan.id}
          className={`cursor-pointer ${
            selectedPlan === plan.id ? 'ring-2 ring-blue-500' : ''
          }`}
          onClick={() => {
            setSelectedPlan(plan.id);
            onSelect(plan);
          }}
        >
          <h3 className="text-xl font-bold">{plan.name}</h3>
          <p className="text-gray-600">Duration: {plan.duration_days} days</p>
          <p className="text-green-600">Return: {plan.return_percentage}%</p>
          <p className="text-sm mt-2">
            Min. Amount: ${plan.minimum_amount.toFixed(2)}
          </p>
        </Card>
      ))}
    </div>
  );
}