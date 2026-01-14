import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { customFetch } from "./fetcher";

export interface ShowreelResponse {
  id: string;
  actorId: string;
  actorName: string;
  title: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration?: number;
  durationFormatted?: string;
  workTitle?: string;
  genre?: string;
  description?: string;
  tags?: string[];
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateShowreelRequest {
  title: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration?: number;
  workTitle?: string;
  genre?: string;
  description?: string;
  tags?: string[];
}

export type UpdateShowreelRequest = CreateShowreelRequest;

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const getMyShowreels = async (): Promise<ApiResponse<ShowreelResponse[]>> => {
  return customFetch<ApiResponse<ShowreelResponse[]>>({
    url: "/api/showreels/me",
    method: "GET",
  });
};

export const getActorShowreels = async (actorId: string): Promise<ApiResponse<ShowreelResponse[]>> => {
  return customFetch<ApiResponse<ShowreelResponse[]>>({
    url: `/api/actors/${actorId}/showreels`,
    method: "GET",
  });
};

export const getShowreel = async (showreelId: string): Promise<ApiResponse<ShowreelResponse>> => {
  return customFetch<ApiResponse<ShowreelResponse>>({
    url: `/api/showreels/${showreelId}`,
    method: "GET",
  });
};

export const createShowreel = async (data: CreateShowreelRequest): Promise<ApiResponse<ShowreelResponse>> => {
  return customFetch<ApiResponse<ShowreelResponse>>({
    url: "/api/showreels",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data,
  });
};

export const updateShowreel = async (
  showreelId: string,
  data: UpdateShowreelRequest
): Promise<ApiResponse<ShowreelResponse>> => {
  return customFetch<ApiResponse<ShowreelResponse>>({
    url: `/api/showreels/${showreelId}`,
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    data,
  });
};

export const deleteShowreel = async (showreelId: string): Promise<ApiResponse<void>> => {
  return customFetch<ApiResponse<void>>({
    url: `/api/showreels/${showreelId}`,
    method: "DELETE",
  });
};

export const showreelKeys = {
  all: ["showreels"] as const,
  my: () => [...showreelKeys.all, "me"] as const,
  actor: (actorId: string) => [...showreelKeys.all, "actor", actorId] as const,
  detail: (showreelId: string) => [...showreelKeys.all, "detail", showreelId] as const,
};

export const useGetMyShowreels = () => {
  return useQuery({
    queryKey: showreelKeys.my(),
    queryFn: getMyShowreels,
  });
};

export const useGetActorShowreelsCustom = (actorId: string, enabled = true) => {
  return useQuery({
    queryKey: showreelKeys.actor(actorId),
    queryFn: () => getActorShowreels(actorId),
    enabled: !!actorId && enabled,
  });
};

export const useGetShowreel = (showreelId: string, enabled = true) => {
  return useQuery({
    queryKey: showreelKeys.detail(showreelId),
    queryFn: () => getShowreel(showreelId),
    enabled: !!showreelId && enabled,
  });
};

export const useCreateShowreel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createShowreel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: showreelKeys.my() });
    },
  });
};

export const useUpdateShowreel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ showreelId, data }: { showreelId: string; data: UpdateShowreelRequest }) =>
      updateShowreel(showreelId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: showreelKeys.my() });
    },
  });
};

export const useDeleteShowreel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (showreelId: string) => deleteShowreel(showreelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: showreelKeys.my() });
    },
  });
};
