import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

export interface Sprint {
  sprintId: number;
  sprintName: string;
  startDate: string;
  endDate: string;
  status: string;
}

interface SprintContextType {
  sprints: Sprint[];
  selectedSprintId: number | null;
  setSelectedSprintId: (id: number | null) => void;
}

const SprintContext = createContext<SprintContextType>({
  sprints: [],
  selectedSprintId: null,
  setSelectedSprintId: () => {},
});

export function SprintProvider({ children }: { children: ReactNode }) {
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [selectedSprintId, setSelectedSprintId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/sprints")
      .then((r) => r.json())
      .then((data: Sprint[]) => {
        const sorted = [...data].sort((a, b) => b.sprintId - a.sprintId);
        setSprints(sorted);
        // Default: null = All Sprints (shows aggregate across all)
      });
  }, []);

  return (
    <SprintContext.Provider
      value={{ sprints, selectedSprintId, setSelectedSprintId }}
    >
      {children}
    </SprintContext.Provider>
  );
}

export const useSprint = () => useContext(SprintContext);
