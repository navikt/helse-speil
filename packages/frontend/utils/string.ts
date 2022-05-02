import { Personinfo } from '@io/graphql';

type NameFormat = ('E' | 'F' | 'M' | ',')[];

export const getFormatertNavn = (personinfo: Personinfo, format: NameFormat = ['F', 'M', 'E']): string => {
    return format
        .map((code) => {
            switch (code) {
                case 'E':
                    return personinfo.etternavn;
                case 'F':
                    return personinfo.fornavn;
                case 'M':
                    return personinfo.mellomnavn;
                case ',':
                    return ',';
            }
        })
        .filter((it) => it)
        .map((it, i) => (i === 0 || it === ',' ? it : ` ${it}`))
        .join('');
};
