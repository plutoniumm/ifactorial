export const load = async ({ params }) => {
  const file = params.slug;
  let books = await import(`../../../data/${file}.csv`);
  books = books.default;

  if (!books) {
    return { status: 404 };
  };

  return {
    books,
    index: params.slug.match(/\d/g).join(""),
  }
};