// Care and wellness types

export type CareCategory = 'medication' | 'vaccination' | 'grooming' | 'hygiene' | 'appointment' | 'wellness' | 'deworming';

export type CareStatus = 'due' | 'overdue' | 'completed' | 'upcoming';

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

export interface VaccineRecord {
  id: string;
  petId: string;
  name: string;
  dueDate: Date;
  completedAt?: Date;
  status: CareStatus;
  notes?: string;
}

export interface DewormingRecord {
  id: string;
  petId: string;
  dueDate: Date;
  completedAt?: Date;
  status: CareStatus;
  weight?: number;
  notes?: string;
}
