//client/src/services/research.ts
import api from "@/lib/axios";
import { Research } from "@/types/research";

export const researchService = {
  getAll: async (): Promise<Research[]> => {
    const { data } = await api.get<Research[]>("/research");
    return data;
  },

  getById: async (id: string): Promise<Research> => {
    const { data } = await api.get<Research>(`/research/${id}`);
    return data;
  },

  create: async (
    topic: string
  ): Promise<{ success: boolean; researchId: string; jobId: string }> => {
    const { data } = await api.post("/research", { topic });
    return data;
  },

  delete: async (id: string): Promise<{ success: boolean }> => {
    const { data } = await api.delete(`/research/${id}`);
    return data;
  },
};