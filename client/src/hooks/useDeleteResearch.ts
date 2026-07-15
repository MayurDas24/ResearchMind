import { useMutation, useQueryClient } from "@tanstack/react-query";
import { researchService } from "@/services/research";

export const useDeleteResearch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => researchService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["research"] });
    },
  });
};