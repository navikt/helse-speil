export const isNumeric = (input: string): boolean => /^\d+(\.\d{1,2})?$/.test(input);
export const avrundetToDesimaler = (tall: number): number => Math.round((tall + Number.EPSILON) * 100) / 100;
export const avviksprosentVisning = (tall: number): string => {
    if (tall > 25 && tall < 25.5) {
        return `mer enn 25 %`;
    } else if (tall <= 25 && tall > 24.5) {
        return `mindre enn eller lik 25 %`;
    }
    return `${avrundTilHeltall(tall)} %`;
};
const avrundTilHeltall = (tall: number): number => Math.round(tall + Number.EPSILON);
