export type PostRecord = {
  id: string;
  slug: string;
  title: string;
  body: string;
  page_id: string;
  created_at: string;
  updated_at: string;
};

export type CreatePostInput = {
  slug: string;
  title: string;
  body: string;
  page_id: string;
};

export type PatchPostInput = Partial<CreatePostInput>;
