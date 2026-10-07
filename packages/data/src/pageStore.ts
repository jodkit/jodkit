export type PageRecord = {
  id: string;
  slug: string;
  title: string;
  body: string;
  status: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type CreatePageInput = {
  slug: string;
  title: string;
  body: string;
  status: string;
  published_at?: string;
};

export type PatchPageInput = Partial<CreatePageInput>;
