import dayjs from 'dayjs';
import React from 'react';

import { Button } from '@navikt/ds-react';

import { ApiForsikringsvurdering } from '@io/rest/generated/spesialist.schemas';
import { ForsikringDialog } from '@saksbilde/venstremeny/ForsikringDialog';
import { render, screen } from '@test-utils';
import userEvent from '@testing-library/user-event';
import { NORSK_DATOFORMAT } from '@utils/date';

const forsikringsvurdering: ApiForsikringsvurdering = {
    eksisterer: true,
    forsikringInnhold: { gjelderFraDag: 17, dekningsgrad: 100 },
    gjeldendeForsikring: {
        virkningsdato: '2026-08-12',
        opphørsdato: null,
        dekningsgrad: 100,
        dekningIVentetid: false,
        navn: '100 % fra dag 17',
        folketrygdlovenreferanse: { kapittel: 8, paragrafIKapittel: 36, ledd: 1, bokstav: 'b' },
    },
    ekskluderteForsikringer: [
        {
            virkningsdato: '2020-01-01',
            opphørsdato: '2021-01-01',
            dekningsgrad: 80,
            dekningIVentetid: true,
            navn: '80 % fra dag 1',
            folketrygdlovenreferanse: { kapittel: 8, paragrafIKapittel: 36, ledd: 1, bokstav: 'a' },
            ekskluderingsårsak: 'ALDRI_BETALT',
            ekskluderingsbegrunnelse: {
                forklaring: 'Forsikringen er innvilget, men ikke betalt ennå',
                folketrygdlovenreferanse: null,
            },
        },
    ],
};

describe('ForsikringDialog', () => {
    it('åpner dialog med alle forsikringsdataene når man klikker på knappen', async () => {
        render(
            <ForsikringDialog
                forsikringsvurdering={forsikringsvurdering}
                skjæringstidspunkt="2026-08-01"
                trigger={<Button>Se vurdering</Button>}
            />,
        );

        await userEvent.click(screen.getByRole('button', { name: 'Se vurdering' }));

        expect(await screen.findByRole('dialog')).toBeVisible();

        expect(screen.getByRole('heading', { name: 'Grunnlag for forsikringsvurdering' })).toBeVisible();
        expect(screen.getByText('Gjelder sykefravær med skjæringstidspunkt 01.08.2026')).toBeVisible();
        expect(screen.getByText(`Opplysninger hentet og vurdert ${dayjs().format(NORSK_DATOFORMAT)}`)).toBeVisible();
        expect(screen.getByRole('button', { name: 'Hent og vurder på nytt' })).toBeVisible();

        expect(screen.getByRole('cell', { name: /100 % fra dag 17/ })).toBeVisible();
        expect(screen.getByRole('link', { name: '§ 8-36 1. ledd bokstav b' })).toBeVisible();
        expect(screen.getByRole('cell', { name: '12.08.2026' })).toBeVisible();
        expect(screen.getByRole('cell', { name: 'Lagt til grunn' })).toBeVisible();

        expect(screen.getByRole('cell', { name: /80 % fra dag 1/ })).toBeVisible();
        expect(screen.getByRole('cell', { name: '01.01.2020' })).toBeVisible();
        expect(screen.getByRole('cell', { name: '01.01.2021' })).toBeVisible();
        expect(screen.getByRole('cell', { name: 'Forsikringen er innvilget, men ikke betalt ennå' })).toBeVisible();
    });

    it('sorterer radene etter gjelder fra, deretter opphører med tomme sist', async () => {
        render(
            <ForsikringDialog
                forsikringsvurdering={forsikringsvurdering}
                skjæringstidspunkt="2026-08-01"
                trigger={<Button>Se vurdering</Button>}
            />,
        );

        await userEvent.click(screen.getByRole('button', { name: 'Se vurdering' }));

        const rader = screen.getAllByRole('row').slice(1);
        expect(rader[0]).toHaveTextContent('80 % fra dag 1');
        expect(rader[1]).toHaveTextContent('100 % fra dag 17');
    });
});
