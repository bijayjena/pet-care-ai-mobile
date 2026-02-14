import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Pet, Reminder } from '@/types/pet';
import type { Meal } from '@/types/diet';
import type { CareTask, CareHistory, VaccineRecord, DewormingRecord } from '@/types/care';
import { mockPets, mockReminders, mockMeals, mockCareTasks, mockCareHistory, mockVaccines, mockDeworming } from '@/data/mockData';

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
  completeMeal: (id: string, status: 'fed' | 'skipped' | 'refused', feedback?: string, portionAdjustment?: 'ate-all' | 'ate-some' | 'ate-none') => void;
  updateMeal: (id: string, updates: Partial<Meal>) => void;
  
  // Care Tasks
  careTasks: CareTask[];
  addCareTask: (task: Omit<CareTask, 'id'>) => void;
  completeCareTask: (id: string) => void;
  deleteCareTask: (id: string) => void;
  
  // Care History
  careHistory: CareHistory[];
  
  // Vaccines
  vaccines: VaccineRecord[];
  addVaccine: (vaccine: Omit<VaccineRecord, 'id'>) => void;
  completeVaccine: (id: string) => void;
  
  // Deworming
  dewormingRecords: DewormingRecord[];
  addDeworming: (record: Omit<DewormingRecord, 'id'>) => void;
  completeDeworming: (id: string) => void;
  
  // Computed values
  activeReminders: Reminder[];
  todaysMeals: Meal[];
  upcomingCareTasks: CareTask[];
  healthScore: number;
  
  // Utility
  clearAllData: () => Promise<void>;
}

const PetContext = createContext<PetContextType | undefined>(undefined);

// Storage keys
const STORAGE_KEYS = {
  PETS: '@pet_care_pets',
  REMINDERS: '@pet_care_reminders',
  MEALS: '@pet_care_meals',
  CARE_TASKS: '@pet_care_tasks',
  CARE_HISTORY: '@pet_care_history',
  VACCINES: '@pet_care_vaccines',
  DEWORMING: '@pet_care_deworming',
};

// Helper to serialize dates
const serializeData = (data: any) => {
  return JSON.stringify(data, (key, value) => {
    if (value instanceof Date) {
      return { __type: 'Date', value: value.toISOString() };
    }
    return value;
  });
};

// Helper to deserialize dates
const deserializeData = (json: string) => {
  return JSON.parse(json, (key, value) => {
    if (value && typeof value === 'object' && value.__type === 'Date') {
      return new Date(value.value);
    }
    return value;
  });
};

export function PetProvider({ children }: { children: ReactNode }) {
  const [pets, setPets] = useState<Pet[]>(mockPets);
  const [reminders, setReminders] = useState<Reminder[]>(mockReminders);
  const [meals, setMeals] = useState<Meal[]>(mockMeals);
  const [careTasks, setCareTasks] = useState<CareTask[]>(mockCareTasks);
  const [careHistory, setCareHistory] = useState<CareHistory[]>(mockCareHistory);
  const [vaccines, setVaccines] = useState<VaccineRecord[]>(mockVaccines);
  const [dewormingRecords, setDewormingRecords] = useState<DewormingRecord[]>(mockDeworming);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from AsyncStorage on mount
  useEffect(() => {
    loadData();
  }, []);

  // Save vaccines to AsyncStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      saveVaccines();
    }
  }, [vaccines, isLoaded]);

  // Save deworming records to AsyncStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      saveDeworming();
    }
  }, [dewormingRecords, isLoaded]);

  // Save care tasks to AsyncStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      saveCareTasks();
    }
  }, [careTasks, isLoaded]);

  // Save care history to AsyncStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      saveCareHistory();
    }
  }, [careHistory, isLoaded]);

  const loadData = async () => {
    try {
      const [
        storedVaccines,
        storedDeworming,
        storedCareTasks,
        storedCareHistory,
      ] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.VACCINES),
        AsyncStorage.getItem(STORAGE_KEYS.DEWORMING),
        AsyncStorage.getItem(STORAGE_KEYS.CARE_TASKS),
        AsyncStorage.getItem(STORAGE_KEYS.CARE_HISTORY),
      ]);

      if (storedVaccines) {
        setVaccines(deserializeData(storedVaccines));
      }
      if (storedDeworming) {
        setDewormingRecords(deserializeData(storedDeworming));
      }
      if (storedCareTasks) {
        setCareTasks(deserializeData(storedCareTasks));
      }
      if (storedCareHistory) {
        setCareHistory(deserializeData(storedCareHistory));
      }

      setIsLoaded(true);
    } catch (error) {
      console.error('Error loading data from AsyncStorage:', error);
      setIsLoaded(true);
    }
  };

  const saveVaccines = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.VACCINES, serializeData(vaccines));
    } catch (error) {
      console.error('Error saving vaccines:', error);
    }
  };

  const saveDeworming = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.DEWORMING, serializeData(dewormingRecords));
    } catch (error) {
      console.error('Error saving deworming records:', error);
    }
  };

  const saveCareTasks = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CARE_TASKS, serializeData(careTasks));
    } catch (error) {
      console.error('Error saving care tasks:', error);
    }
  };

  const saveCareHistory = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CARE_HISTORY, serializeData(careHistory));
    } catch (error) {
      console.error('Error saving care history:', error);
    }
  };

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

  const completeMeal = (id: string, status: 'fed' | 'skipped' | 'refused', feedback?: string, portionAdjustment?: 'ate-all' | 'ate-some' | 'ate-none') => {
    setMeals(prev =>
      prev.map(meal =>
        meal.id === id
          ? { ...meal, completed: true, completedAt: new Date(), status, feedback, portionAdjustment }
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

  // Vaccine operations
  const addVaccine = (vaccine: Omit<VaccineRecord, 'id'>) => {
    const newVaccine: VaccineRecord = {
      ...vaccine,
      id: `vaccine_${Date.now()}`,
    };
    setVaccines(prev => [...prev, newVaccine]);
  };

  const completeVaccine = (id: string) => {
    setVaccines(prev =>
      prev.map(vaccine =>
        vaccine.id === id
          ? { ...vaccine, status: 'completed', completedAt: new Date() }
          : vaccine
      )
    );
  };

  // Deworming operations
  const addDeworming = (record: Omit<DewormingRecord, 'id'>) => {
    const newRecord: DewormingRecord = {
      ...record,
      id: `deworm_${Date.now()}`,
    };
    setDewormingRecords(prev => [...prev, newRecord]);
  };

  const completeDeworming = (id: string) => {
    setDewormingRecords(prev =>
      prev.map(record =>
        record.id === id
          ? { ...record, status: 'completed', completedAt: new Date() }
          : record
      )
    );
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

  // Utility function to clear all stored data (useful for testing/reset)
  const clearAllData = async () => {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.VACCINES,
        STORAGE_KEYS.DEWORMING,
        STORAGE_KEYS.CARE_TASKS,
        STORAGE_KEYS.CARE_HISTORY,
      ]);
      // Reset to mock data
      setVaccines(mockVaccines);
      setDewormingRecords(mockDeworming);
      setCareTasks(mockCareTasks);
      setCareHistory(mockCareHistory);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };

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
    vaccines,
    addVaccine,
    completeVaccine,
    dewormingRecords,
    addDeworming,
    completeDeworming,
    activeReminders,
    todaysMeals,
    upcomingCareTasks,
    healthScore,
    clearAllData,
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
