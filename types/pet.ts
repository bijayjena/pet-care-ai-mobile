// Core data types for Pet Care AI

export type PetType = 'dog' | 'cat';

export type HealthStatus = 'healthy' | 'caution' | 'urgent';

export interface Pet {
  id: string;
  name: string;
  type: PetType;
  photoUri?: string;
  breed?: string;
  age?: number;
  weight?: number;
  microchip?: string;
  allergies?: string[];
  medications?: Medication[];
  conditions?: string[];
  vetContact?: VetContact;
  createdAt: Date;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  startDate: Date;
  endDate?: Date;
  active: boolean;
}

export interface Reminder {
  id: string;
  petId: string;
  type: 'medication' | 'appointment' | 'grooming' | 'vaccination';
  title: string;
  description?: string;
  dueDate: Date;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface VetContact {
  name: string;
  clinicName: string;
  phone: string;
  email?: string;
  address?: string;
}

export interface SymptomAnalysis {
  id: string;
  petId: string;
  symptoms: string[];
  photoUri?: string;
  confidence: number;
  diagnosis: string;
  recommendation: string;
  urgency: HealthStatus;
  whenToCallVet: string[];
  timestamp: Date;
}

export interface ChatMessage {
  id: string;
  petId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
