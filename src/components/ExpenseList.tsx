import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useExpenses, Expense } from '@/contexts/ExpenseContext';
import { toast } from '@/hooks/use-toast';
import { format, subDays, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { Trash2, Filter, Edit2, Calendar, CalendarIcon } from 'lucide-react';
import CategoryIcon, { getCategoryConfig } from './CategoryIcon';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import EditExpenseForm from './EditExpenseForm';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from '@/components/ui/alert-dialog';

type DateRange = {
  from: Date;
  to: Date;
};

const ExpenseList: React.FC = () => {
  const { expenses, deleteExpense, updateExpense, getTotalExpenses } = useExpenses();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date())
  });
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [dateFilter, setDateFilter] = useState<'last7' | 'thisMonth' | 'custom'>('thisMonth');
  const [deleteDialog, setDeleteDialog] = useState<{id: string, description: string, amount: number} | null>(null);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'food', label: 'Food & Dining' },
    { value: 'transport', label: 'Transportation' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'health', label: 'Health & Wellness' },
    { value: 'other', label: 'Other' }
  ];

  const sortOptions = [
    { value: 'date', label: 'Newest' },
    { value: 'amount', label: 'Highest amount' }
  ];

  const dateRangePresets = [
    {
      label: 'Last 7 Days',
      value: {
        from: subDays(new Date(), 7),
        to: new Date()
      }
    },
    {
      label: 'This Month',
      value: {
        from: startOfMonth(new Date()),
        to: endOfMonth(new Date())
      }
    },
    {
      label: 'Last Month',
      value: {
        from: startOfMonth(subDays(new Date(), 30)),
        to: endOfMonth(subDays(new Date(), 30))
      }
    }
  ];

  const filteredAndSortedExpenses = React.useMemo(() => {
    // Create a copy to avoid mutating the original array
    let filtered = [...expenses];

    // Filter by category
    if (filterCategory !== 'all') {
      filtered = filtered.filter(expense => expense.category === filterCategory);
    }

    // Filter by date range
    if (dateRange.from && dateRange.to) {
      filtered = filtered.filter(expense => {
        // Ensure expense.date is a valid Date object
        const expenseDate = expense.date instanceof Date ? expense.date : new Date(expense.date);
        
        // Add one day to end date to include the entire day
        const endDate = new Date(dateRange.to);
        endDate.setDate(endDate.getDate() + 1);
        
        // Check if the expense date is within the selected range
        return expenseDate >= dateRange.from && expenseDate < endDate;
      });
    }

    // Sort expenses
    if (sortBy === 'date') {
      filtered.sort((a, b) => {
        const dateA = a.date instanceof Date ? a.date : new Date(a.date);
        const dateB = b.date instanceof Date ? b.date : new Date(b.date);
        return dateB.getTime() - dateA.getTime(); // Newest first
      });
    } else if (sortBy === 'amount') {
      filtered.sort((a, b) => b.amount - a.amount); // Highest first
    }
    
    return filtered;
  }, [expenses, filterCategory, sortBy, dateRange]);

  const handleDeleteExpense = async (id: string, description: string, amount: number) => {
    setDeleteDialog({ id, description, amount });
  };

  const confirmDeleteExpense = async () => {
    if (!deleteDialog) return;
    try {
      await deleteExpense(deleteDialog.id);
      toast({
        title: "Expense deleted",
        description: `"${deleteDialog.description}" has been removed from your expenses.`,
      });
    } catch (error) {
      toast({
        title: "Error deleting expense",
        description: "Please try again.",
        variant: "destructive",
      });
    }
    setDeleteDialog(null);
  };

  const handleEditExpense = async (expense: Expense) => {
    setEditingExpense(expense);
  };

  const handleUpdateExpense = async (updatedExpense: Expense) => {
    try {
      await updateExpense(updatedExpense.id, updatedExpense);
      setEditingExpense(null);
      toast({
        title: "Expense updated",
        description: "Your expense has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error updating expense",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDateFilter = (filter: 'last7' | 'thisMonth' | 'custom') => {
    setDateFilter(filter);
    if (filter === 'last7') {
      setDateRange({ from: subDays(new Date(), 6), to: new Date() });
    } else if (filter === 'thisMonth') {
      setDateRange({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) });
    }
    // For 'custom', do nothing (calendar popover will open)
  };

  const EmptyState = () => (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-gradient-to-r from-sage-light to-sage rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-white text-2xl">💸</span>
      </div>
      <h3 className="text-lg font-heading text-sage-dark mb-2">No expenses found</h3>
      <p className="text-gray-600 mb-4">
        {filterCategory !== 'all' 
          ? `No expenses found in ${categories.find(c => c.value === filterCategory)?.label}`
          : 'No expenses found in the selected date range'
        }
      </p>
      <div className="flex gap-2 justify-center">
        {filterCategory !== 'all' && (
          <Button
            variant="outline"
            onClick={() => setFilterCategory('all')}
            className="text-sage border-sage hover:bg-sage hover:text-white"
          >
            View All Categories
          </Button>
        )}
        <Button
          variant="outline"
          onClick={() => {
            setDateRange({
              from: startOfMonth(new Date()),
              to: endOfMonth(new Date())
            });
            setDateFilter('thisMonth');
          }}
          className="text-sage border-sage hover:bg-sage hover:text-white"
        >
          Reset Date Range
        </Button>
      </div>
    </div>
  );

  return (
    <Card className="shadow-soft border-0 bg-white dark:bg-[#23272f] dark:text-gray-100">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-xl font-heading text-sage-dark flex items-center gap-2 dark:text-sage-light">
            <div className="w-8 h-8 bg-gradient-to-r from-sage to-sage-light rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">📋</span>
            </div>
            Expense History
            {expenses.length > 0 && (
              <Badge variant="secondary" className="bg-sage/10 text-sage border-sage/20 dark:bg-green-900 dark:text-green-200 dark:border-green-700">
                {filteredAndSortedExpenses.length} of {expenses.length}
              </Badge>
            )}
          </CardTitle>
          
          {expenses.length > 0 && (
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-300">Total Expenses</p>
              <p className="text-2xl font-mono font-bold text-sage-dark dark:text-[#A8C488]">
                ${getTotalExpenses().toFixed(2)}
              </p>
            </div>
          )}
        </div>
      </CardHeader>
      
      {expenses.length > 0 && (
        <CardContent className="pt-0">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-gray-50 rounded-lg dark:bg-[#181b20]">
            <div className="flex items-center gap-2 flex-1">
              <Filter size={16} className="text-sage dark:text-green-300" />
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="border-gray-200 focus:border-sage dark:bg-[#23272f] dark:border-gray-700 dark:focus:border-green-400 dark:text-gray-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-[#23272f] border-2 border-gray-100 dark:border-gray-700 shadow-soft rounded-lg dark:text-gray-100">
                  {categories.map((cat) => (
                    <SelectItem 
                      key={cat.value} 
                      value={cat.value}
                      className="cursor-pointer hover:bg-sage/5 dark:hover:bg-green-900"
                    >
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Dropdown Filter */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <CalendarIcon size={16} className="text-sage dark:text-green-300" />
                <span className="text-gray-600 text-sm dark:text-gray-300">Date:</span>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-40 border-gray-200 focus:border-sage dark:bg-[#23272f] dark:border-gray-700 dark:focus:border-green-400 dark:text-gray-100 justify-between"
                  >
                    {dateFilter === 'last7' && "Last 7 Days"}
                    {dateFilter === 'thisMonth' && "This Month"}
                    {dateFilter === 'custom' && (
                      dateRange.from && dateRange.to 
                        ? `${format(dateRange.from, 'MMM d')} - ${format(dateRange.to, 'MMM d')}` 
                        : "Custom Range"
                    )}
                    <CalendarIcon className="ml-2 h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 dark:bg-[#23272f] dark:text-gray-100" align="start">
                  <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 gap-1">
                      <Button 
                        variant="ghost" 
                        className="justify-start font-normal hover:bg-sage/10 hover:text-sage dark:hover:bg-green-900"
                        onClick={() => handleDateFilter('last7')}
                      >
                        Last 7 Days
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="justify-start font-normal hover:bg-sage/10 hover:text-sage dark:hover:bg-green-900"
                        onClick={() => handleDateFilter('thisMonth')}
                      >
                        This Month
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="justify-start font-normal hover:bg-sage/10 hover:text-sage dark:hover:bg-green-900"
                        onClick={() => {
                          // Just open the calendar for custom selection
                          setDateFilter('custom');
                        }}
                      >
                        Custom Range
                      </Button>
                    </div>
                  </div>
                  {dateFilter === 'custom' && (
                    <CalendarComponent
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={(range: any) => {
                        if (range?.from && range?.to) {
                          setDateRange(range);
                          setDateFilter('custom');
                        }
                      }}
                      numberOfMonths={1}
                      className="dark:bg-[#23272f] dark:text-gray-100"
                    />
                  )}
                </PopoverContent>
              </Popover>
            </div>

            {/* Sort by Dropdown */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Filter size={16} className="text-sage dark:text-green-300" />
                <span className="text-gray-600 text-sm dark:text-gray-300">Sort by:</span>
              </div>
              <Select defaultValue="date" value={sortBy} onValueChange={(value) => setSortBy(value as 'date' | 'amount')}>
                <SelectTrigger className="w-40 border-gray-200 focus:border-sage dark:bg-[#23272f] dark:border-gray-700 dark:focus:border-green-400 dark:text-gray-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-[#23272f] border-2 border-gray-100 dark:border-gray-700 shadow-soft rounded-lg dark:text-gray-100">
                  {sortOptions.map((option) => (
                    <SelectItem 
                      key={option.value} 
                      value={option.value}
                      className="cursor-pointer hover:bg-sage/5 dark:hover:bg-green-900"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Expense List */}
          {filteredAndSortedExpenses.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-3">
              {filteredAndSortedExpenses.map((expense) => {
                const categoryConfig = getCategoryConfig(expense.category);
                
                return (
                  <div
                    key={expense.id}
                    className="flex items-center gap-4 p-4 bg-white border-l-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 group dark:bg-[#23272f] dark:border-[#A8C488] dark:shadow-none dark:hover:shadow-lg"
                    style={{ borderLeftColor: categoryConfig.color }}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" 
                           style={{ backgroundColor: `${categoryConfig.color}20` }}>
                        <CategoryIcon category={expense.category} size={20} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900 truncate dark:text-gray-100">
                            {expense.description}
                          </h4>
                          <Badge 
                            variant="outline" 
                            className="text-xs dark:bg-[#181b20] dark:text-[#A8C488] dark:border-[#A8C488]"
                            style={{ color: categoryConfig.color }}
                          >
                            {categoryConfig.name}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                          <span>{format(new Date(2025, 5, expense.date.getDate()), 'MMM dd, yyyy')}</span>
                          {expense.note && (
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded truncate max-w-40 dark:bg-[#23272f] dark:text-gray-300">
                              {expense.note}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-lg text-gray-900 dark:text-[#A8C488]">
                        ${expense.amount.toFixed(2)}
                      </span>
                      
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditExpense(expense)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-400 hover:text-sage hover:bg-sage/10 dark:text-gray-300 dark:hover:text-green-300 dark:hover:bg-green-900"
                        >
                          <Edit2 size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteExpense(expense.id, expense.description, expense.amount)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-400 hover:text-bloom-coral hover:bg-bloom-coral/10 dark:text-gray-300 dark:hover:text-red-400 dark:hover:bg-red-900"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      )}

      {editingExpense && (
        <EditExpenseForm
          expense={editingExpense}
          onUpdate={handleUpdateExpense}
          onClose={() => setEditingExpense(null)}
        />
      )}

      {deleteDialog && (
        <AlertDialog open={!!deleteDialog} onOpenChange={open => { if (!open) setDeleteDialog(null); }}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Expense</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete <span className="font-semibold">"{deleteDialog.description}"</span> (<span className="font-mono">${deleteDialog.amount.toFixed(2)}</span>)? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteExpense} className="bg-bloom-coral text-white hover:bg-red-600">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </Card>
  );
};

export default ExpenseList;
