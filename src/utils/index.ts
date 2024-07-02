export const genrateRandomStr = (length): string => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export function string2Enum<T>(enumObj: T, value: string): T[keyof T] | null {
  if (Object.values(enumObj).includes(value)) {
    return value as T[keyof T];
  }
  return null;
}

export const isLogin = (url: string): boolean => {
  return url.includes('/login');
};
