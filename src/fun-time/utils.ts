export const uppercaseFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
export const ninjaHeaders = { headers: { 'X-Api-Key': (import.meta as any).env.VITE_NINJA } };
