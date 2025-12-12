import React from 'react';

import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enBeregnetPeriode } from '@test-data/periode';
import { enPerson } from '@test-data/person';
import { render, screen } from '@testing-library/react';

import { VergemålTag } from './VergemålTag';

describe('VergemålTag', () => {
    const personUtenVarsel = enPerson();
    const personMedVarsel = enPerson().medArbeidsgivere([
        enArbeidsgiver().medPerioder([
            enBeregnetPeriode()
                .somErTilGodkjenning()
                .medVarsler([
                    {
                        __typename: 'VarselDTO',
                        kode: 'SB_EX_4',
                        id: 'a2c6db9d-f4a6-4810-ad53-ef5c0f0c692b',
                        definisjonId: '',
                        generasjonId: '',
                        opprettet: '',
                        tittel: '',
                        vurdering: null,
                        forklaring: null,
                        handling: null,
                    },
                ]),
        ]),
    ]);

    it('rendrer tag når det finnes en periode til godkjenning med varsel for vergemål', () => {
        render(<VergemålTag person={personMedVarsel} />);
        expect(screen.queryByText('Vergemål')).toBeVisible();
    });
    it('rendrer ikke tag når det ikke finnes varsel for vergemål på periode til godkjenning', () => {
        render(<VergemålTag person={personUtenVarsel} />);
        expect(screen.queryByText('Vergemål')).not.toBeInTheDocument();
    });
});
