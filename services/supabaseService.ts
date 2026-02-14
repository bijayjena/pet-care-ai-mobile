import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Pet, Reminder } from '@/types/pet';
import type { Meal } from '@/types/diet';
import type { CareTask, CareHistory, VaccineRecord, DewormingRecord } from '@/types/care';
import { errorHandler } from './errorHandler';

// Helper to transform database rows to app types
const transformPet = (row: any): Pet => ({
  id: row.id,
  name: row.name,
  type: row.type,
  photoUri: row.photo_uri,
  breed: row.breed,
  age: row.age,
  weight: row.weight,
  microchip: row.microchip,
  allergies: row.allergies || [],
  medications: [], // Will be loaded separately
  conditions: row.conditions || [],
  vetContact: row.vet_contact,
  createdAt: new Date(row.created_at),
});

export class SupabaseService {
  // ============================================
  // PETS
  // ============================================
  async getPets(): Promise<Pet[]> {
    if (!isSupabaseConfigured()) return [];

    try {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(transformPet);
    } catch (error) {
      errorHandler.handleDatabaseError(error, {
        component: 'SupabaseService',
        action: 'getPets',
      });
      return [];
    }
  }

  async addPet(pet: Omit<Pet, 'id' | 'createdAt'>): Promise<Pet | null> {
    if (!isSupabaseConfigured()) return null;

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('pets')
        .insert({
          user_id: userData.user.id,
          name: pet.name,
          type: pet.type,
          photo_uri: pet.photoUri,
          breed: pet.breed,
          age: pet.age,
          weight: pet.weight,
          microchip: pet.microchip,
          allergies: pet.allergies,
          conditions: pet.conditions,
          vet_contact: pet.vetContact,
        })
        .select()
        .single();

      if (error) throw error;
      return transformPet(data);
    } catch (error) {
      errorHandler.handleDatabaseError(error, {
        component: 'SupabaseService',
        action: 'addPet',
      });
      return null;
    }
  }

  async updatePet(id: string, updates: Partial<Pet>): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;

    try {
      const updateData: any = {};
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.type !== undefined) updateData.type = updates.type;
      if (updates.photoUri !== undefined) updateData.photo_uri = updates.photoUri;
      if (updates.breed !== undefined) updateData.breed = updates.breed;
      if (updates.age !== undefined) updateData.age = updates.age;
      if (updates.weight !== undefined) updateData.weight = updates.weight;
      if (updates.microchip !== undefined) updateData.microchip = updates.microchip;
      if (updates.allergies !== undefined) updateData.allergies = updates.allergies;
      if (updates.conditions !== undefined) updateData.conditions = updates.conditions;
      if (updates.vetContact !== undefined) updateData.vet_contact = updates.vetContact;

      const { error } = await supabase
        .from('pets')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      errorHandler.handleDatabaseError(error, {
        component: 'SupabaseService',
        action: 'updatePet',
      });
      return false;
    }
  }

  async deletePet(id: string): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;

    try {
      const { error } = await supabase.from('pets').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (error) {
      errorHandler.handleDatabaseError(error, {
        component: 'SupabaseService',
        action: 'deletePet',
      });
      return false;
    }
  }

  // ============================================
  // MEDICATIONS
  // ============================================
  async getMedications(petId: string): Promise<any[]> {
    if (!isSupabaseConfigured()) return [];

    try {
      const { data, error } = await supabase
        .from('medications')
        .select('*')
        .eq('pet_id', petId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      errorHandler.handleDatabaseError(error, {
        component: 'SupabaseService',
        action: 'getMedications',
      });
      return [];
    }
  }

  // ============================================
  // REMINDERS
  // ============================================
  async getReminders(): Promise<Reminder[]> {
    if (!isSupabaseConfigured()) return [];

    try {
      const { data, error } = await supabase
        .from('reminders')
        .select('*')
        .order('due_date', { ascending: true });

      if (error) throw error;
      return (data || []).map(row => ({
        id: row.id,
        petId: row.pet_id,
        type: row.type,
        title: row.title,
        description: row.description,
        dueDate: new Date(row.due_date),
        completed: row.completed,
        priority: row.priority,
      }));
    } catch (error) {
      errorHandler.handleDatabaseError(error, {
        component: 'SupabaseService',
        action: 'getReminders',
      });
      return [];
    }
  }

  async addReminder(reminder: Omit<Reminder, 'id'>): Promise<Reminder | null> {
    if (!isSupabaseConfigured()) return null;

    try {
      const { data, error } = await supabase
        .from('reminders')
        .insert({
          pet_id: reminder.petId,
          type: reminder.type,
          title: reminder.title,
          description: reminder.description,
          due_date: reminder.dueDate.toISOString(),
          completed: reminder.completed,
          priority: reminder.priority,
        })
        .select()
        .single();

      if (error) throw error;
      return {
        id: data.id,
        petId: data.pet_id,
        type: data.type,
        title: data.title,
        description: data.description,
        dueDate: new Date(data.due_date),
        completed: data.completed,
        priority: data.priority,
      };
    } catch (error) {
      errorHandler.handleDatabaseError(error, {
        component: 'SupabaseService',
        action: 'addReminder',
      });
      return null;
    }
  }

  async completeReminder(id: string): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;

    try {
      const { error } = await supabase
        .from('reminders')
        .update({ completed: true, completed_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      errorHandler.handleDatabaseError(error, {
        component: 'SupabaseService',
        action: 'completeReminder',
      });
      return false;
    }
  }

  async deleteReminder(id: string): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;

    try {
      const { error } = await supabase.from('reminders').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (error) {
      errorHandler.handleDatabaseError(error, {
        component: 'SupabaseService',
        action: 'deleteReminder',
      });
      return false;
    }
  }

  // ============================================
  // MEALS
  // ============================================
  async getMeals(): Promise<Meal[]> {
    if (!isSupabaseConfigured()) return [];

    try {
      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .order('scheduled_date', { ascending: true });

      if (error) throw error;
      return (data || []).map(row => ({
        id: row.id,
        petId: row.pet_id,
        mealType: row.meal_type,
        time: row.time,
        food: row.food,
        amount: row.amount,
        calories: row.calories,
        scheduledDate: new Date(row.scheduled_date),
        completed: row.completed,
        completedAt: row.completed_at ? new Date(row.completed_at) : undefined,
        status: row.status,
        feedback: row.feedback,
        portionAdjustment: row.portion_adjustment,
      }));
    } catch (error) {
      errorHandler.handleDatabaseError(error, {
        component: 'SupabaseService',
        action: 'getMeals',
      });
      return [];
    }
  }

  async addMeal(meal: Omit<Meal, 'id'>): Promise<Meal | null> {
    if (!isSupabaseConfigured()) return null;

    try {
      const { data, error } = await supabase
        .from('meals')
        .insert({
          pet_id: meal.petId,
          meal_type: meal.mealType,
          time: meal.time,
          food: meal.food,
          amount: meal.amount,
          calories: meal.calories,
          scheduled_date: meal.scheduledDate.toISOString(),
          completed: meal.completed,
        })
        .select()
        .single();

      if (error) throw error;
      return {
        id: data.id,
        petId: data.pet_id,
        mealType: data.meal_type,
        time: data.time,
        food: data.food,
        amount: data.amount,
        calories: data.calories,
        scheduledDate: new Date(data.scheduled_date),
        completed: data.completed,
      };
    } catch (error) {
      errorHandler.handleDatabaseError(error, {
        component: 'SupabaseService',
        action: 'addMeal',
      });
      return null;
    }
  }

  async completeMeal(
    id: string,
    status: 'fed' | 'skipped' | 'refused',
    feedback?: string,
    portionAdjustment?: 'ate-all' | 'ate-some' | 'ate-none'
  ): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;

    try {
      const { error } = await supabase
        .from('meals')
        .update({
          completed: true,
          completed_at: new Date().toISOString(),
          status,
          feedback,
          portion_adjustment: portionAdjustment,
        })
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      errorHandler.handleDatabaseError(error, {
        component: 'SupabaseService',
        action: 'completeMeal',
      });
      return false;
    }
  }

  // ============================================
  // CARE TASKS
  // ============================================
  async getCareTasks(): Promise<CareTask[]> {
    if (!isSupabaseConfigured()) return [];

    try {
      const { data, error } = await supabase
        .from('care_tasks')
        .select('*')
        .order('due_date', { ascending: true });

      if (error) throw error;
      return (data || []).map(row => ({
        id: row.id,
        petId: row.pet_id,
        category: row.category,
        title: row.title,
        description: row.description,
        dueDate: new Date(row.due_date),
        completed: row.completed,
        completedAt: row.completed_at ? new Date(row.completed_at) : undefined,
        priority: row.priority,
        recurring: row.recurring_frequency ? { frequency: row.recurring_frequency } : undefined,
      }));
    } catch (error) {
      errorHandler.handleDatabaseError(error, {
        component: 'SupabaseService',
        action: 'getCareTasks',
      });
      return [];
    }
  }

  async addCareTask(task: Omit<CareTask, 'id'>): Promise<CareTask | null> {
    if (!isSupabaseConfigured()) return null;

    try {
      const { data, error } = await supabase
        .from('care_tasks')
        .insert({
          pet_id: task.petId,
          category: task.category,
          title: task.title,
          description: task.description,
          due_date: task.dueDate.toISOString(),
          completed: task.completed,
          priority: task.priority,
          recurring_frequency: task.recurring?.frequency,
        })
        .select()
        .single();

      if (error) throw error;
      return {
        id: data.id,
        petId: data.pet_id,
        category: data.category,
        title: data.title,
        description: data.description,
        dueDate: new Date(data.due_date),
        completed: data.completed,
        priority: data.priority,
        recurring: data.recurring_frequency ? { frequency: data.recurring_frequency } : undefined,
      };
    } catch (error) {
      errorHandler.handleDatabaseError(error, {
        component: 'SupabaseService',
        action: 'addCareTask',
      });
      return null;
    }
  }

  async completeCareTask(id: string): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;

    try {
      const { error } = await supabase
        .from('care_tasks')
        .update({ completed: true, completed_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      errorHandler.handleDatabaseError(error, {
        component: 'SupabaseService',
        action: 'completeCareTask',
      });
      return false;
    }
  }

  async deleteCareTask(id: string): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;

    try {
      const { error } = await supabase.from('care_tasks').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (error) {
      errorHandler.handleDatabaseError(error, {
        component: 'SupabaseService',
        action: 'deleteCareTask',
      });
      return false;
    }
  }

  // ============================================
  // CARE HISTORY
  // ============================================
  async getCareHistory(): Promise<CareHistory[]> {
    if (!isSupabaseConfigured()) return [];

    try {
      const { data, error } = await supabase
        .from('care_history')
        .select('*')
        .order('completed_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(row => ({
        id: row.id,
        petId: row.pet_id,
        category: row.category,
        title: row.title,
        description: row.description,
        completedAt: new Date(row.completed_at),
      }));
    } catch (error) {
      errorHandler.handleDatabaseError(error, {
        component: 'SupabaseService',
        action: 'getCareHistory',
      });
      return [];
    }
  }

  async addCareHistory(history: Omit<CareHistory, 'id'>): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;

    try {
      const { error } = await supabase.from('care_history').insert({
        pet_id: history.petId,
        category: history.category,
        title: history.title,
        description: history.description,
        completed_at: history.completedAt.toISOString(),
      });

      if (error) throw error;
      return true;
    } catch (error) {
      errorHandler.handleDatabaseError(error, {
        component: 'SupabaseService',
        action: 'addCareHistory',
      });
      return false;
    }
  }

  // ============================================
  // VACCINES
  // ============================================
  async getVaccines(): Promise<VaccineRecord[]> {
    if (!isSupabaseConfigured()) return [];

    try {
      const { data, error } = await supabase
        .from('vaccines')
        .select('*')
        .order('due_date', { ascending: true });

      if (error) throw error;
      return (data || []).map(row => ({
        id: row.id,
        petId: row.pet_id,
        name: row.name,
        dueDate: new Date(row.due_date),
        completedAt: row.completed_at ? new Date(row.completed_at) : undefined,
        status: row.status,
        notes: row.notes,
      }));
    } catch (error) {
      errorHandler.handleDatabaseError(error, {
        component: 'SupabaseService',
        action: 'getVaccines',
      });
      return [];
    }
  }

  async addVaccine(vaccine: Omit<VaccineRecord, 'id'>): Promise<VaccineRecord | null> {
    if (!isSupabaseConfigured()) return null;

    try {
      const { data, error } = await supabase
        .from('vaccines')
        .insert({
          pet_id: vaccine.petId,
          name: vaccine.name,
          due_date: vaccine.dueDate.toISOString(),
          status: vaccine.status,
          notes: vaccine.notes,
        })
        .select()
        .single();

      if (error) throw error;
      return {
        id: data.id,
        petId: data.pet_id,
        name: data.name,
        dueDate: new Date(data.due_date),
        status: data.status,
        notes: data.notes,
      };
    } catch (error) {
      errorHandler.handleDatabaseError(error, {
        component: 'SupabaseService',
        action: 'addVaccine',
      });
      return null;
    }
  }

  async completeVaccine(id: string): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;

    try {
      const { error } = await supabase
        .from('vaccines')
        .update({ status: 'completed', completed_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      errorHandler.handleDatabaseError(error, {
        component: 'SupabaseService',
        action: 'completeVaccine',
      });
      return false;
    }
  }

  // ============================================
  // DEWORMING
  // ============================================
  async getDewormingRecords(): Promise<DewormingRecord[]> {
    if (!isSupabaseConfigured()) return [];

    try {
      const { data, error } = await supabase
        .from('deworming_records')
        .select('*')
        .order('due_date', { ascending: true });

      if (error) throw error;
      return (data || []).map(row => ({
        id: row.id,
        petId: row.pet_id,
        dueDate: new Date(row.due_date),
        completedAt: row.completed_at ? new Date(row.completed_at) : undefined,
        status: row.status,
        weight: row.weight,
        notes: row.notes,
      }));
    } catch (error) {
      errorHandler.handleDatabaseError(error, {
        component: 'SupabaseService',
        action: 'getDewormingRecords',
      });
      return [];
    }
  }

  async addDeworming(record: Omit<DewormingRecord, 'id'>): Promise<DewormingRecord | null> {
    if (!isSupabaseConfigured()) return null;

    try {
      const { data, error } = await supabase
        .from('deworming_records')
        .insert({
          pet_id: record.petId,
          due_date: record.dueDate.toISOString(),
          status: record.status,
          weight: record.weight,
          notes: record.notes,
        })
        .select()
        .single();

      if (error) throw error;
      return {
        id: data.id,
        petId: data.pet_id,
        dueDate: new Date(data.due_date),
        status: data.status,
        weight: data.weight,
        notes: data.notes,
      };
    } catch (error) {
      errorHandler.handleDatabaseError(error, {
        component: 'SupabaseService',
        action: 'addDeworming',
      });
      return null;
    }
  }

  async completeDeworming(id: string): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;

    try {
      const { error } = await supabase
        .from('deworming_records')
        .update({ status: 'completed', completed_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      errorHandler.handleDatabaseError(error, {
        component: 'SupabaseService',
        action: 'completeDeworming',
      });
      return false;
    }
  }
}

export const supabaseService = new SupabaseService();
