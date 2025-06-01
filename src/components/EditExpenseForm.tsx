import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Expense } from '@/contexts/ExpenseContext';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import CategoryIcon from './CategoryIcon';

const categories = [
  { value: 'food', label: 'Food & Dining' },
  { value: 'transport', label: 'Transportation' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'health', label: 'Health & Wellness' },
  { value: 'other', label: 'Other' }
];

interface EditExpenseFormProps {
  expense: Expense;
  onUpdate: (expense: Expense) => Promise<void>;
  onClose: () => void;
}

const EditExpenseForm: React.FC<EditExpenseFormProps> = ({ expense, onUpdate, onClose }) => {
  const [amount, setAmount] = useState(expense.amount.toString());
  const [category, setCategory] = useState(expense.category);
  const [description, setDescription] = useState(expense.description);
  const [note, setNote] = useState(expense.note || '');
  const [date, setDate] = useState<Date>(expense.date);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0';
    }

    if (!category) {
      newErrors.category = 'Please select a category';
    }

    if (!description.trim()) {
      newErrors.description = 'Please enter a description';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await onUpdate({
        ...expense,
        amount: Number(amount),
        category: category as any,
        description: description.trim(),
        note: note.trim() || undefined,
        date
      });
      onClose();
    } catch (error) {
      // Error is handled by the parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatAmount = (value: string) => {
    // Remove non-numeric characters except decimal point
    const cleaned = value.replace(/[^\d.]/g, '');
    
    // Ensure only one decimal point
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('');
    }
    
    // Limit decimal places to 2
    if (parts[1] && parts[1].length > 2) {
      return parts[0] + '.' + parts[1].slice(0, 2);
    }
    
    return cleaned;
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-heading text-sage-dark flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-sage to-sage-light rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">✏️</span>
            </div>
            Edit Expense
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label 
                htmlFor="amount" 
                className={`text-sm font-medium transition-colors duration-200 ${
                  errors.amount ? 'text-bloom-coral' : 'text-gray-700'
                }`}
              >
                Amount
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-mono">
                  $
                </span>
                <Input
                  id="amount"
                  type="text"
                  value={amount}
                  onChange={(e) => {
                    const formatted = formatAmount(e.target.value);
                    setAmount(formatted);
                    if (errors.amount) setErrors(prev => ({ ...prev, amount: undefined }));
                  }}
                  className={`pl-8 font-mono text-lg rounded-lg border-2 transition-all duration-200 focus:ring-2 focus:ring-sage/20 ${
                    errors.amount 
                      ? 'border-bloom-coral focus:border-bloom-coral' 
                      : 'border-gray-200 focus:border-sage'
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.amount && (
                <p className="text-sm text-bloom-coral animate-fade-in">{errors.amount}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label 
                htmlFor="category"
                className={`text-sm font-medium transition-colors duration-200 ${
                  errors.category ? 'text-bloom-coral' : 'text-gray-700'
                }`}
              >
                Category
              </Label>
              <Select 
                value={category} 
                onValueChange={(value) => {
                  setCategory(value);
                  if (errors.category) setErrors(prev => ({ ...prev, category: undefined }));
                }}
              >
                <SelectTrigger className={`rounded-lg border-2 transition-all duration-200 focus:ring-2 focus:ring-sage/20 ${
                  errors.category 
                    ? 'border-bloom-coral focus:border-bloom-coral' 
                    : 'border-gray-200 focus:border-sage'
                }`}>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-gray-100 shadow-soft rounded-lg">
                  {categories.map((cat) => (
                    <SelectItem 
                      key={cat.value} 
                      value={cat.value}
                      className="cursor-pointer hover:bg-sage/5 focus:bg-sage/10"
                    >
                      <div className="flex items-center gap-2">
                        <CategoryIcon category={cat.value as any} size={16} />
                        <span>{cat.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-bloom-coral animate-fade-in">{errors.category}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label 
              htmlFor="description"
              className={`text-sm font-medium transition-colors duration-200 ${
                errors.description ? 'text-bloom-coral' : 'text-gray-700'
              }`}
            >
              Description
            </Label>
            <Input
              id="description"
              type="text"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors(prev => ({ ...prev, description: undefined }));
              }}
              className={`rounded-lg border-2 transition-all duration-200 focus:ring-2 focus:ring-sage/20 ${
                errors.description 
                  ? 'border-bloom-coral focus:border-bloom-coral' 
                  : 'border-gray-200 focus:border-sage'
              }`}
              placeholder="What was this expense for?"
            />
            {errors.description && (
              <p className="text-sm text-bloom-coral animate-fade-in">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-medium text-gray-700">
                Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal rounded-lg border-2 border-gray-200 hover:border-sage focus:border-sage focus:ring-2 focus:ring-sage/20",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note" className="text-sm font-medium text-gray-700">
                Note (Optional)
              </Label>
              <Textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="rounded-lg border-2 border-gray-200 focus:border-sage focus:ring-2 focus:ring-sage/20"
                placeholder="Add any additional details..."
                rows={1}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="text-gray-600 border-gray-200 hover:border-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-sage hover:bg-sage-dark text-white"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditExpenseForm; 