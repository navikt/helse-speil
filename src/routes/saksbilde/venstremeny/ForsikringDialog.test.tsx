import React from 'react';

import { Button } from '@navikt/ds-react';

import { ApiForsikringsvurdering } from '@io/rest/generated/spesialist.schemas';
import { ForsikringDialog } from '@saksbilde/venstremeny/ForsikringDialog';
import { render, screen } from '@test-utils';
import userEvent from '@testing-library/user-event';

const forsikringsvurdering: ApiForsikringsvurdering = {
    samletDekning: { fraDag: 17, grad: 100 },
    navKjøpteForsikringer: [
        {
            virkningsdato: '2026-08-12',
            opphørsdato: null,
            navn: '100 % fra dag 17',
            dekningFolketrygdlovenreferanse: { kapittel: 8, paragrafIKapittel: 36, ledd: 1, bokstav: 'b' },
            konklusjon: { forklaring: 'Lagt til grunn', folketrygdlovenreferanse: null },
            lagtTilGrunn: true,
        },
        {
            virkningsdato: '2020-01-01',
            opphørsdato: '2021-01-01',
            navn: '80 % fra dag 1',
            dekningFolketrygdlovenreferanse: { kapittel: 8, paragrafIKapittel: 36, ledd: 1, bokstav: 'a' },
            konklusjon: {
                forklaring: 'Forsikringen er innvilget, men ikke betalt ennå',
                folketrygdlovenreferanse: null,
            },
            lagtTilGrunn: false,
        },
    ],
    vurdertTidspunkt: '2021-02-03T12:34:56.789101112Z',
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
        expect(screen.getByText('Opplysninger hentet og vurdert 03.02.2021 kl. 13.34')).toBeVisible();
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

    it('viser at det ikke finnes kollektive forsikringer', async () => {
        render(
            <ForsikringDialog
                forsikringsvurdering={forsikringsvurdering}
                skjæringstidspunkt="2026-08-01"
                trigger={<Button>Se vurdering</Button>}
            />,
        );

        await userEvent.click(screen.getByRole('button', { name: 'Se vurdering' }));

        expect(await screen.findByRole('heading', { name: 'Kollektive forsikringer' })).toBeVisible();
        expect(screen.getByRole('heading', { name: 'Nav-kjøpte forsikringer' })).toBeVisible();
        expect(screen.getByText('Ingen kollektive forsikringer')).toBeVisible();
        expect(screen.queryByText(/Merk: Kollektive forsikringer er utledet av søknadstypen/)).not.toBeInTheDocument();
    });

    it('viser kollektiv forsikring med merknad', async () => {
        render(
            <ForsikringDialog
                forsikringsvurdering={{
                    ...forsikringsvurdering,
                    kollektivForsikring: {
                        navn: 'Kollektiv forsikring',
                        dekningFolketrygdlovenreferanse: {
                            kapittel: 8,
                            paragrafIKapittel: 36,
                            ledd: 1,
                            bokstav: 'b',
                        },
                        kollektivFolketrygdlovenreferanse: {
                            kapittel: 8,
                            paragrafIKapittel: 39,
                            ledd: null,
                            bokstav: null,
                        },
                    },
                }}
                skjæringstidspunkt="2026-08-01"
                trigger={<Button>Se vurdering</Button>}
            />,
        );

        await userEvent.click(screen.getByRole('button', { name: 'Se vurdering' }));

        expect(await screen.findByRole('cell', { name: /Kollektiv forsikring/ })).toBeVisible();
        expect(
            screen.getByText(
                'Merk: Kollektive forsikringer er utledet av søknadstypen, dette må ikke tolkes som en bekreftelse på at bruker har denne forsikringen.',
            ),
        ).toBeVisible();
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
