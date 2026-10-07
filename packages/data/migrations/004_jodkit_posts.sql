-- Generated from defineCollection("posts")
CREATE TABLE IF NOT EXISTS "jodkit_posts" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "slug" text NOT NULL UNIQUE,
  "title" text NOT NULL,
  "body" text NOT NULL,
  "page_id" uuid NOT NULL REFERENCES "jodkit_pages"("id"),
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);
