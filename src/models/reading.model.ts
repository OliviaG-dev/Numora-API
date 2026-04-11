export type ReadingCategory = "life-path" | "compatibility" | "forecast" | "custom";

export type Reading = {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  category: ReadingCategory;
  results: Record<string, unknown>;
  createdAt: string;
};
