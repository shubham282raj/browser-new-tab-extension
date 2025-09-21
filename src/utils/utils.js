export const toggleLSKey = (key) => {
  const val = getBoolLS(key);
  localStorage.setItem(key, !val);
};

export const getBoolLS = (key) => {
  return localStorage.getItem(key) == "true";
};
