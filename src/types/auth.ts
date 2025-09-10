export type UserRole = 'superadmin' | 'admin' | 'user';

export interface Area {
  id: number;
  name: string;
  description: string;
  knowledgeBaseId: string;
}

export interface User {
  id: number | string;
  name: string;
  email: string;
  role: UserRole;
  areas: Area[];
}

export interface AuthResponse {
  ok: boolean;
  message: string;
  data: {
    id: string;
    email: string;
    area: string;
  };
  token?: string;
}
