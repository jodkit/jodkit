export type UserRecord = {
  id: string;
  email: string;
  display_name: string;
  created_at: string;
  updated_at: string;
};

export type CreateUserInput = {
  email: string;
  display_name: string;
};

export type PatchUserInput = Partial<CreateUserInput>;
