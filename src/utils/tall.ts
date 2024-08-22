export const isNumeric = (input: string): boolean => /^\d+(\.\d{1,2})?$/.test(input);
export const avrundetToDesimaler = (tall: number): number => Math.round((tall + Number.EPSILON) * 100) / 100;
