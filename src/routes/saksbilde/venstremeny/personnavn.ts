import { ApiPerson } from '@io/rest/generated/spesialist.schemas';

type Navn = Pick<ApiPerson, 'fornavn' | 'mellomnavn' | 'etternavn'>;

export const getFormattedName = ({ fornavn, mellomnavn, etternavn }: Navn): string =>
    `${fornavn} ${mellomnavn ? `${mellomnavn} ${etternavn}` : etternavn}`;
