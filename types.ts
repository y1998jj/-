export interface HouseProps {
  position: [number, number, number];
}

export interface ArchitecturalInsight {
  title: string;
  description: string;
  features: string[];
}

// Type for the key state map
export type KeyMap = {
  ArrowUp: boolean;
  ArrowDown: boolean;
  ArrowLeft: boolean;
  ArrowRight: boolean;
  w: boolean;
  a: boolean;
  s: boolean;
  d: boolean;
};
