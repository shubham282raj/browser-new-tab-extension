export const formatLSValue = (input) => {
  const str = String(input);
  const withoutFirstWord = str.split("_").slice(1).join("_");
  return formatStr(withoutFirstWord);
};

const formatStr = (input) => {
  const words = input.split("_");

  const formattedWords = words.map((word) => {
    if (!word) return "";
    return word[0].toUpperCase() + word.slice(1).toLowerCase();
  });

  return formattedWords.join(" ");
};
