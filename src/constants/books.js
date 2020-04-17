const dateFilter = (book) => {
  const d = new Date();
  const monthAgo = d.setMonth(d.getMonth() - 1);
  return book.created && book.created > monthAgo;
};

const categoryFilter =  (id) => (book) => {
  return parseInt(book.category, 10) === parseInt(id, 10);
};

const favFilter = (book) => book.rating >= 4;

export const ExtraCategories = [
  { id: 1, title: "Ostatnio dodane", key: 'ostatnio-dodane', filterBy: dateFilter },
  { id: 2, title: "Ulubione", key: "ulubione", filterBy: favFilter },
];
export const UserCategories = [
  { id: 1, title: "Biografia", key: "biografia", filterBy: categoryFilter(1) },
  { id: 2, title: "Historia", key: "historia", filterBy: categoryFilter(2) },
  { id: 3, title: "Literatura młodzieżowa", key: "literatura-mlodziezowa", filterBy: categoryFilter(3) },
  { id: 4, title: "Dla dzieci", key: "dla-dzieci", filterBy: categoryFilter(4) },
  { id: 5, title: "Horror", key: "horror", filterBy: categoryFilter(5) },
  { id: 6, title: "Literatura obyczajowa" , key: "literatura-obyczajowa" , filterBy: categoryFilter(6) },
  { id: 7, title: "Romans", key: "romans", filterBy: categoryFilter(7) },
  { id: 9, title: "Literatura piękna", key: "literatura-piekna", filterBy: categoryFilter(9) },
  { id: 10, title: "Literatura anglojęzyczna", key: "literatura-anglojezyczna", filterBy: categoryFilter(10) },
  { id: 11, title: "Literatura faktu", key: "literatura-faktu", filterBy: categoryFilter(11) },
  { id: 12, title: "Kryminał/thriller" , key: "kryminal-thriller" , filterBy: categoryFilter(12) },
  { id: 13, title: "Fantastyka", key: "fantastyka", filterBy: categoryFilter(13) },
  { id: 14, title: "Inna", key: "inna", filterBy: categoryFilter(14) }
];

export const Categories = [...ExtraCategories, ...UserCategories];