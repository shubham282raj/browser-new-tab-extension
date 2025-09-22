export const toggleLSKey = (key) => {
  const val = getBoolLS(key);
  localStorage.setItem(key, !val);
  return !val;
};

export const getBoolLS = (key) => {
  return localStorage.getItem(key) == "true";
};

export const getLS = (key) => localStorage.getItem(key);
