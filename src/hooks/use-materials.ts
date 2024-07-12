import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosApiInstance } from "../libs/axios-api-Instance";
import { queryKeys } from "../libs/react-query/constants";

// material meta hooks
export const useFetchMaterialsMeta = () => {
  return useQuery({
    queryKey: [queryKeys.getMaterialsMeta],
    queryFn: async () => {
      const { data } = await axiosApiInstance.get("/materialmeta");
      return data;
    },
  });
};

export const useUpdateMaterialMeta = () => {
  return useMutation({
    mutationFn: async ({
      materialMetaId,
      data,
    }: {
      materialMetaId: string;
      data: any;
    }) => {
      const response = await axiosApiInstance.put(
        `/materialmeta/${materialMetaId}`,
        data
      );
      return response.data;
    },
  });
};

export const useCreateMaterialMeta = () => {
  return useMutation({
    mutationFn: async ({ data }: { data: any }) => {
      const response = await axiosApiInstance.post(`/materialmeta`, data);
      return response.data;
    },
  });
};

export const useDeleteMaterialMeta = () => {
  return useMutation({
    mutationFn: async ({ materialMetaId }: { materialMetaId: string }) => {
      const response = await axiosApiInstance.delete(
        `/materialmeta/${materialMetaId}`
      );
      return response.data;
    },
  });
};

// material variations hook
export const useFetchMaterialVariationsMeta = () => {
  return useQuery({
    queryKey: [queryKeys.getMaterialsVariationsMeta],
    queryFn: async () => {
      const { data } = await axiosApiInstance.get("/materialvariationmeta");
      return data;
    },
  });
};

export const useUpdateMaterialVariationMeta = () => {
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await axiosApiInstance.put(
        `/materialvariationmeta/${id}`,
        data
      );
      return response.data;
    },
  });
};

export const useCreateMaterialVariationMeta = () => {
  return useMutation({
    mutationFn: async ({ data }: { data: any }) => {
      const response = await axiosApiInstance.post(
        `/materialvariationmeta`,
        data
      );
      return response.data;
    },
  });
};

export const useDeleteMaterialVariationMeta = () => {
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const response = await axiosApiInstance.delete(
        `/materialvariationmeta/${id}`
      );
      return response.data;
    },
  });
};

// material finishes hook
export const useFetchMaterialFinishesMeta = () => {
  return useQuery({
    queryKey: [queryKeys.getMaterialsFinishesMeta],
    queryFn: async () => {
      const { data } = await axiosApiInstance.get("/materialfinishmeta");
      return data;
    },
  });
};

export const useUpdateMaterialFinishMeta = () => {
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await axiosApiInstance.put(
        `/materialfinishmeta/${id}`,
        data
      );
      return response.data;
    },
  });
};

export const useCreateMaterialFinishMeta = () => {
  return useMutation({
    mutationFn: async ({ data }: { data: any }) => {
      const response = await axiosApiInstance.post(`/materialfinishmeta`, data);
      return response.data;
    },
  });
};

export const useDeleteMaterialFinishMeta = () => {
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const response = await axiosApiInstance.delete(
        `/materialfinishmeta/${id}`
      );
      return response.data;
    },
  });
};
