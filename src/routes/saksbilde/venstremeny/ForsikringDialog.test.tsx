import React from 'react';

import { ApiForsikringsvurdering } from '@io/rest/generated/spesialist.schemas';
import { ForsikringDialog } from '@saksbilde/venstremeny/ForsikringDialog';
import { render, screen } from '@test-utils';
import userEvent from '@testing-library/user-event';

const forsikringsvurdering: ApiForsikringsvurdering = {
    eksisterer: true,
    forsikringInnhold: { gjelderFraDag: 17, dekningsgrad: 100 },
    gjeldendeForsikring: {
        virkningsdato: '2026-08-12',
        opphørsdato: null,
        dekningsgrad: 100,
        dekningIVentetid: false,
    },
    ekskluderteForsikringer: [
        {
            virkningsdato: '2020-01-01',
            opphørsdato: '2021-01-01',
            dekningsgrad: 80,
            dekningIVentetid: true,
            ekskluderingsårsak: 'ALDRI_BETALT',
        },
    ],
};

describe('ForsikringDialog', () => {
    it('åpner dialog med alle forsikringsdataene når man klikker på dekningsteksten', async () => {
        render(<ForsikringDialog forsikringsvurdering={forsikringsvurdering} dekningstekst="100 % fra 17. dag" />);

        await userEvent.click(screen.getByRole('button', { name: '100 % fra 17. dag' }));

        expect(await screen.findByRole('dialog')).toBeVisible();
        expect(screen.getByText('Gjeldende forsikring')).toBeVisible();
        expect(screen.getByText('12.08.2026')).toBeVisible();
        expect(screen.getByText('Aldri betalt')).toBeVisible();
        expect(screen.getByText('01.01.2021')).toBeVisible();
    });
});
