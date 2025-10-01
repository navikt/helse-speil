import React from 'react';

import { finnPeriodeTilGodkjenning } from '@state/arbeidsgiver';
import { enPerson } from '@test-data/person';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { UtlandTag } from './UtlandTag';

jest.mock('@state/arbeidsgiver');

describe('UtlandTag', () => {
    const person = enPerson();
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('rendrer tag når det finnes en periode til godkjenning med varsel for utlandsenhet', () => {
        (finnPeriodeTilGodkjenning as jest.Mock).mockReturnValue({
            varsler: [
                {
                    kode: 'SB_EX_5',
                    tittel: 'Det har kommet inn dokumentasjon som igangsetter en revurdering, og den sykmeldte er nå registrert på bokommune 0393 (NAV utland og fellestjenester)',
                },
            ],
        });
        render(<UtlandTag person={person} />);
        expect(screen.queryByText('Utland')).toBeVisible();
    });
    it('rendrer ikke tag når det ikke finnes varsel for utlandsenhet på periode til godkjenning', () => {
        (finnPeriodeTilGodkjenning as jest.Mock).mockReturnValue(null);
        render(<UtlandTag person={person} />);
        expect(screen.queryByText('Utland')).not.toBeInTheDocument();
    });
});
