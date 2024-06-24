import { useMutation, useQuery } from "@tanstack/react-query";

import { axiosApiInstance } from "../libs/axios-api-Instance";
import { queryKeys } from "../libs/react-query/constants";

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

export const useFetchFixtureMeta = () => {
  return useQuery({
    queryKey: [queryKeys.getFixtureMeta],
    queryFn: async () => {
      const { data } = await axiosApiInstance.get("/fixturemeta");
      return data;
    },
  });
};

export const useFetchSpaceMeta = () => {
  return useQuery({
    queryKey: [queryKeys.getSpaceMeta],
    queryFn: async () => {
      const { data } = await axiosApiInstance.get("/spacemeta");
      return data;
    },
  });
};

export const useUpdateHomeMeta = () => {
  return useMutation({
    mutationFn: async ({
      homeMetaId,
      data,
    }: {
      homeMetaId: string;
      data: any;
    }) => {
      const response = await axiosApiInstance.put(
        `/homemeta/${homeMetaId}`,
        data
      );
      return response.data;
    },
  });
};

export const useCreateHomeMeta = () => {
  return useMutation({
    mutationFn: async ({ data }: { data: any }) => {
      const response = await axiosApiInstance.post(`/homemeta`, data);
      return response.data;
    },
  });
};

export const useDeleteHomeMeta = () => {
  return useMutation({
    mutationFn: async ({ homeMetaId }: { homeMetaId: string }) => {
      const response = await axiosApiInstance.delete(`/homemeta/${homeMetaId}`);
      return response.data;
    },
  });
};

export const useUpdateSpaceMeta = () => {
  return useMutation({
    mutationFn: async ({
      spaceMetaId,
      data,
    }: {
      spaceMetaId: string;
      data: any;
    }) => {
      const response = await axiosApiInstance.put(
        `/spacemeta/${spaceMetaId}`,
        data
      );
      return response.data;
    },
  });
};

export const useCreateSpaceMeta = () => {
  return useMutation({
    mutationFn: async ({ data }: { data: any }) => {
      const response = await axiosApiInstance.post(`/spacemeta`, data);
      return response.data;
    },
  });
};

export const useDeleteSpaceMeta = () => {
  return useMutation({
    mutationFn: async ({ spaceMetaId }: { spaceMetaId: string }) => {
      const response = await axiosApiInstance.delete(
        `/spacemeta/${spaceMetaId}`
      );
      return response.data;
    },
  });
};

export const useUpdateFixtureMeta = () => {
  return useMutation({
    mutationFn: async ({
      fixtureMetaId,
      data,
    }: {
      fixtureMetaId: string;
      data: any;
    }) => {
      const response = await axiosApiInstance.put(
        `/fixturemeta/${fixtureMetaId}`,
        data
      );
      return response.data;
    },
  });
};

export const useCreateFixtureMeta = () => {
  return useMutation({
    mutationFn: async ({ data }: { data: any }) => {
      const response = await axiosApiInstance.post(`/fixturemeta`, data);
      return response.data;
    },
  });
};

export const useDeleteFixtureMeta = () => {
  return useMutation({
    mutationFn: async ({ fixtureMetaId }: { fixtureMetaId: string }) => {
      const response = await axiosApiInstance.delete(
        `/fixturemeta/${fixtureMetaId}`
      );
      return response.data;
    },
  });
};
