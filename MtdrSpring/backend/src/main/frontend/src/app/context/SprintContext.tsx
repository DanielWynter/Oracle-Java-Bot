import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { fetchJsonArray } from "../utils/api.ts";

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
    fetchJsonArray<Sprint>("/api/sprints").then((data) => {
      const sorted = [...data].sort((a, b) => b.sprintId - a.sprintId);
      setSprints(sorted);
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
