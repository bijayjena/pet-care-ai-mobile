import { createContext, useContext, ReactNode, useState, useEffect, useMemo, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Pet, Reminder } from '@/types/pet';
import type { Meal, DietAlert } from '@/types/diet';
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
  
  // Diet Alerts
  dietAlerts: DietAlert[];
  dismissDietAlert: (id: string) => void;
  
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
  
  // Computed values (memoized)
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
  DIET_ALERTS: '@pet_care_diet_alerts',
} as const;

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

// Debounce helper for storage operations
const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export function PetProvider({ children }: { children: ReactNode }) {
  const [pets, setPets] = useState<Pet[]>(mockPets);
  const [reminders, setReminders] = useState<Reminder[]>(mockReminders);
  const [meals, setMeals] = useState<Meal[]>(mockMeals);
  const [careTasks, setCareTasks] = useState<CareTask[]>(mockCareTasks);
  const [careHistory, setCareHistory] = useState<CareHistory[]>(mockCareHistory);
  const [vaccines, setVaccines] = useState<VaccineRecord[]>(mockVaccines);
  const [dewormingRecords, setDewormingRecords] = useState<DewormingRecord[]>(mockDeworming);
  const [dietAlerts, setDietAlerts] = useState<DietAlert[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from AsyncStorage on mount
  useEffect(() => {
    loadData();
  }, []);

  // Debounced save functions to reduce AsyncStorage writes
  const debouncedSaveVaccines = useMemo(
    () => debounce((data: VaccineRecord[]) => {
      AsyncStorage.setItem(STORAGE_KEYS.VACCINES, serializeData(data)).catch(console.error);
    }, 500),
    []
  );

  const debouncedSaveDeworming = useMemo(
    () => debounce((data: DewormingRecord[]) => {
      AsyncStorage.setItem(STORAGE_KEYS.DEWORMING, serializeData(data)).catch(console.error);
    }, 500),
    []
  );

  const debouncedSaveCareTasks = useMemo(
    () => debounce((data: CareTask[]) => {
      AsyncStorage.setItem(STORAGE_KEYS.CARE_TASKS, serializeData(data)).catch(console.error);
    }, 500),
    []
  );

  const debouncedSaveCareHistory = useMemo(
    () => debounce((data: CareHistory[]) => {
      AsyncStorage.setItem(STORAGE_KEYS.CARE_HISTORY, serializeData(data)).catch(console.error);
    }, 500),
    []
  );

  const debouncedSaveMeals = useMemo(
    () => debounce((data: Meal[]) => {
      AsyncStorage.setItem(STORAGE_KEYS.MEALS, serializeData(data)).catch(console.error);
    }, 500),
    []
  );

  const debouncedSaveDietAlerts = useMemo(
    () => debounce((data: DietAlert[]) => {
      AsyncStorage.setItem(STORAGE_KEYS.DIET_ALERTS, serializeData(data)).catch(console.error);
    }, 500),
    []
  );

  // Save to AsyncStorage when data changes (debounced)
  useEffect(() => {
    if (isLoaded) {
      debouncedSaveVaccines(vaccines);
    }
  }, [vaccines, isLoaded, debouncedSaveVaccines]);

  useEffect(() => {
    if (isLoaded) {
      debouncedSaveDeworming(dewormingRecords);
    }
  }, [dewormingRecords, isLoaded, debouncedSaveDeworming]);

  useEffect(() => {
    if (isLoaded) {
      debouncedSaveCareTasks(careTasks);
    }
  }, [careTasks, isLoaded, debouncedSaveCareTasks]);

  useEffect(() => {
    if (isLoaded) {
      debouncedSaveCareHistory(careHistory);
    }
  }, [careHistory, isLoaded, debouncedSaveCareHistory]);

  useEffect(() => {
    if (isLoaded) {
      debouncedSaveMeals(meals);
    }
  }, [meals, isLoaded, debouncedSaveMeals]);

  useEffect(() => {
    if (isLoaded) {
      debouncedSaveDietAlerts(dietAlerts);
    }
  }, [dietAlerts, isLoaded, debouncedSaveDietAlerts]);

  const loadData = async () => {
    try {
      const [
        storedVaccines,
        storedDeworming,
        storedCareTasks,
        storedCareHistory,
        storedMeals,
        storedDietAlerts,
      ] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.VACCINES),
        AsyncStorage.getItem(STORAGE_KEYS.DEWORMING),
        AsyncStorage.getItem(STORAGE_KEYS.CARE_TASKS),
        AsyncStorage.getItem(STORAGE_KEYS.CARE_HISTORY),
        AsyncStorage.getItem(STORAGE_KEYS.MEALS),
        AsyncStorage.getItem(STORAGE_KEYS.DIET_ALERTS),
      ]);

      if (storedVaccines) setVaccines(deserializeData(storedVaccines));
      if (storedDeworming) setDewormingRecords(deserializeData(storedDeworming));
      if (storedCareTasks) setCareTasks(deserializeData(storedCareTasks));
      if (storedCareHistory) setCareHistory(deserializeData(storedCareHistory));
      if (storedMeals) setMeals(deserializeData(storedMeals));
      if (storedDietAlerts) setDietAlerts(deserializeData(storedDietAlerts));

      setIsLoaded(true);
    } catch (error) {
      console.error('Error loading data from AsyncStorage:', error);
      setIsLoaded(true);
    }
  };

  // Memoized callbacks to prevent unnecessary re-renders
  const addPet = useCallback((pet: Omit<Pet, 'id' | 'createdAt'>) => {
    const newPet: Pet = {
      ...pet,
      id: `pet_${Date.now()}`,
      createdAt: new Date(),
    };
    setPets(prev => [...prev, newPet]);
  }, []);

  const updatePet = useCallback((id: string, updates: Partial<Pet>) => {
    setPets(prev => prev.map(pet => pet.id === id ? { ...pet, ...updates } : pet));
  }, []);

  const deletePet = useCallback((id: string) => {
    setPets(prev => prev.filter(pet => pet.id !== id));
  }, []);

  const addReminder = useCallback((reminder: Omit<Reminder, 'id'>) => {
    const newReminder: Reminder = {
      ...reminder,
      id: `reminder_${Date.now()}`,
    };
    setReminders(prev => [...prev, newReminder]);
  }, []);

  const completeReminder = useCallback((id: string) => {
    setReminders(prev =>
      prev.map(reminder =>
        reminder.id === id ? { ...reminder, completed: true } : reminder
      )
    );
  }, []);

  const deleteReminder = useCallback((id: string) => {
    setReminders(prev => prev.filter(reminder => reminder.id !== id));
  }, []);

  const addMeal = useCallback((meal: Omit<Meal, 'id'>) => {
    const newMeal: Meal = {
      ...meal,
      id: `meal_${Date.now()}`,
    };
    setMeals(prev => [...prev, newMeal]);
  }, []);

  const completeMeal = useCallback((
    id: string,
    status: 'fed' | 'skipped' | 'refused',
    feedback?: string,
    portionAdjustment?: 'ate-all' | 'ate-some' | 'ate-none'
  ) => {
    setMeals(prev =>
      prev.map(meal =>
        meal.id === id
          ? { ...meal, completed: true, completedAt: new Date(), status, feedback, portionAdjustment }
          : meal
      )
    );

    // Check for negative patterns (moved to separate function for clarity)
    const meal = meals.find(m => m.id === id);
    if (meal) {
      checkDietPatterns(meal.petId, status, portionAdjustment);
    }
  }, [meals]);

  const checkDietPatterns = useCallback((
    petId: string,
    status: 'fed' | 'skipped' | 'refused',
    portionAdjustment?: 'ate-all' | 'ate-some' | 'ate-none'
  ) => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const recentMeals = meals.filter(m => 
      m.petId === petId && 
      m.completed && 
      new Date(m.scheduledDate) >= sevenDaysAgo
    );

    const refusedCount = recentMeals.filter(m => m.status === 'refused').length + (status === 'refused' ? 1 : 0);
    const partialCount = recentMeals.filter(m => m.portionAdjustment === 'ate-some' || m.portionAdjustment === 'ate-none').length + 
      (portionAdjustment === 'ate-some' || portionAdjustment === 'ate-none' ? 1 : 0);
    const skippedCount = recentMeals.filter(m => m.status === 'skipped').length + (status === 'skipped' ? 1 : 0);

    const newAlerts: DietAlert[] = [];

    if (refusedCount >= 3) {
      const existingAlert = dietAlerts.find(a => a.petId === petId && a.type === 'repeated-refusal' && !a.dismissed);
      if (!existingAlert) {
        newAlerts.push({
          id: `alert_${Date.now()}_refusal`,
          petId,
          type: 'repeated-refusal',
          severity: refusedCount >= 5 ? 'urgent' : 'warning',
          message: `${refusedCount} refused meals in the last 7 days. Consider reviewing diet or consulting vet.`,
          occurrences: refusedCount,
          lastOccurrence: now,
          dismissed: false,
        });
      }
    }

    if (partialCount >= 4) {
      const existingAlert = dietAlerts.find(a => a.petId === petId && a.type === 'repeated-partial' && !a.dismissed);
      if (!existingAlert) {
        newAlerts.push({
          id: `alert_${Date.now()}_partial`,
          petId,
          type: 'repeated-partial',
          severity: partialCount >= 6 ? 'urgent' : 'warning',
          message: `${partialCount} partially eaten meals in the last 7 days. Pet may not like current food.`,
          occurrences: partialCount,
          lastOccurrence: now,
          dismissed: false,
        });
      }
    }

    if (skippedCount >= 3) {
      const existingAlert = dietAlerts.find(a => a.petId === petId && a.type === 'repeated-skip' && !a.dismissed);
      if (!existingAlert) {
        newAlerts.push({
          id: `alert_${Date.now()}_skip`,
          petId,
          type: 'repeated-skip',
          severity: skippedCount >= 5 ? 'urgent' : 'warning',
          message: `${skippedCount} skipped meals in the last 7 days. Ensure consistent feeding schedule.`,
          occurrences: skippedCount,
          lastOccurrence: now,
          dismissed: false,
        });
      }
    }

    if (newAlerts.length > 0) {
      setDietAlerts(prev => [...prev, ...newAlerts]);
    }
  }, [meals, dietAlerts]);

  const updateMeal = useCallback((id: string, updates: Partial<Meal>) => {
    setMeals(prev => prev.map(meal => meal.id === id ? { ...meal, ...updates } : meal));
  }, []);

  const addCareTask = useCallback((task: Omit<CareTask, 'id'>) => {
    const newTask: CareTask = {
      ...task,
      id: `task_${Date.now()}`,
    };
    setCareTasks(prev => [...prev, newTask]);
  }, []);

  const completeCareTask = useCallback((id: string) => {
    const task = careTasks.find(t => t.id === id);
    if (task) {
      const historyEntry: CareHistory = {
        id: `history_${Date.now()}`,
        petId: task.petId,
        category: task.category,
        title: task.title,
        description: task.description,
        completedAt: new Date(),
      };
      setCareHistory(prev => [historyEntry, ...prev]);

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
  }, [careTasks]);

  const deleteCareTask = useCallback((id: string) => {
    setCareTasks(prev => prev.filter(task => task.id !== id));
  }, []);

  const addVaccine = useCallback((vaccine: Omit<VaccineRecord, 'id'>) => {
    const newVaccine: VaccineRecord = {
      ...vaccine,
      id: `vaccine_${Date.now()}`,
    };
    setVaccines(prev => [...prev, newVaccine]);
  }, []);

  const completeVaccine = useCallback((id: string) => {
    setVaccines(prev =>
      prev.map(vaccine =>
        vaccine.id === id
          ? { ...vaccine, status: 'completed', completedAt: new Date() }
          : vaccine
      )
    );
  }, []);

  const addDeworming = useCallback((record: Omit<DewormingRecord, 'id'>) => {
    const newRecord: DewormingRecord = {
      ...record,
      id: `deworm_${Date.now()}`,
    };
    setDewormingRecords(prev => [...prev, newRecord]);
  }, []);

  const completeDeworming = useCallback((id: string) => {
    setDewormingRecords(prev =>
      prev.map(record =>
        record.id === id
          ? { ...record, status: 'completed', completedAt: new Date() }
          : record
      )
    );
  }, []);

  const dismissDietAlert = useCallback((id: string) => {
    setDietAlerts(prev =>
      prev.map(alert =>
        alert.id === id ? { ...alert, dismissed: true } : alert
      )
    );
  }, []);

  // Memoized computed values to prevent recalculation on every render
  const activeReminders = useMemo(
    () => reminders.filter(r => !r.completed),
    [reminders]
  );
  
  const todaysMeals = useMemo(() => {
    const today = new Date();
    return meals.filter(meal => {
      const mealDate = new Date(meal.scheduledDate);
      return (
        mealDate.getDate() === today.getDate() &&
        mealDate.getMonth() === today.getMonth() &&
        mealDate.getFullYear() === today.getFullYear()
      );
    });
  }, [meals]);

  const upcomingCareTasks = useMemo(
    () => careTasks
      .filter(task => !task.completed)
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime()),
    [careTasks]
  );

  const healthScore = useMemo(
    () => Math.round(
      (pets.length * 100 - activeReminders.length * 5) / Math.max(pets.length, 1)
    ),
    [pets.length, activeReminders.length]
  );

  const clearAllData = useCallback(async () => {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.VACCINES,
        STORAGE_KEYS.DEWORMING,
        STORAGE_KEYS.CARE_TASKS,
        STORAGE_KEYS.CARE_HISTORY,
        STORAGE_KEYS.MEALS,
        STORAGE_KEYS.DIET_ALERTS,
      ]);
      setVaccines(mockVaccines);
      setDewormingRecords(mockDeworming);
      setCareTasks(mockCareTasks);
      setCareHistory(mockCareHistory);
      setMeals(mockMeals);
      setDietAlerts([]);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo<PetContextType>(() => ({
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
    dietAlerts,
    dismissDietAlert,
    clearAllData,
  }), [
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
    dietAlerts,
    dismissDietAlert,
    clearAllData,
  ]);

  return <PetContext.Provider value={value}>{children}</PetContext.Provider>;
}

export function usePets() {
  const context = useContext(PetContext);
  if (context === undefined) {
    throw new Error('usePets must be used within a PetProvider');
  }
  return context;
}
