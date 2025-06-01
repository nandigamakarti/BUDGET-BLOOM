import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, LabelList } from 'recharts';
import { useExpenses } from '@/contexts/ExpenseContext';
import { useTheme } from '@/contexts/ThemeContext';
import { getCategoryConfig } from '@/components/CategoryIcon';
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { Progress } from '@/components/ui/progress';

const AnalyticsDashboard: React.FC = () => {
  const { 
    expenses, 
    getTotalExpenses, 
    getCategoryTotals, 
    getAverageDailySpending, 
    getTopCategory,
    savingsGoals,
    getMonthlyExpenses
  } = useExpenses();

  // Current month
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Find the goal for the current month
  const currentGoal = savingsGoals.find(goal => {
    const deadline = new Date(goal.deadline);
    return deadline.getMonth() === currentMonth && deadline.getFullYear() === currentYear;
  });
  const targetAmount = currentGoal ? currentGoal.target_amount : 0;
  const expensesThisMonth = getMonthlyExpenses(currentMonth, currentYear);
  const totalExpensesThisMonth = expensesThisMonth.reduce((sum, e) => sum + e.amount, 0);
  const remaining = Math.max(targetAmount - totalExpensesThisMonth, 0);
  const progress = targetAmount > 0 ? Math.max(0, Math.min(100, ((targetAmount - totalExpensesThisMonth) / targetAmount) * 100)) : 0;
  const overspending = totalExpensesThisMonth > targetAmount && targetAmount > 0;

  // Calculate analytics data
  const categoryTotals = useMemo(() => getCategoryTotals(), [expenses]);
  const totalExpenses = getTotalExpenses();
  const averageDailySpending = getAverageDailySpending();
  const topCategory = getTopCategory();

  // Prepare pie chart data
  const pieChartData = useMemo(() => {
    return Object.entries(categoryTotals).map(([category, amount]) => {
      const config = getCategoryConfig(category);
      return {
        name: config.name,
        value: amount,
        color: config.color.replace('text-', '').replace('category-', ''),
        category
      };
    });
  }, [categoryTotals]);

  // Calculate month-over-month comparison
  const currentMonthExpenses = useMemo(() => {
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);
    return expenses.filter(expense => 
      expense.date >= start && expense.date <= end
    ).reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses]);

  const lastMonthExpenses = useMemo(() => {
    const now = new Date();
    const lastMonthStart = startOfMonth(new Date(now.getFullYear(), now.getMonth() - 1));
    const lastMonthEnd = endOfMonth(new Date(now.getFullYear(), now.getMonth() - 1));
    return expenses.filter(expense => 
      expense.date >= lastMonthStart && expense.date <= lastMonthEnd
    ).reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses]);

  const monthOverMonthChange = lastMonthExpenses > 0 ? ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100 : 0;

  // Prepare daily spending data for the last 30 days
  const dailySpendingData = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => {
      const date = subDays(new Date(), 29 - i);
      const dayExpenses = expenses.filter(expense =>
        format(expense.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      );
      const total = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      return {
        date: format(date, 'MMM dd'),
        amount: total,
        fullDate: date
      };
    });
  }, [expenses]);

  // Prepare weekly spending data for the last 4 weeks
  const weeklySpendingData = useMemo(() => {
    const weeks = [];
    for (let w = 0; w < 4; w++) {
      const weekEnd = subDays(new Date(), w * 7); // today, 7 days ago, etc.
      const weekStart = subDays(weekEnd, 6); // 6 days before weekEnd
      const weekExpenses = expenses.filter(expense =>
        expense.date >= weekStart && expense.date <= weekEnd
      );
      const total = weekExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      weeks.push({
        week: `Week ${4 - w}`,
        amount: total,
        range: `${format(weekStart, 'MMM dd')} - ${format(weekEnd, 'MMM dd')}`
      });
    }
    return weeks.reverse();
  }, [expenses]);

  const [barMode, setBarMode] = useState<'daily' | 'weekly'>('daily');

  const categoryColors = {
    food: '#FF6B6B',
    transport: '#4ECDC4',
    entertainment: '#45B7D1',
    shopping: '#96CEB4',
    health: '#FFEAA7',
    other: '#DDA0DD'
  };

  // Find the max spending value for highlighting
  const maxAmount = (barMode === 'daily' ? dailySpendingData : weeklySpendingData).reduce((max, d) => d.amount > max ? d.amount : max, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-sage-dark dark:text-sage-light">Analytics Dashboard</h2>
        <p className="text-gray-600 dark:text-gray-300">Insights into your spending patterns and financial health</p>
      </div>

      {/* Savings Goal Progress Bar */}
      <Card className="shadow-soft border-0 max-w-xl mx-auto bg-white dark:bg-[#23272f] dark:text-gray-100">
        <CardHeader>
          <CardTitle className="text-lg font-heading text-sage-dark dark:text-sage-light flex items-center gap-2">
            Monthly Savings Goal Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-6">
            {/* Progress Ring */}
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16" viewBox="0 0 64 64">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="#E5E7EB"
                  strokeWidth="6"
                  fill="none"
                  className="dark:stroke-[#181b20]"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="#87A96B"
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray={2 * Math.PI * 28}
                  strokeDashoffset={2 * Math.PI * 28 * (1 - progress / 100)}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                  className="dark:stroke-green-400"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-sage-dark dark:text-green-300">{Math.round(progress)}%</span>
              </div>
            </div>
            {/* Progress Bar and Stats */}
            <div className="flex-1 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="dark:text-gray-300">Target</span>
                <span className="font-mono font-semibold text-sage-dark dark:text-green-300">${targetAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="dark:text-gray-300">Spent</span>
                <span className="font-mono font-semibold text-bloom-coral dark:text-orange-300">${totalExpensesThisMonth.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="dark:text-gray-300">Remaining</span>
                <span className="font-mono font-semibold text-sage-dark dark:text-blue-200">${remaining.toFixed(2)}</span>
              </div>
              <Progress value={progress} className="h-3 bg-gray-200 dark:bg-[#181b20] [&>div]:bg-sage dark:[&>div]:bg-green-400" />
              <div className="text-center text-sm mt-1">
                {overspending ? (
                  <span className="text-red-600 dark:text-red-400 font-semibold">Overspending! You have exceeded your goal.</span>
                ) : (
                  <span className="text-sage-dark dark:text-green-300 font-semibold">{Math.round(progress)}% of goal achieved</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-soft border-0 hover:shadow-lift transition-all duration-200 hover:-translate-y-1 bg-white dark:bg-[#23272f] dark:text-gray-100">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Spent</CardTitle>
              <DollarSign className="w-4 h-4 text-sage dark:text-green-300" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-mono font-bold text-sage-dark dark:text-green-300">
              ${totalExpenses.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {expenses.length} transactions
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-0 hover:shadow-lift transition-all duration-200 hover:-translate-y-1 bg-white dark:bg-[#23272f] dark:text-gray-100">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Daily Average</CardTitle>
              <Calendar className="w-4 h-4 text-bloom-coral dark:text-orange-300" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-mono font-bold text-sage-dark dark:text-green-300">
              ${averageDailySpending.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              per day
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-0 hover:shadow-lift transition-all duration-200 hover:-translate-y-1 bg-white dark:bg-[#23272f] dark:text-gray-100">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Top Category</CardTitle>
              <div className={`w-4 h-4 rounded ${getCategoryConfig(topCategory).bgColor}`} />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-sage-dark dark:text-green-300">
              {getCategoryConfig(topCategory).name}
            </p>
            <p className="text-sm font-mono text-gray-600 dark:text-gray-400 mt-1">
              ${(categoryTotals[topCategory] || 0).toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-0 hover:shadow-lift transition-all duration-200 hover:-translate-y-1 bg-white dark:bg-[#23272f] dark:text-gray-100">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Monthly Change</CardTitle>
              {monthOverMonthChange >= 0 ? (
                <TrendingUp className="w-4 h-4 text-red-500 dark:text-red-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-green-500 dark:text-green-300" />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-mono font-bold ${monthOverMonthChange >= 0 ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-300'}`}>
              {monthOverMonthChange >= 0 ? '+' : ''}{monthOverMonthChange.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              vs last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown Pie Chart */}
        <Card className="shadow-soft border-0 bg-white dark:bg-[#23272f] dark:text-gray-100">
          <CardHeader>
            <CardTitle className="font-heading text-sage-dark dark:text-sage-light">Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {pieChartData.length > 0 ? (
              <ChartContainer
                config={{
                  expenses: {
                    label: "Expenses",
                  },
                }}
                className="h-[300px] bg-white dark:bg-[#23272f] dark:text-gray-100 rounded-xl"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={categoryColors[entry.category as keyof typeof categoryColors]} 
                          stroke="#23272f"
                          strokeWidth={1}
                          className="dark:stroke-[#181b20]"
                        />
                      ))}
                    </Pie>
                    <ChartTooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          const value = typeof data.value === 'number' ? data.value : parseFloat(data.value) || 0;
                          return (
                            <div className="bg-white dark:bg-[#23272f] p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 text-sage-dark dark:text-sage-light">
                              <p className="font-medium">{data.name}</p>
                              <p className="text-sm font-mono text-sage-dark dark:text-green-300">
                                ${value.toFixed(2)}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {((value / totalExpenses) * 100).toFixed(1)}% of total
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500 dark:text-gray-400">
                <p>No expense data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Daily Spending Bar Chart */}
        <Card className="shadow-soft border-0 bg-white dark:bg-[#23272f] dark:text-gray-100">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-heading text-sage-dark dark:text-sage-light">
                {barMode === 'daily' ? 'Daily Spending (Last 30 Days)' : 'Weekly Spending (Last 4 Weeks)'}
              </CardTitle>
              <div className="flex gap-2">
                <button
                  className={`px-3 py-1 rounded border text-sm ${barMode === 'daily' ? 'bg-sage text-white border-sage dark:bg-green-700 dark:border-green-400' : 'bg-white text-sage border-sage/30 dark:bg-[#23272f] dark:text-sage-light dark:border-sage/30'}`}
                  onClick={() => setBarMode('daily')}
                >
                  Daily
                </button>
                <button
                  className={`px-3 py-1 rounded border text-sm ${barMode === 'weekly' ? 'bg-sage text-white border-sage dark:bg-green-700 dark:border-green-400' : 'bg-white text-sage border-sage/30 dark:bg-[#23272f] dark:text-sage-light dark:border-sage/30'}`}
                  onClick={() => setBarMode('weekly')}
                >
                  Weekly
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                amount: {
                  label: "Amount",
                  color: "#87A96B",
                },
              }}
              className="h-[300px] bg-white dark:bg-[#23272f] dark:text-gray-100 rounded-xl"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={barMode === 'daily' ? dailySpendingData : weeklySpendingData} 
                  barCategoryGap={barMode === 'daily' ? 2 : 20}
                  margin={{ top: 16, right: 0, left: 0, bottom: 0 }}
                >
                  <CartesianGrid stroke="#E5E7EB" strokeDasharray="4 4" vertical={false} className="dark:stroke-[#181b20]" />
                  <XAxis
                    dataKey={barMode === 'daily' ? 'date' : 'range'}
                    interval={barMode === 'daily' ? 2 : 0}
                    tick={props => (
                      <text
                        {...props}
                        style={{
                          fontSize: 10,
                          fontWeight: 500,
                          transform: 'rotate(0deg)',
                          textAnchor: 'middle',
                          dominantBaseline: 'hanging',
                          fill: '#222',
                          ...(document.documentElement.classList.contains('dark') ? { fill: '#e5e7eb' } : {})
                        }}
                        y={props.y + 10}
                      >
                        {props.payload.value}
                      </text>
                    )}
                    axisLine={false}
                    tickLine={false}
                    height={30}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: '#222', ...(document.documentElement.classList.contains('dark') ? { fill: '#e5e7eb' } : {}) }}
                    axisLine={false}
                    tickLine={false}
                    width={40}
                    tickFormatter={v => `$${v}`}
                    domain={[0, dataMax => Math.max(dataMax, 10)]}
                    allowDecimals={false}
                    padding={{ top: 10, bottom: 10 }}
                  />
                  <ChartTooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const value = payload[0].value;
                        const amount = typeof value === 'number' ? value : parseFloat(String(value)) || 0;
                        return (
                          <div className="bg-white dark:bg-[#23272f] p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 text-sage-dark dark:text-sage-light">
                            <p className="font-medium">{label}</p>
                            <p className="text-sm font-mono text-sage-dark dark:text-green-300">
                              ${amount.toFixed(2)}
                            </p>
                            {barMode === 'weekly' && (
                              <p className="text-xs text-gray-500 dark:text-gray-400">{weeklySpendingData.find(w => w.week === label)?.range}</p>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="amount"
                    fill="url(#barGradientModern)"
                    radius={[8, 8, 0, 0]}
                    isAnimationActive={true}
                    animationDuration={800}
                    barSize={barMode === 'daily' ? 20 : 40}
                    shape={props => {
                      const { x, y, width, height } = props;
                      return (
                        <g>
                          {/* Subtle shadow */}
                          <rect
                            x={x}
                            y={y + 6}
                            width={width}
                            height={height}
                            rx={8}
                            fill="#000"
                            opacity={0.06}
                          />
                          {/* Main bar */}
                          <rect
                            x={x}
                            y={y}
                            width={width}
                            height={height}
                            rx={8}
                            fill="url(#barGradientModern)"
                          />
                        </g>
                      );
                    }}
                  >
                  </Bar>
                  <defs>
                    <linearGradient id="barGradientModern" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7EE8FA" />
                      <stop offset="100%" stopColor="#87A96B" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
