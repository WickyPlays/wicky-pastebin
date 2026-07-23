export const generateRandomIdNum = () => {
  return Date.now().toString();
}

export const generateRandomStr = (len: number) => {
  return Math.random().toString(36).substring(2, len + 2);
}