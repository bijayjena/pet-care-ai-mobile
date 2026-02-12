// Care and wellness types

export type CareCategory = 'medication' | 'vaccination' | 'grooming' | 'hygiene' | 'appointment' | 'wellness';

export interface CareTask {
  id: string;
  petId: string;
  category: CareCategory;
  title: string;
  description: string;
  dueDate: Date;
  completed: boolean;
  completedAt?: Date;
  priority: 'low' | 'medium' | 'high';
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    nextDue?: Date;
  };
}

export interface CareHistory {
  id: string;
  petId: string;
  category: CareCategory;
  title: string;
  description?: string;
  completedAt: Date;
}
