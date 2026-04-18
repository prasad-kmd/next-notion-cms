import { Author } from "./content";

export async function getAuthorBasic(slug: string): Promise<Author | null> {
  const response = await fetch(`/api/author?slug=${slug}`);
  if (!response.ok) return null;
  return response.json();
}
