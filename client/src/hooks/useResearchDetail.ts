import { useQuery } from "@tanstack/react-query";
import { researchService } from "@/services/research";

export const useResearchDetail = (id: string | undefined) => {
  return useQuery({
    queryKey: ["research", "detail", id],
    queryFn: () => researchService.getById(id as string),
    enabled: !!id,
    refetchInterval: 5000,
  });
};