import fs from 'fs';
import path from 'path';
import { cwd } from 'process';
import { v5 as uuidv5 } from 'uuid';

import { UUID } from '@typer/spesialist-mock';

type PersonIdentifikatorer = {
    aktørId: string;
    fødselsnummer: string;
    personPseudoId: UUID;
};

const lesPersoner = () => {
    const url = path.join(cwd(), 'src/spesialist-mock/data/personer');
    const filenames = fs.readdirSync(url);
    return filenames.map((filename) => {
        const raw = fs.readFileSync(path.join(url, filename), { encoding: 'utf-8' });
        return JSON.parse(raw).data.person;
    });
};

const UUID_NAMESPACE = '0e4ec8b1-8fad-4003-b4a4-69d90be4eee0';

const mapTilPersonIdentifikatorer = lesPersoner().map((it) => ({
    aktørId: it.aktorId,
    fødselsnummer: it.fodselsnummer,
    personPseudoId: uuidv5(it.fodselsnummer, UUID_NAMESPACE),
}));

export class PersonMock {
    private static persons: PersonIdentifikatorer[] = [
        ...mapTilPersonIdentifikatorer,
        {
            aktørId: '1000000000003',
            fødselsnummer: '',
            personPseudoId: 'b99b7845-f892-484c-b1d8-e070d2821bb6',
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
