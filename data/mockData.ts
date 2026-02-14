import type { Pet, Reminder } from '@/types/pet';
import type { Meal } from '@/types/diet';
import type { CareTask, CareHistory, VaccineRecord, DewormingRecord } from '@/types/care';

// Mock Pets Data
export const mockPets: Pet[] = [
  {
    id: 'pet_1',
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
        id: 'med_1',
        name: 'Antibiotics',
        dosage: '250mg',
        frequency: 'daily',
        startDate: new Date('2026-02-10'),
        active: true,
      },
      {
        id: 'med_2',
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
    id: 'pet_2',
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
        id: 'med_3',
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
];

// Mock Reminders Data
export const mockReminders: Reminder[] = [
  {
    id: 'reminder_1',
    petId: 'pet_1',
    type: 'medication',
    title: 'Antibiotics',
    description: '250mg tablet, twice daily',
    dueDate: new Date(),
    completed: false,
    priority: 'high',
  },
  {
    id: 'reminder_2',
    petId: 'pet_2',
    type: 'medication',
    title: 'Flea Prevention',
    description: 'Monthly topical treatment',
    dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    completed: false,
    priority: 'medium',
  },
  {
    id: 'reminder_3',
    petId: 'pet_1',
    type: 'appointment',
    title: 'Vet Checkup',
    description: 'Annual wellness exam',
    dueDate: new Date('2026-03-15T10:00:00'),
    completed: false,
    priority: 'medium',
  },
  {
    id: 'reminder_4',
    petId: 'pet_2',
    type: 'grooming',
    title: 'Nail Trim',
    description: 'Monthly nail maintenance',
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    completed: false,
    priority: 'low',
  },
  {
    id: 'reminder_5',
    petId: 'pet_1',
    type: 'medication',
    title: 'Joint Supplement',
    description: 'Daily supplement',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // In 2 days
    completed: false,
    priority: 'medium',
  },
  {
    id: 'reminder_6',
    petId: 'pet_2',
    type: 'appointment',
    title: 'Dental Cleaning',
    description: 'Professional teeth cleaning',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // In 5 days
    completed: false,
    priority: 'medium',
  },
  {
    id: 'reminder_7',
    petId: 'pet_1',
    type: 'vaccination',
    title: 'Rabies Booster',
    description: 'Annual vaccination',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // In 1 week
    completed: false,
    priority: 'high',
  },
  {
    id: 'reminder_8',
    petId: 'pet_2',
    type: 'grooming',
    title: 'Bath & Brush',
    description: 'Full grooming session',
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // In 10 days
    completed: false,
    priority: 'low',
  },
];

// Mock Meals Data
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

export const mockMeals: Meal[] = [
  // Max's meals - today
  {
    id: 'meal_1',
    petId: 'pet_1',
    mealType: 'breakfast',
    time: '8:00 AM',
    food: 'Premium Dry Food',
    amount: '2 cups',
    calories: 450,
    completed: true,
    completedAt: new Date(today.setHours(8, 15, 0)),
    scheduledDate: new Date(today.setHours(8, 0, 0)),
  },
  {
    id: 'meal_2',
    petId: 'pet_1',
    mealType: 'dinner',
    time: '6:00 PM',
    food: 'Premium Dry Food',
    amount: '2 cups',
    calories: 450,
    completed: false,
    scheduledDate: new Date(today.setHours(18, 0, 0)),
  },
  // Luna's meals - today
  {
    id: 'meal_3',
    petId: 'pet_2',
    mealType: 'breakfast',
    time: '7:30 AM',
    food: 'Wet Cat Food',
    amount: '1 can',
    calories: 180,
    completed: true,
    completedAt: new Date(today.setHours(7, 45, 0)),
    scheduledDate: new Date(today.setHours(7, 30, 0)),
  },
  {
    id: 'meal_4',
    petId: 'pet_2',
    mealType: 'dinner',
    time: '5:30 PM',
    food: 'Wet Cat Food',
    amount: '1 can',
    calories: 180,
    completed: false,
    scheduledDate: new Date(today.setHours(17, 30, 0)),
  },
  // Tomorrow's meals
  {
    id: 'meal_5',
    petId: 'pet_1',
    mealType: 'breakfast',
    time: '8:00 AM',
    food: 'Premium Dry Food',
    amount: '2 cups',
    calories: 450,
    completed: false,
    scheduledDate: new Date(tomorrow.setHours(8, 0, 0)),
  },
  {
    id: 'meal_6',
    petId: 'pet_2',
    mealType: 'breakfast',
    time: '7:30 AM',
    food: 'Wet Cat Food',
    amount: '1 can',
    calories: 180,
    completed: false,
    scheduledDate: new Date(tomorrow.setHours(7, 30, 0)),
  },
];

// Mock Care Tasks Data
export const mockCareTasks: CareTask[] = [
  {
    id: 'task_1',
    petId: 'pet_1',
    category: 'medication',
    title: 'Antibiotics',
    description: '250mg tablet',
    dueDate: new Date(),
    completed: false,
    priority: 'high',
  },
  {
    id: 'task_2',
    petId: 'pet_2',
    category: 'grooming',
    title: 'Nail Trim',
    description: 'Scheduled appointment',
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    completed: false,
    priority: 'medium',
  },
  {
    id: 'task_3',
    petId: 'pet_1',
    category: 'vaccination',
    title: 'Rabies Booster',
    description: 'Annual vaccination',
    dueDate: new Date('2026-03-15'),
    completed: false,
    priority: 'medium',
    recurring: {
      frequency: 'yearly',
    },
  },
  {
    id: 'task_4',
    petId: 'pet_2',
    category: 'medication',
    title: 'Flea Prevention',
    description: 'Monthly treatment',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // In 2 days
    completed: false,
    priority: 'medium',
    recurring: {
      frequency: 'monthly',
    },
  },
  {
    id: 'task_5',
    petId: 'pet_1',
    category: 'wellness',
    title: 'Weight Check',
    description: 'Monthly weight monitoring',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // In 1 week
    completed: false,
    priority: 'low',
    recurring: {
      frequency: 'monthly',
    },
  },
  {
    id: 'task_6',
    petId: 'pet_2',
    category: 'hygiene',
    title: 'Teeth Cleaning',
    description: 'Dental hygiene check',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // In 2 weeks
    completed: false,
    priority: 'low',
  },
];

// Mock Care History Data
export const mockCareHistory: CareHistory[] = [
  {
    id: 'history_1',
    petId: 'pet_1',
    category: 'grooming',
    title: 'Bath & Brush',
    description: 'Full grooming session',
    completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    id: 'history_2',
    petId: 'pet_2',
    category: 'medication',
    title: 'Deworming',
    description: 'Quarterly deworming treatment',
    completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
  },
  {
    id: 'history_3',
    petId: 'pet_1',
    category: 'wellness',
    title: 'Weight Check',
    description: 'Monthly weight: 42 lbs',
    completedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
  },
  {
    id: 'history_4',
    petId: 'pet_2',
    category: 'vaccination',
    title: 'FVRCP Vaccine',
    description: 'Annual vaccination',
    completedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 1 month ago
  },
  {
    id: 'history_5',
    petId: 'pet_1',
    category: 'appointment',
    title: 'Vet Checkup',
    description: 'Routine wellness exam',
    completedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 2 months ago
  },
];

// Mock Vaccine Records
export const mockVaccines: VaccineRecord[] = [
  {
    id: 'vaccine_1',
    petId: 'pet_1',
    name: 'Rabies',
    dueDate: new Date('2026-03-15'),
    status: 'upcoming',
    notes: 'Annual booster required',
  },
  {
    id: 'vaccine_2',
    petId: 'pet_1',
    name: 'DHPP',
    dueDate: new Date('2026-02-10'),
    status: 'overdue',
    notes: 'Distemper, Hepatitis, Parvovirus, Parainfluenza',
  },
  {
    id: 'vaccine_3',
    petId: 'pet_1',
    name: 'Bordetella',
    dueDate: new Date('2025-12-20'),
    completedAt: new Date('2025-12-18'),
    status: 'completed',
    notes: 'Kennel cough prevention',
  },
  {
    id: 'vaccine_4',
    petId: 'pet_2',
    name: 'FVRCP',
    dueDate: new Date('2026-04-10'),
    status: 'upcoming',
    notes: 'Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia',
  },
  {
    id: 'vaccine_5',
    petId: 'pet_2',
    name: 'Rabies',
    dueDate: new Date('2026-02-20'),
    status: 'due',
    notes: 'Annual vaccination',
  },
  {
    id: 'vaccine_6',
    petId: 'pet_2',
    name: 'FeLV',
    dueDate: new Date('2025-11-15'),
    completedAt: new Date('2025-11-14'),
    status: 'completed',
    notes: 'Feline Leukemia Virus',
  },
];

// Mock Deworming Records
export const mockDeworming: DewormingRecord[] = [
  {
    id: 'deworm_1',
    petId: 'pet_1',
    dueDate: new Date('2026-02-15'),
    status: 'due',
    weight: 42,
    notes: 'Quarterly deworming treatment',
  },
  {
    id: 'deworm_2',
    petId: 'pet_1',
    dueDate: new Date('2025-11-15'),
    completedAt: new Date('2025-11-14'),
    status: 'completed',
    weight: 41,
    notes: 'Completed successfully',
  },
  {
    id: 'deworm_3',
    petId: 'pet_1',
    dueDate: new Date('2025-08-15'),
    completedAt: new Date('2025-08-16'),
    status: 'completed',
    weight: 40,
  },
  {
    id: 'deworm_4',
    petId: 'pet_2',
    dueDate: new Date('2026-03-01'),
    status: 'upcoming',
    weight: 10,
    notes: 'Quarterly treatment',
  },
  {
    id: 'deworm_5',
    petId: 'pet_2',
    dueDate: new Date('2026-02-05'),
    status: 'overdue',
    weight: 10,
    notes: 'Overdue - schedule ASAP',
  },
  {
    id: 'deworm_6',
    petId: 'pet_2',
    dueDate: new Date('2025-12-01'),
    completedAt: new Date('2025-11-30'),
    status: 'completed',
    weight: 10,
  },
];
