import React from 'react';
import { Mock, vi } from 'vitest';

import { useFetchPersonQuery } from '@state/person';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enBeregnetPeriode } from '@test-data/periode';
import { enPerson } from '@test-data/person';
import { render, screen } from '@testing-library/react';

import { VergemålTag } from './VergemålTag';

vi.mock('@state/person');

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
                        behandlingId: '',
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
        (useFetchPersonQuery as Mock).mockReturnValue({ data: { person: personMedVarsel } });
        render(<VergemålTag />);
        expect(screen.queryByText('Vergemål')).toBeVisible();
    });
    it('rendrer ikke tag når det ikke finnes varsel for vergemål på periode til godkjenning', () => {
        (useFetchPersonQuery as Mock).mockReturnValue({ data: { person: personUtenVarsel } });
        render(<VergemålTag />);
        expect(screen.queryByText('Vergemål')).not.toBeInTheDocument();
    });
});
