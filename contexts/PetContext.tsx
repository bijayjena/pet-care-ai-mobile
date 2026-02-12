import { createContext, useContext, ReactNode } from 'react';
import { usePetData } from '@/hooks/usePetData';
import type { Pet, Reminder } from '@/types/pet';

interface PetContextType {
  pets: Pet[];
  reminders: Reminder[];
  completeReminder: (id: string) => void;
  addReminder: (reminder: Omit<Reminder, 'id'>) => void;
}

const PetContext = createContext<PetContextType | undefined>(undefined);

export function PetProvider({ children }: { children: ReactNode }) {
  const petData = usePetData();

  return (
    <PetContext.Provider value={petData}>
      {children}
    </PetContext.Provider>
  );
}

export function usePets() {
  const context = useContext(PetContext);
  if (context === undefined) {
    throw new Error('usePets must be used within a PetProvider');
  }
  return context;
}
