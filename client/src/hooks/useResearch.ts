//client/src/hooks/useResearch.ts
import { useQuery } from "@tanstack/react-query";
import { researchService } from "@/services/research";

export const useResearchList = () => {
  return useQuery({
    queryKey: ["research", "all"],
    queryFn: researchService.getAll,
    refetchInterval: 15000, // fallback poll; sockets handle instant updates
  });
};