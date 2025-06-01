import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { useExpenses } from './ExpenseContext';
import { startOfWeek, endOfWeek, subWeeks, isSameDay } from 'date-fns';

export interface Notification {
  id: string;
  type: 'achievement' | 'warning' | 'nudge' | 'weekly_report';
  title: string;
  message: string;
  created_at: Date;
  is_read: boolean;
  icon?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'created_at' | 'is_read'>) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearNotification: (id: string) => Promise<void>;
  clearAllNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

function sendNudges({ user, expenses, savingsGoals, addNotification, notifications }: { user: any, expenses: any[], savingsGoals: any[], addNotification: any, notifications: Notification[] }) {
  if (!user) return;
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const currentGoal = savingsGoals.find(goal => {
    const deadline = new Date(goal.deadline);
    return deadline.getMonth() === currentMonth && deadline.getFullYear() === currentYear;
  });
  // Helper to check for duplicate nudge
  const hasNudge = (title: string, message: string) =>
    notifications.some(n => n.type === 'nudge' && n.title === title && n.message === message);

  if (currentGoal) {
    const expensesThisMonth = expenses.filter(e => e.date.getMonth() === currentMonth && e.date.getFullYear() === currentYear);
    const totalExpensesThisMonth = expensesThisMonth.reduce((sum, e) => sum + e.amount, 0);
    const progress = (currentGoal.target_amount - totalExpensesThisMonth) / currentGoal.target_amount;
    const title = "You're halfway to your savings goal!";
    const message = "Great job! Keep up the saving streak.";
    if (progress <= 0.5 && progress > 0.45 && !hasNudge(title, message)) {
      addNotification({
        type: 'nudge',
        title,
        message,
        icon: '🌱'
      });
    }
  }
  const thisWeekStart = startOfWeek(now, { weekStartsOn: 0 });
  const thisWeekEnd = endOfWeek(now, { weekStartsOn: 0 });
  const lastWeekStart = startOfWeek(subWeeks(now, 1), { weekStartsOn: 0 });
  const lastWeekEnd = endOfWeek(subWeeks(now, 1), { weekStartsOn: 0 });
  const entertainmentThisWeek = expenses.filter(e => e.category === 'entertainment' && e.date >= thisWeekStart && e.date <= thisWeekEnd).reduce((sum, e) => sum + e.amount, 0);
  const entertainmentLastWeek = expenses.filter(e => e.category === 'entertainment' && e.date >= lastWeekStart && e.date <= lastWeekEnd).reduce((sum, e) => sum + e.amount, 0);
  const entTitle = 'Your entertainment spending has doubled this week!';
  const entMessage = "Consider reviewing your fun budget.";
  if (entertainmentLastWeek > 0 && entertainmentThisWeek > 2 * entertainmentLastWeek && !hasNudge(entTitle, entMessage)) {
    addNotification({
      type: 'nudge',
      title: entTitle,
      message: entMessage,
      icon: '🎉'
    });
  }
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    return d;
  });
  const hadNoSpendDay = last7Days.some(day =>
    !expenses.some(e => isSameDay(e.date, day))
  );
  const noSpendTitle = 'Try a no-spend day tomorrow?';
  const noSpendMessage = "Challenge yourself to spend nothing for a day!";
  if (!hadNoSpendDay && !hasNudge(noSpendTitle, noSpendMessage)) {
    addNotification({
      type: 'nudge',
      title: noSpendTitle,
      message: noSpendMessage,
      icon: '💡'
    });
  }
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const { expenses, savingsGoals, isLoading } = useExpenses();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Fetch notifications from Supabase
  const fetchNotifications = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notifications:', error);
    } else {
      const formattedNotifications = data.map(notification => ({
        ...notification,
        created_at: new Date(notification.created_at)
      }));
      setNotifications(formattedNotifications);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    } else {
      setNotifications([]);
    }
  }, [user]);

  const addNotification = useCallback(async (notification: Omit<Notification, 'id' | 'created_at' | 'is_read'>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('notifications')
      .insert([
        {
          user_id: user.id,
          type: notification.type,
          title: notification.title,
          message: notification.message,
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error adding notification:', error);
    } else {
      const newNotification = {
        ...data,
        created_at: new Date(data.created_at),
        icon: notification.icon
      };
      setNotifications(prev => [newNotification, ...prev]);
    }
  }, [user]);

  const markAsRead = useCallback(async (id: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);

    if (error) {
      console.error('Error marking notification as read:', error);
    } else {
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id ? { ...notification, is_read: true } : notification
        )
      );
    }
  }, [user]);

  const markAllAsRead = useCallback(async () => {
    if (!user) return;

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);

    if (error) {
      console.error('Error marking all notifications as read:', error);
    } else {
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, is_read: true }))
      );
    }
  }, [user]);

  const clearNotification = useCallback(async (id: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error clearing notification:', error);
    } else {
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    }
  }, [user]);

  const clearAllNotifications = useCallback(async () => {
    if (!user) return;

    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      console.error('Error clearing all notifications:', error);
    } else {
      setNotifications([]);
    }
  }, [user]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  // Smart notification triggers (keep existing logic but simplified)
  useEffect(() => {
    if (!user) return;

    // Check for savings goal milestones
    savingsGoals.forEach(goal => {
      const progress = (goal.current_amount / goal.target_amount) * 100;
      
      if (progress >= 50 && progress < 55 && goal.current_amount > 0) {
        addNotification({
          type: 'achievement',
          title: 'Halfway There! 🎉',
          message: `You're 50% of the way to your "${goal.name}" goal! Keep up the great work!`,
          icon: '🎯'
        });
      }
      
      if (progress >= 100) {
        addNotification({
          type: 'achievement',
          title: 'Goal Achieved! 🏆',
          message: `Congratulations! You've reached your "${goal.name}" goal of $${goal.target_amount.toFixed(2)}!`,
          icon: '🏆'
        });
      }
    });
  }, [savingsGoals, addNotification, user]);

  // Add rule-based nudges
  useEffect(() => {
    if (user && !isLoading) {
      sendNudges({ user, expenses, savingsGoals, addNotification, notifications });
    }
  }, [user, expenses, savingsGoals, addNotification, isLoading, notifications]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotification,
        clearAllNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
