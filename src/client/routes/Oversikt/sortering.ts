export const sorterTall = (a: number, b: number) => a - b;

export const sorterDateString = (a: string, b: string) => new Date(a).getTime() - new Date(b).getTime();

export const sorterTekstAlfabetisk = (a: string, b: string) => a.localeCompare(b, 'nb-NO');
