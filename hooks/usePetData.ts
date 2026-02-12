import { useState, useEffect } from 'react';
import type { Pet, Reminder } from '@/types/pet';

// Mock data hook for pet information
export function usePetData() {
  const [pets, setPets] = useState<Pet[]>([
    {
      id: '1',
      name: 'Max',
      type: 'dog',
      photoUri: undefined,
      breed: 'Golden Retriever',
      age: 2,
      weight: 42,
      microchip: '556789012',
      allergies: ['Chicken'],
      medications: [
        {
          id: 'm1',
          name: 'Antibiotics',
          dosage: '250mg',
          frequency: 'daily',
          startDate: new Date('2026-02-10'),
          active: true,
        },
        {
          id: 'm2',
          name: 'Joint Supplement',
          dosage: '1 tablet',
          frequency: 'daily',
          startDate: new Date('2026-01-01'),
          active: true,
        },
      ],
      conditions: [],
      vetContact: {
        name: 'Dr. Lisa Chen',
        clinicName: 'Riverside Animal Care',
        phone: '5551234567',
        email: 'info@riversideanimalcare.com',
        address: '123 Main St, Riverside, CA',
      },
      createdAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      name: 'Luna',
      type: 'cat',
      photoUri: undefined,
      breed: 'Persian Cat',
      age: 4,
      weight: 10,
      microchip: '556789013',
      allergies: [],
      medications: [
        {
          id: 'm3',
          name: 'Flea Prevention',
          dosage: 'Topical',
          frequency: 'monthly',
          startDate: new Date('2026-01-15'),
          active: true,
        },
      ],
      conditions: [],
      vetContact: {
        name: 'Dr. Lisa Chen',
        clinicName: 'Riverside Animal Care',
        phone: '5551234567',
        email: 'info@riversideanimalcare.com',
        address: '123 Main St, Riverside, CA',
      },
      createdAt: new Date('2024-03-20'),
    },
  ]);

  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: 'r1',
      petId: '1',
      type: 'medication',
      title: 'Antibiotics',
      description: '250mg tablet',
      dueDate: new Date(),
      completed: false,
      priority: 'high',
    },
    {
      id: 'r2',
      petId: '2',
      type: 'medication',
      title: 'Flea prevention',
      description: 'Monthly treatment',
      dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      completed: false,
      priority: 'medium',
    },
    {
      id: 'r3',
      petId: '1',
      type: 'appointment',
      title: 'Vet checkup',
      description: 'Annual wellness exam',
      dueDate: new Date('2026-03-15'),
      completed: false,
      priority: 'medium',
    },
  ]);

  const completeReminder = (id: string) => {
    setReminders(prev =>
      prev.map(reminder =>
        reminder.id === id ? { ...reminder, completed: true } : reminder
      )
    );
  };

  const addReminder = (reminder: Omit<Reminder, 'id'>) => {
    const newReminder: Reminder = {
      ...reminder,
      id: `r${Date.now()}`,
    };
    setReminders(prev => [...prev, newReminder]);
  };

  return {
    pets,
    reminders,
    completeReminder,
    addReminder,
  };
}
