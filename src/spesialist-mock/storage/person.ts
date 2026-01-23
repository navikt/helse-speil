import { UUID } from '@typer/spesialist-mock';

type PersonIdentifikatorer = {
    aktørId: string;
    fødselsnummer: string;
    personPseudoId: UUID;
};

export class PersonMock {
    private static persons: PersonIdentifikatorer[] = [
        {
            aktørId: '2150126368568',
            fødselsnummer: '14829598281',
            personPseudoId: '340c37bf-a259-4c89-b3c1-5fb44ef1d653',
        },
        {
            aktørId: '2407074650987',
            fødselsnummer: '07489201431',
            personPseudoId: '951269d2-c272-4c64-9fa7-f25eac943c59',
        },
        {
            aktørId: '1000001337420',
            fødselsnummer: '12345678910',
            personPseudoId: 'f3f2afdf-fe55-4f6c-b77a-38c15de1642d',
        },
        {
            aktørId: '2805594640665',
            fødselsnummer: '07518405122',
            personPseudoId: 'b826d675-a38c-4c68-a1da-01d11d8e86e2',
        },
        {
            aktørId: '2948505693240',
            fødselsnummer: '23817999700',
            personPseudoId: '6d11ed7f-d58b-4edf-99cb-9295f549affc',
        },
        {
            aktørId: '2037105535448',
            fødselsnummer: '17466707384',
            personPseudoId: '7a2a5219-93d5-4d0e-8bdd-f61cc43c298b',
        },
        {
            aktørId: '2117136462117',
            fødselsnummer: '19886497256',
            personPseudoId: '62a99893-299d-41ef-9ef4-7f3454a1a9ab',
        },
        {
            aktørId: '2564094783926',
            fødselsnummer: '06028620819',
            personPseudoId: '75dc6e54-b8e2-45b8-a9e0-48c018c613a4',
        },
        {
            aktørId: '2348185725298',
            fødselsnummer: '57419121128',
            personPseudoId: '2d1bc122-bbfc-4338-b2e9-f0fa4fbad2ba',
        },
        {
            aktørId: '1000000000003',
            fødselsnummer: '',
            personPseudoId: 'b99b7845-f892-484c-b1d8-e070d2821bb6',
        },
        {
            aktørId: '',
            fødselsnummer: '12050183422',
            personPseudoId: '71f65ed6-54ec-42cf-85db-ea69892ac281',
        },
    ];

    static findFødselsnummer = (searchTerm: string): string | null => {
        return (
            PersonMock.persons.find((person) => {
                if (person.aktørId == searchTerm || person.personPseudoId == searchTerm) return person;
            })?.fødselsnummer ?? null
        );
    };

    static findPersonPseudoId = (searchTerm: string): string | null => {
        return (
            PersonMock.persons.find((person) => {
                if (person.aktørId == searchTerm || person.fødselsnummer == searchTerm) return person;
            })?.personPseudoId ?? null
        );
    };
}
