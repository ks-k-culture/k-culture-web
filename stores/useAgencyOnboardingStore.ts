import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AgencyOnboardingData {
  agencyName: string;
  representativeName: string;
  foundedYear: string;
  specialty: string;
  profileImage: string | null;
}

interface AgencyOnboardingStore {
  data: AgencyOnboardingData;
  lastSavedAt: Date | null;
  updateData: (updates: Partial<AgencyOnboardingData>) => void;
  resetData: () => void;
  getCompletionPercentage: () => number;
}

const defaultData: AgencyOnboardingData = {
  agencyName: "",
  representativeName: "",
  foundedYear: "",
  specialty: "",
  profileImage: null,
};

export const useAgencyOnboardingStore = create<AgencyOnboardingStore>()(
  persist(
    (set, get) => ({
      data: { ...defaultData },
      lastSavedAt: null,

      updateData: (updates) => {
        set((state) => ({
          data: { ...state.data, ...updates },
          lastSavedAt: new Date(),
        }));
      },

      resetData: () => {
        set({ data: { ...defaultData }, lastSavedAt: null });
      },

      getCompletionPercentage: () => {
        const { data } = get();
        let completed = 0;
        const total = 4;

        if (data.agencyName) completed++;
        if (data.representativeName) completed++;
        if (data.foundedYear) completed++;
        if (data.specialty) completed++;

        return Math.round((completed / total) * 100);
      },
    }),
    {
      name: "agency-onboarding-storage",
    }
  )
);
