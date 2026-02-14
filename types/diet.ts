// Diet and nutrition types

export interface Meal {
  id: string;
  petId: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  time: string;
  food: string;
  amount: string;
  calories: number;
  completed: boolean;
  completedAt?: Date;
  scheduledDate: Date;
  status?: 'fed' | 'skipped' | 'refused';
  feedback?: string;
  portionAdjustment?: 'ate-all' | 'ate-some' | 'ate-none';
}

export interface NutritionTip {
  id: string;
  icon: string;
  title: string;
  description: string;
  category: 'protein' | 'hydration' | 'safety' | 'general';
}

export interface FoodItem {
  id: string;
  name: string;
  safe: boolean;
  toxicityLevel?: 'low' | 'medium' | 'high';
  description: string;
}
