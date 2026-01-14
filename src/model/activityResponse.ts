export interface ActivityResponse {
  id: string;
  type: 'view' | 'like' | 'contact';
  message: string;
  relatedUserId?: string;
  relatedUserName?: string;
  relatedEntityId?: string;
  createdAt: string;
}

export interface RecentActivitiesResponse {
  activities: ActivityResponse[];
  total: number;
}
