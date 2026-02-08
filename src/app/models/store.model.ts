export interface Store {
  id: string;          // uuid
  name: string;
  created_at: string; // timestamp
  created_by: string; // user_id (auth.users.id)
}