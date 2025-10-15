import { ApiPersonnavn } from '@io/rest/generated/spesialist.schemas';

type NameFormat = ('E' | 'F' | 'M' | ',')[];

export const getFormatertNavn = (navn: ApiPersonnavn, format: NameFormat = ['F', 'M', 'E']): string => {
    return format
        .map((code) => {
            switch (code) {
                case 'E':
                    return navn.etternavn;
                case 'F':
                    return navn.fornavn;
                case 'M':
                    return navn.mellomnavn;
                case ',':
                    return ',';
            }
        })
        .filter((it) => it)
        .map((it, i) => (i === 0 || it === ',' ? it : ` ${it}`))
        .join('');
};
