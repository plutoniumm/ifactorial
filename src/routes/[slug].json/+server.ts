import type { RequestHandler } from './$types';
import { json, redirect } from "@sveltejs/kit";


export const GET: RequestHandler = async ({ params }) => {
  const file = params.slug;
  let books = await import(`../../../data/${file}.csv`);
  books = books.default;

  if (!books) {
    throw redirect(302, '/');
  };

  return json(books);
};