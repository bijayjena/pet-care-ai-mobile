import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import type { Pet, Reminder } from '@/types/pet';
import type { Meal, DietAlert } from '@/types/diet';
import type { CareTask, CareHistory, VaccineRecord, DewormingRecord } from '@/types/care';
import { supabaseService } from '@/services/supabaseService';
import { isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import { errorHandler } from '@/services/errorHandler';

interface PetContextType {
  // Pets
  pets: Pet[];
  addPet: (pet: Omit<Pet, 'id' | 'createdAt'>) => Promise<void>;
  updatePet: (id: string, updates: Partial<Pet>) => Promise<void>;
  deletePet: (id: string) => Promise<void>;
  
  // Reminders
  reminders: Reminder[];
  addReminder: (reminder: Omit<Reminder, 'id'>) => Promise<void>;
  completeReminder: (id: string) => Promise<void>;
  deleteReminder: (id: string) => Promise<void>;
  
  // Meals
  meals: Meal[];
  addMeal: (meal: Omit<Meal, 'id'>) => Promise<void>;
  completeMeal: (id: string, status: 'fed' | 'skipped' | 'refused', feedback?: string, portionAdjustment?: 'ate-all' | 'ate-some' | 'ate-none') => Promise<void>;
  updateMeal: (id: string, updates: Partial<Meal>) => Promise<void>;
  
  // Diet Alerts
  dietAlerts: DietAlert[];
  dismissDietAlert: (id: string) => void;
  
  // Care Tasks
  careTasks: CareTask[];
  addCareTask: (task: Omit<CareTask, 'id'>) => Promise<void>;
  completeCareTask: (id: string) => Promise<void>;
  deleteCareTask: (id: string) => Promise<void>;
  
  // Care History
  careHistory: CareHistory[];
  
  // Vaccines
  vaccines: VaccineRecord[];
  addVaccine: (vaccine: Omit<VaccineRecord, 'id'>) => Promise<void>;
  completeVaccine: (id: string) => Promise<void>;
  
  // Deworming
  dewormingRecords: DewormingRecord[];
  addDeworming: (record: Omit<DewormingRecord, 'id'>) => Promise<void>;
  completeDeworming: (id: string) => Promise<void>;
  
  // Computed values
  activeReminders: Reminder[];
  todaysMeals: Meal[];
  upcomingCareTasks: CareTask[];
  healthScore: number;
  
  // Loading state
  isLoaded: boolean;
  isOnline: boolean;
  
  // Utility
  clearAllData: () => Promise<void>;
  refreshData: () => Promise<void>;
}

const PetContext = createContext<PetContextType | undefined>(undefined);

export function PetProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const isOnline = isSupabaseConfigured() && !!user;

  const [pets, setPets] = useState<Pet[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [careTasks, setCareTasks] = useState<CareTask[]>([]);
  const [careHistory, setCareHistory] = useState<CareHistory[]>([]);
  const [vaccines, setVaccines] = useState<VaccineRecord[]>([]);
  const [dewormingRecords, setDewormingRecords] = useState<DewormingRecord[]>([]);
  const [dietAlerts, setDietAlerts] = useState<DietAlert[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data when user changes or on mount
  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      if (isOnline) {
        // Load from Supabase
        const [
          petsData,
          remindersData,
          mealsData,
          careTasksData,
          careHistoryData,
          vaccinesData,
          dewormingData,
        ] = await Promise.all([
          supabaseService.getPets(),
          supabaseService.getReminders(),
          supabaseService.getMeals(),
          supabaseService.getCareTasks(),
          supabaseService.getCareHistory(),
          supabaseService.getVaccines(),
          supabaseService.getDewormingRecords(),
        ]);

        setPets(petsData);
        setReminders(remindersData);
        setMeals(mealsData);
        setCareTasks(careTasksData);
        setCareHistory(careHistoryData);
        setVaccines(vaccinesData);
        setDewormingRecords(dewormingData);
      }
      setIsLoaded(true);
    } catch (error) {
      errorHandler.handleDatabaseError(error, {
        component: 'PetContext',
        action: 'loadData',
      });
      setIsLoaded(true);
    }
  };

  const refreshData = async () => {
    await loadData();
  };

  // Pet operations
  const addPet = async (pet: Omit<Pet, 'id' | 'createdAt'>) => {
    if (isOnline) {
      const newPet = await supabaseService.addPet(pet);
      if (newPet) {
        setPets(prev => [...prev, newPet]);
      }
    } else {
      const newPet: Pet = {
        ...pet,
        id: `pet_${Date.now()}`,
        createdAt: new Date(),
      };
      setPets(prev => [...prev, newPet]);
    }
  };

  const updatePet = async (id: string, updates: Partial<Pet>) => {
    if (isOnline) {
      const success = await supabaseService.updatePet(id, updates);
      if (success) {
        setPets(prev => prev.map(pet => pet.id === id ? { ...pet, ...updates } : pet));
      }
    } else {
      setPets(prev => prev.map(pet => pet.id === id ? { ...pet, ...updates } : pet));
    }
  };

  const deletePet = async (id: string) => {
    if (isOnline) {
      const success = await supabaseService.deletePet(id);
      if (success) {
        setPets(prev => prev.filter(pet => pet.id !== id));
      }
    } else {
      setPets(prev => prev.filter(pet => pet.id !== id));
    }
  };

  // Reminder operations
  const addReminder = async (reminder: Omit<Reminder, 'id'>) => {
    if (isOnline) {
      const newReminder = await supabaseService.addReminder(reminder);
      if (newReminder) {
        setReminders(prev => [...prev, newReminder]);
      }
    } else {
      const newReminder: Reminder = {
        ...reminder,
        id: `reminder_${Date.now()}`,
      };
      setReminders(prev => [...prev, newReminder]);
    }
  };

  const completeReminder = async (id: string) => {
    if (isOnline) {
      const success = await supabaseService.completeReminder(id);
      if (success) {
        setReminders(prev =>
          prev.map(reminder =>
            reminder.id === id ? { ...reminder, completed: true } : reminder
          )
        );
      }
    } else {
      setReminders(prev =>
        prev.map(reminder =>
          reminder.id === id ? { ...reminder, completed: true } : reminder
        )
      );
    }
  };

  const deleteReminder = async (id: string) => {
    if (isOnline) {
      const success = await supabaseService.deleteReminder(id);
      if (success) {
        setReminders(prev => prev.filter(reminder => reminder.id !== id));
      }
    } else {
      setReminders(prev => prev.filter(reminder => reminder.id !== id));
    }
  };

  // Meal operations
  const addMeal = async (meal: Omit<Meal, 'id'>) => {
    if (isOnline) {
      const newMeal = await supabaseService.addMeal(meal);
      if (newMeal) {
        setMeals(prev => [...prev, newMeal]);
      }
    } else {
      const newMeal: Meal = {
        ...meal,
        id: `meal_${Date.now()}`,
      };
      setMeals(prev => [...prev, newMeal]);
    }
  };

  const completeMeal = async (
    id: string,
    status: 'fed' | 'skipped' | 'refused',
    feedback?: string,
    portionAdjustment?: 'ate-all' | 'ate-some' | 'ate-none'
  ) => {
    if (isOnline) {
      const success = await supabaseService.completeMeal(id, status, feedback, portionAdjustment);
      if (success) {
        setMeals(prev =>
          prev.map(meal =>
            meal.id === id
              ? { ...meal, completed: true, completedAt: new Date(), status, feedback, portionAdjustment }
              : meal
          )
        );
      }
    } else {
      setMeals(prev =>
        prev.map(meal =>
          meal.id === id
            ? { ...meal, completed: true, completedAt: new Date(), status, feedback, portionAdjustment }
            : meal
        )
      );
    }

    // Check for negative patterns
    const meal = meals.find(m => m.id === id);
    if (meal) {
      checkDietPatterns(meal.petId, status, portionAdjustment);
    }
  };

  const checkDietPatterns = (petId: string, status: 'fed' | 'skipped' | 'refused', portionAdjustment?: 'ate-all' | 'ate-some' | 'ate-none') => {
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
  };

  const updateMeal = async (id: string, updates: Partial<Meal>) => {
    setMeals(prev => prev.map(meal => meal.id === id ? { ...meal, ...updates } : meal));
  };

  // Care task operations
  const addCareTask = async (task: Omit<CareTask, 'id'>) => {
    if (isOnline) {
      const newTask = await supabaseService.addCareTask(task);
      if (newTask) {
        setCareTasks(prev => [...prev, newTask]);
      }
    } else {
      const newTask: CareTask = {
        ...task,
        id: `task_${Date.now()}`,
      };
      setCareTasks(prev => [...prev, newTask]);
    }
  };

  const completeCareTask = async (id: string) => {
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

      if (isOnline) {
        await supabaseService.addCareHistory(historyEntry);
        const success = await supabaseService.completeCareTask(id);
        if (success) {
          setCareHistory(prev => [historyEntry, ...prev]);
          if (task.recurring) {
            setCareTasks(prev =>
              prev.map(t =>
                t.id === id ? { ...t, completed: true, completedAt: new Date() } : t
              )
            );
          } else {
            setCareTasks(prev => prev.filter(t => t.id !== id));
          }
        }
      } else {
        setCareHistory(prev => [historyEntry, ...prev]);
        if (task.recurring) {
          setCareTasks(prev =>
            prev.map(t =>
              t.id === id ? { ...t, completed: true, completedAt: new Date() } : t
            )
          );
        } else {
          setCareTasks(prev => prev.filter(t => t.id !== id));
        }
      }
    }
  };

  const deleteCareTask = async (id: string) => {
    if (isOnline) {
      const success = await supabaseService.deleteCareTask(id);
      if (success) {
        setCareTasks(prev => prev.filter(task => task.id !== id));
      }
    } else {
      setCareTasks(prev => prev.filter(task => task.id !== id));
    }
  };

  // Vaccine operations
  const addVaccine = async (vaccine: Omit<VaccineRecord, 'id'>) => {
    if (isOnline) {
      const newVaccine = await supabaseService.addVaccine(vaccine);
      if (newVaccine) {
        setVaccines(prev => [...prev, newVaccine]);
      }
    } else {
      const newVaccine: VaccineRecord = {
        ...vaccine,
        id: `vaccine_${Date.now()}`,
      };
      setVaccines(prev => [...prev, newVaccine]);
    }
  };

  const completeVaccine = async (id: string) => {
    if (isOnline) {
      const success = await supabaseService.completeVaccine(id);
      if (success) {
        setVaccines(prev =>
          prev.map(vaccine =>
            vaccine.id === id
              ? { ...vaccine, status: 'completed', completedAt: new Date() }
              : vaccine
          )
        );
      }
    } else {
      setVaccines(prev =>
        prev.map(vaccine =>
          vaccine.id === id
            ? { ...vaccine, status: 'completed', completedAt: new Date() }
            : vaccine
        )
      );
    }
  };

  // Deworming operations
  const addDeworming = async (record: Omit<DewormingRecord, 'id'>) => {
    if (isOnline) {
      const newRecord = await supabaseService.addDeworming(record);
      if (newRecord) {
        setDewormingRecords(prev => [...prev, newRecord]);
      }
    } else {
      const newRecord: DewormingRecord = {
        ...record,
        id: `deworm_${Date.now()}`,
      };
      setDewormingRecords(prev => [...prev, newRecord]);
    }
  };

  const completeDeworming = async (id: string) => {
    if (isOnline) {
      const success = await supabaseService.completeDeworming(id);
      if (success) {
        setDewormingRecords(prev =>
          prev.map(record =>
            record.id === id
              ? { ...record, status: 'completed', completedAt: new Date() }
              : record
          )
        );
      }
    } else {
      setDewormingRecords(prev =>
        prev.map(record =>
          record.id === id
            ? { ...record, status: 'completed', completedAt: new Date() }
            : record
        )
      );
    }
  };

  // Diet alert operations
  const dismissDietAlert = (id: string) => {
    setDietAlerts(prev =>
      prev.map(alert =>
        alert.id === id ? { ...alert, dismissed: true } : alert
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
    .sort((a, b) => {
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      return dateA - dateB;
    });

  const healthScore = Math.round(
    (pets.length * 100 - activeReminders.length * 5) / Math.max(pets.length, 1)
  );

  const clearAllData = async () => {
    // Clear all data
    setPets([]);
    setReminders([]);
    setMeals([]);
    setCareTasks([]);
    setCareHistory([]);
    setVaccines([]);
    setDewormingRecords([]);
    setDietAlerts([]);
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
    dietAlerts,
    dismissDietAlert,
    isLoaded,
    isOnline,
    clearAllData,
    refreshData,
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
