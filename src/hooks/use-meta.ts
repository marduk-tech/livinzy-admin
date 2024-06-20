import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../libs/react-query/constants";
import { axiosApiInstance } from "../libs/axios-api-Instance";

// Custom hook to fetch projects using useQuery
export const useFetchHomeMeta = () => {
  return useQuery({
    queryKey: [queryKeys.getHomeMeta],
    queryFn: async () => {
      const { data } = await axiosApiInstance.get("/homemeta");
      return data;
    },
  });
};
