export const createSlug = (title) => {
  let res = "";
  for (let char of title) {
    char = char.toLowerCase();
    if (char >= "a" && char <= "z") {
      res = res + char;
    } else {
      res = res + "-";
    }
  }
  return res;
};
