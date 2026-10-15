export interface Grup {
  id: string;
  name: string;
  description: string;
  is_private: boolean;
  photo_path: string | null;
}

export interface GroupMember {
  id: string;
  role: string;
  user_id: string;
  grup_id: string;
  created_at: string;
  user: {
    id: string;
    name: string;
    username: string;
    nickname?: string;
  };
}
