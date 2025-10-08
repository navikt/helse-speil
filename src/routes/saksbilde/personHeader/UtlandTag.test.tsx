import React from 'react';

import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enBeregnetPeriode } from '@test-data/periode';
import { enPerson } from '@test-data/person';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { UtlandTag } from './UtlandTag';

describe('UtlandTag', () => {
    const periode = enBeregnetPeriode()
        .somErTilGodkjenning()
        .medVarsler([
            {
                __typename: 'VarselDTO',
                kode: 'SB_EX_5',
                tittel: 'Det har kommet inn dokumentasjon som igangsetter en revurdering, og den sykmeldte er nå registrert på bokommune 0393 (NAV utland og fellestjenester)',
                definisjonId: '',
                forklaring: '',
                generasjonId: '',
                handling: '',
                opprettet: '',
                vurdering: null,
            },
        ]);
    const arbeidsgiver = enArbeidsgiver().medPerioder([periode]);
    const personMedVarsel = enPerson().medArbeidsgivere([arbeidsgiver]);
    const personUtenVarsel = enPerson();
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('rendrer tag når det finnes en periode til godkjenning med varsel for utlandsenhet', () => {
        render(<UtlandTag person={personMedVarsel} />);
        expect(screen.queryByText('Utland')).toBeVisible();
    });
    it('rendrer ikke tag når det ikke finnes varsel for utlandsenhet på periode til godkjenning', () => {
        render(<UtlandTag person={personUtenVarsel} />);
        expect(screen.queryByText('Utland')).not.toBeInTheDocument();
    });
});
