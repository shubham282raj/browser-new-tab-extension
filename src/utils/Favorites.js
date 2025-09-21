export const getFavs = () => {
  return localStorage.getItem("favorites")
    ? JSON.parse(localStorage.getItem("favorites"))
    : [];
};

const setFavs = (favs) => {
  return localStorage.setItem("favorites", JSON.stringify(favs));
};

function shallowEqual(obj1, obj2) {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (let key of keys1) {
    if (obj1[key] !== obj2[key]) return false;
  }

  return true;
}

export const deleteFavorite = (obj) => {
  const favs = getFavs();
  const reduced = favs.filter((fav) => !shallowEqual(fav, obj));
  setFavs(reduced);
};

export const addFavorite = (obj) => {
  const favs = getFavs();
  const added = [...favs, obj];
  setFavs(added);
};
