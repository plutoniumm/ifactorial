export const load = async ({ params }) => {
  let file = params.slug;
  let type = file.split('.').pop();

  file = file.replace(`.${type}`, '');

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