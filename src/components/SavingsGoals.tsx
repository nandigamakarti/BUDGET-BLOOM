import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useExpenses } from '@/contexts/ExpenseContext';
import { format, startOfMonth, endOfMonth } from 'date-fns';

const SavingsGoals: React.FC = () => {
  const { savingsGoals, addSavingsGoal, updateSavingsGoal, getMonthlyExpenses } = useExpenses();
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Find the goal for the current month
  const currentGoal = savingsGoals.find(goal => {
    const deadline = new Date(goal.deadline);
    return deadline.getMonth() === currentMonth && deadline.getFullYear() === currentYear;
  });

  // Calculate total expenses for the current month
  const expensesThisMonth = getMonthlyExpenses(currentMonth, currentYear);
  const totalExpensesThisMonth = expensesThisMonth.reduce((sum, e) => sum + e.amount, 0);

  // State for editing/creating the goal
  const [isEditing, setIsEditing] = useState(false);
  const [goalAmount, setGoalAmount] = useState(currentGoal ? currentGoal.target_amount.toString() : '');

  // Calculate progress and remaining
  const targetAmount = currentGoal ? currentGoal.target_amount : 0;
  const remaining = Math.max(targetAmount - totalExpensesThisMonth, 0);
  const progress = targetAmount > 0 ? Math.max(0, Math.min(100, ((targetAmount - totalExpensesThisMonth) / targetAmount) * 100)) : 0;
  const overspending = totalExpensesThisMonth > targetAmount && targetAmount > 0;

  const handleSaveGoal = async () => {
    const amount = parseFloat(goalAmount);
    if (!amount || amount <= 0) return;
    if (currentGoal) {
      await updateSavingsGoal(currentGoal.id, { target_amount: amount });
    } else {
      await addSavingsGoal({
        name: `Monthly Goal ${format(now, 'MMMM yyyy')}`,
        target_amount: amount,
        current_amount: 0,
        deadline: endOfMonth(now),
      });
    }
    setIsEditing(false);
  };

  return (
    <Card className="shadow-soft border-0 max-w-xl mx-auto bg-white dark:bg-[#23272f] dark:text-gray-100">
      <CardHeader>
        <CardTitle className="text-2xl font-heading text-sage-dark dark:text-sage-light flex items-center gap-2">
          Monthly Savings Goal
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-gray-600 dark:text-gray-400 text-sm">Month</div>
            <div className="font-bold text-lg dark:text-white">{format(now, 'MMMM yyyy')}</div>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setGoalAmount(currentGoal ? currentGoal.target_amount.toString() : '');
              setIsEditing(true);
            }}
            className="px-6 py-2 font-bold text-white bg-gradient-to-r from-[#A8C488] to-[#87A96B] border-0 shadow-md rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg focus:scale-105 focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#A8C488] dark:from-[#A8C488] dark:to-[#87A96B] dark:text-white dark:border-0"
          >
            {currentGoal ? 'Update Goal' : 'Set Goal'}
          </Button>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="dark:text-gray-300">Target Amount</span>
            <span className="font-mono font-semibold text-sage-dark dark:text-green-300">${targetAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="dark:text-gray-300">Total Expenses</span>
            <span className="font-mono font-semibold text-bloom-coral dark:text-orange-300">${totalExpensesThisMonth.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="dark:text-gray-300">Amount Remaining</span>
            <span className="font-mono font-semibold text-sage-dark dark:text-blue-200">${remaining.toFixed(2)}</span>
          </div>
        </div>
        <div className="py-2">
          <Progress value={progress} className="h-3 bg-gray-200 dark:bg-[#181b20] [&>div]:bg-sage dark:[&>div]:bg-green-400" />
          <div className="text-center text-sm mt-1">
            {overspending ? (
              <span className="text-red-600 dark:text-red-400 font-semibold">Overspending! You have exceeded your goal.</span>
            ) : (
              <span className="text-sage-dark dark:text-green-300 font-semibold">{Math.round(progress)}% of goal achieved</span>
            )}
          </div>
        </div>
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent className="sm:max-w-md dark:bg-[#23272f] dark:text-gray-100">
            <DialogHeader>
              <DialogTitle className="text-sage-dark dark:text-sage-light font-heading">{currentGoal ? 'Update' : 'Set'} Monthly Savings Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Amount to Save This Month</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={goalAmount}
                  onChange={e => setGoalAmount(e.target.value)}
                  className="border-sage/20 focus:border-sage font-mono dark:bg-[#181b20] dark:text-white dark:border-sage/30"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1 dark:bg-[#181b20] dark:text-sage-light dark:border-sage/30 dark:hover:bg-[#23272f]">
                  Cancel
                </Button>
                <Button onClick={handleSaveGoal} className="flex-1 bg-sage hover:bg-sage-dark dark:bg-green-700 dark:hover:bg-green-600">
                  Save Goal
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default SavingsGoals;
