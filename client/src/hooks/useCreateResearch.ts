import { useMutation, useQueryClient } from "@tanstack/react-query";
import { researchService } from "@/services/research";

export const useCreateResearch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (topic: string) => researchService.create(topic),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["research"] });
    },
  });
};