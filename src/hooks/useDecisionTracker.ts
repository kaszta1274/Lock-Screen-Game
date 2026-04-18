import { useState, useCallback } from 'react';
import type { NotificationData } from '@/lib/notifications';

export interface DecisionLog {
  notif: NotificationData;
  action: 'accept' | 'reject' | 'expire';
  timestamp: number;
}

export interface DecisionAnalysis {
  totalEarned: number;
  totalSpent: number;
  bestDecision: NotificationData | null;
  worstDecision: NotificationData | null;
  adviceCategory: "impulsive" | "ignorant" | "balanced" | "perfect";
}

export function useDecisionTracker() {
  const [logs, setLogs] = useState<DecisionLog[]>([]);

  const trackDecision = useCallback((notif: NotificationData, action: 'accept' | 'reject' | 'expire') => {
    // Only track actual financial events, ignore purely educational ones
    if ((notif as any).isEducational) return;
    setLogs((prev) => [...prev, { notif, action, timestamp: Date.now() }]);
  }, []);

  const resetTracker = useCallback(() => {
    setLogs([]);
  }, []);

  const getAnalysis = useCallback((): DecisionAnalysis => {
    let totalEarned = 0;
    let totalSpent = 0;
    
    let bestDecision: NotificationData | null = null;
    let worstDecision: NotificationData | null = null;
    
    let impulseExpenses = 0;
    let missedMandatory = 0;

    logs.forEach(log => {
      // 1. Calculate Earnings & Spending
      if (log.action === 'accept') {
        if (log.notif.value > 0) totalEarned += log.notif.value;
        if (log.notif.value < 0) {
           totalSpent += Math.abs(log.notif.value);
           if (!log.notif.isMandatory) impulseExpenses++;
        }
        
        if (!bestDecision || log.notif.value > bestDecision.value) {
           bestDecision = log.notif;
        }
        if (!worstDecision || log.notif.value < worstDecision.value) {
           worstDecision = log.notif;
        }
      }
      
      // 2. Track Ignore Patterns
      if (log.action === 'reject' || log.action === 'expire') {
         if (log.notif.isMandatory) missedMandatory++;
      }
      
      // 3. Penalty Tracking (they hit hard on expire typically)
      if (log.action === 'expire') {
         if (log.notif.isPenalty) {
             totalSpent += Math.abs(log.notif.value);
             if (!worstDecision || log.notif.value < worstDecision.value) {
                worstDecision = log.notif;
             }
         } else if (!log.notif.isMandatory && log.notif.value > 0) {
             // Missed income? Not necessarily, but default logic doesn't charge for it unless it's penalty.
             // Normally, simple expiration of an optional expense costs 10zł in the game loop.
             totalSpent += 10; 
         }
      }
    });

    // 4. Derive Advice Category
    let adviceCategory: DecisionAnalysis["adviceCategory"] = "balanced";
    if (missedMandatory >= 2) adviceCategory = "ignorant";
    else if (impulseExpenses >= 4) adviceCategory = "impulsive";
    else if (totalEarned > totalSpent && totalEarned > 0) adviceCategory = "perfect";

    return { totalEarned, totalSpent, bestDecision, worstDecision, adviceCategory };
  }, [logs]);

  return { trackDecision, getAnalysis, resetTracker };
}
