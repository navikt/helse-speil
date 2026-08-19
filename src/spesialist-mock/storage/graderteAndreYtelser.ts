import fs from 'fs';
import path from 'path';
import { cwd } from 'process';

import { ApiGraderteAndreYtelser } from '@io/rest/generated/spesialist.schemas';
import { PersonMock } from '@spesialist-mock/storage/person';

export class GraderteAndreYtelserMock {
    static ytelser: Map<string, ApiGraderteAndreYtelser[]> = new Map();

    static {
        const url = path.join(cwd(), 'src/spesialist-mock/data/graderteAndreYtelser');
        const filenames = fs.readdirSync(url);
        const graderteAndreYtelserMockFiler = filenames.map((filename) => {
            const raw = fs.readFileSync(path.join(url, filename), { encoding: 'utf-8' });
            return JSON.parse(raw);
        });

        graderteAndreYtelserMockFiler.forEach((graderteAndreYtelserMockFil) => {
            GraderteAndreYtelserMock.ytelser.set(
                graderteAndreYtelserMockFil.fodselsnummer,
                graderteAndreYtelserMockFil.data.graderteAndreYtelser,
            );
        });
    }

    static forPseudoId = (pseudoId: string): ApiGraderteAndreYtelser[] => {
        const fødselsnummer = PersonMock.findFødselsnummerForPersonPseudoId(pseudoId);
        if (fødselsnummer === null) {
            return [];
        }
        return GraderteAndreYtelserMock.ytelser.get(fødselsnummer) ?? [];
    };

    static leggTil = (fødselsnummer: string, ytelse: ApiGraderteAndreYtelser): void => {
        const eksisterende = GraderteAndreYtelserMock.ytelser.get(fødselsnummer);
        if (eksisterende === undefined) {
            GraderteAndreYtelserMock.ytelser.set(fødselsnummer, [ytelse]);
            return;
        }
        eksisterende.push(ytelse);
    };
}
