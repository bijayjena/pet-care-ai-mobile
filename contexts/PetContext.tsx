import { createContext, useContext, ReactNode, useState } from 'react';
import type { Pet, Reminder } from '@/types/pet';
import type { Meal } from '@/types/diet';
import type { CareTask, CareHistory } from '@/types/care';
import { mockPets, mockReminders, mockMeals, mockCareTasks, mockCareHistory } from '@/data/mockData';

interface PetContextType {
  // Pets
  pets: Pet[];
  addPet: (pet: Omit<Pet, 'id' | 'createdAt'>) => void;
  updatePet: (id: string, updates: Partial<Pet>) => void;
  deletePet: (id: string) => void;
  
  // Reminders
  reminders: Reminder[];
  addReminder: (reminder: Omit<Reminder, 'id'>) => void;
  completeReminder: (id: string) => void;
  deleteReminder: (id: string) => void;
  
  // Meals
  meals: Meal[];
  addMeal: (meal: Omit<Meal, 'id'>) => void;
  completeMeal: (id: string) => void;
  updateMeal: (id: string, updates: Partial<Meal>) => void;
  
  // Care Tasks
  careTasks: CareTask[];
  addCareTask: (task: Omit<CareTask, 'id'>) => void;
  completeCareTask: (id: string) => void;
  deleteCareTask: (id: string) => void;
  
  // Care History
  careHistory: CareHistory[];
  
  // Computed values
  activeReminders: Reminder[];
  todaysMeals: Meal[];
  upcomingCareTasks: CareTask[];
  healthScore: number;
}

const PetContext = createContext<PetContextType | undefined>(undefined);

export function PetProvider({ children }: { children: ReactNode }) {
  const [pets, setPets] = useState<Pet[]>(mockPets);
  const [reminders, setReminders] = useState<Reminder[]>(mockReminders);
  const [meals, setMeals] = useState<Meal[]>(mockMeals);
  const [careTasks, setCareTasks] = useState<CareTask[]>(mockCareTasks);
  const [careHistory, setCareHistory] = useState<CareHistory[]>(mockCareHistory);

  // Pet operations
  const addPet = (pet: Omit<Pet, 'id' | 'createdAt'>) => {
    const newPet: Pet = {
      ...pet,
      id: `pet_${Date.now()}`,
      createdAt: new Date(),
    };
    setPets(prev => [...prev, newPet]);
  };

  const updatePet = (id: string, updates: Partial<Pet>) => {
    setPets(prev => prev.map(pet => pet.id === id ? { ...pet, ...updates } : pet));
  };

  const deletePet = (id: string) => {
    setPets(prev => prev.filter(pet => pet.id !== id));
  };

  // Reminder operations
  const addReminder = (reminder: Omit<Reminder, 'id'>) => {
    const newReminder: Reminder = {
      ...reminder,
      id: `reminder_${Date.now()}`,
    };
    setReminders(prev => [...prev, newReminder]);
  };

  const completeReminder = (id: string) => {
    setReminders(prev =>
      prev.map(reminder =>
        reminder.id === id ? { ...reminder, completed: true } : reminder
      )
    );
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(reminder => reminder.id !== id));
  };

  // Meal operations
  const addMeal = (meal: Omit<Meal, 'id'>) => {
    const newMeal: Meal = {
      ...meal,
      id: `meal_${Date.now()}`,
    };
    setMeals(prev => [...prev, newMeal]);
  };

  const completeMeal = (id: string) => {
    setMeals(prev =>
      prev.map(meal =>
        meal.id === id
          ? { ...meal, completed: true, completedAt: new Date() }
          : meal
      )
    );
  };

  const updateMeal = (id: string, updates: Partial<Meal>) => {
    setMeals(prev => prev.map(meal => meal.id === id ? { ...meal, ...updates } : meal));
  };

  // Care task operations
  const addCareTask = (task: Omit<CareTask, 'id'>) => {
    const newTask: CareTask = {
      ...task,
      id: `task_${Date.now()}`,
    };
    setCareTasks(prev => [...prev, newTask]);
  };

  const completeCareTask = (id: string) => {
    const task = careTasks.find(t => t.id === id);
    if (task) {
      // Add to history
      const historyEntry: CareHistory = {
        id: `history_${Date.now()}`,
        petId: task.petId,
        category: task.category,
        title: task.title,
        description: task.description,
        completedAt: new Date(),
      };
      setCareHistory(prev => [historyEntry, ...prev]);

      // Mark as completed or remove if not recurring
      if (task.recurring) {
        setCareTasks(prev =>
          prev.map(t =>
            t.id === id
              ? { ...t, completed: true, completedAt: new Date() }
              : t
          )
        );
      } else {
        setCareTasks(prev => prev.filter(t => t.id !== id));
      }
    }
  };

  const deleteCareTask = (id: string) => {
    setCareTasks(prev => prev.filter(task => task.id !== id));
  };

  // Computed values
  const activeReminders = reminders.filter(r => !r.completed);
  
  const todaysMeals = meals.filter(meal => {
    const today = new Date();
    const mealDate = new Date(meal.scheduledDate);
    return (
      mealDate.getDate() === today.getDate() &&
      mealDate.getMonth() === today.getMonth() &&
      mealDate.getFullYear() === today.getFullYear()
    );
  });

  const upcomingCareTasks = careTasks
    .filter(task => !task.completed)
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());

  const healthScore = Math.round(
    (pets.length * 100 - activeReminders.length * 5) / Math.max(pets.length, 1)
  );

  const value: PetContextType = {
    pets,
    addPet,
    updatePet,
    deletePet,
    reminders,
    addReminder,
    completeReminder,
    deleteReminder,
    meals,
    addMeal,
    completeMeal,
    updateMeal,
    careTasks,
    addCareTask,
    completeCareTask,
    deleteCareTask,
    careHistory,
    activeReminders,
    todaysMeals,
    upcomingCareTasks,
    healthScore,
  };

  return <PetContext.Provider value={value}>{children}</PetContext.Provider>;
}

export function usePets() {
  const context = useContext(PetContext);
  if (context === undefined) {
    throw new Error('usePets must be used within a PetProvider');
  }
  return context;
}
