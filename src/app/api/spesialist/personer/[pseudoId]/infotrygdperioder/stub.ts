import { NextRequest } from 'next/server';

import { ApiInfotrygdperiode } from '@io/rest/generated/spesialist.schemas';
import { PersonMock } from '@spesialist-mock/storage/person';

export async function stub(_request: NextRequest, params: Promise<{ pseudoId: string }>) {
    const { pseudoId } = await params;
    const fnr = PersonMock.findFødselsnummerForPersonPseudoId(pseudoId);
    if (!fnr) return Response.error();

    const index = Number(fnr.at(-1));
    return Response.json(periodelister[index], { status: 200 });
}

const periodelister: ApiInfotrygdperiode[][] = [
    [],
    [],
    [],
    [{ fom: '2021-03-01', tom: '2021-03-14' }],
    [{ fom: '2022-06-15', tom: '2022-07-10' }],
    [
        { fom: '2020-01-05', tom: '2020-01-25' },
        { fom: '2020-09-01', tom: '2020-09-30' },
    ],
    [{ fom: '2023-02-01', tom: '2023-02-28' }],
    [
        { fom: '2019-11-01', tom: '2019-11-15' },
        { fom: '2021-05-10', tom: '2021-06-04' },
    ],
    [
        { fom: '2022-08-01', tom: '2022-08-21' },
        { fom: '2023-01-09', tom: '2023-01-30' },
        { fom: '2023-07-03', tom: '2023-07-31' },
    ],
    [{ fom: '2020-04-01', tom: '2020-04-14' }],
];
