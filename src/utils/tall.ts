export const isNumeric = (input: string): boolean => /^\d+(\.\d{1,2})?$/.test(input);
export const avrundetToDesimaler = (tall: number): number => Math.round((tall + Number.EPSILON) * 100) / 100;
export const avviksprosentVisning = (tall: number): string =>
    `${tall > 25 && tall < 25.5 ? '> ' : ''}${avrundTilHeltall(tall)} %`;
const avrundTilHeltall = (tall: number): number => Math.round(tall + Number.EPSILON);
