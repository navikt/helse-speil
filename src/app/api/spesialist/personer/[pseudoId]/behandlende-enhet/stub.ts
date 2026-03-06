import { NextRequest } from 'next/server';

import { ApiBehandlendeEnhet } from '@io/rest/generated/spesialist.schemas';
import { fetchPersondata } from '@spesialist-mock/graphql';
import { PersonMock } from '@spesialist-mock/storage/person';

export async function stub(_request: NextRequest, params: Promise<{ pseudoId: string }>) {
    const { pseudoId } = await params;
    const identitetsnummer = PersonMock.findFødselsnummerForPersonPseudoId(pseudoId);
    if (!identitetsnummer) return Response.error();
    const person = fetchPersondata()[identitetsnummer];
    if (!person) return Response.error();

    const enhetNr = person.enhet.id;
    const behandlendeEnhet: ApiBehandlendeEnhet = {
        enhetNr: enhetNr,
        navn: stubnavnForEnhetsnummer(enhetNr),
        type: 'LOKAL',
    };
    return Response.json(behandlendeEnhet, { status: 200 });
}

function stubnavnForEnhetsnummer(enhetNr: string): string {
    const siffer = (i: number) => parseInt(enhetNr.charAt(i));
    return `Nav ${stedsnavnDel1[siffer(0)]}${stedsnavnDel2[siffer(1)]} ${koblingsord[siffer(2)]} ${andreStedsnavn[siffer(3)]}`;
}

const stedsnavnDel1: Record<number, string> = {
    0: 'Askemyr',
    1: 'Dvergfjell',
    2: 'Elverot',
    3: 'Fossegard',
    4: 'Grønnskau',
    5: 'Huldrevik',
    6: 'Isbjørn',
    7: 'Jernskog',
    8: 'Kvitstein',
    9: 'Lyngtind',
};

const stedsnavnDel2: Record<number, string> = {
    0: 'dal',
    1: 'heim',
    2: 'mark',
    3: 'fjord',
    4: 'ås',
    5: 'berg',
    6: 'vik',
    7: 'tun',
    8: 'nes',
    9: 'li',
};

const koblingsord: Record<number, string> = {
    0: 'og',
    1: 'i',
    2: 'ved',
    3: 'under',
    4: 'over',
    5: 'bak',
    6: 'langs',
    7: 'mellom',
    8: 'nær',
    9: 'mot',
};

const andreStedsnavn: Record<number, string> = {
    0: 'Drageskogen',
    1: 'Trollheimen',
    2: 'Nøkkelvannet',
    3: 'Alvemosen',
    4: 'Runesteinen',
    5: 'Rimfrostfjellet',
    6: 'Sølvgrotten',
    7: 'Skjebnetårnet',
    8: 'Stormgapet',
    9: 'Vinterdypet',
};
