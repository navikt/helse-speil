import React from 'react';

import { useOrganisasjonQuery } from '@external/sparkel-aareg/useOrganisasjonQuery';
import { ApiArbeidsforhold, ApiArbeidsforholdtype } from '@io/rest/generated/vilkarsproving.schemas';
import { render, screen, within } from '@test-utils';
import userEvent from '@testing-library/user-event';

import { ArbeidsforholdIGrunnlaget } from './ArbeidsforholdIGrunnlaget';

vi.mock('@external/sparkel-aareg/useOrganisasjonQuery', { spy: true });

describe('ArbeidsforholdIGrunnlaget', () => {
    it('sorterer løpende først, deretter nyeste tom og nyeste fom', async () => {
        render(
            <ArbeidsforholdIGrunnlaget
                arbeidsforhold={[
                    etArbeidsforhold('2020-01-01', '2022-12-31'),
                    etArbeidsforhold('2021-01-01', '2023-12-31'),
                    etArbeidsforhold('2019-01-01', null),
                    etArbeidsforhold('2022-06-01', '2023-12-31'),
                    etArbeidsforhold('2023-01-01', undefined),
                ]}
            />,
        );

        await userEvent.click(screen.getByRole('button', { name: /Arbeidsforhold i grunnlaget/ }));

        const perioder = within(screen.getByRole('table'))
            .getAllByRole('row')
            .slice(1)
            .map((rad) => within(rad).getAllByRole('cell')[2]?.textContent);

        expect(perioder).toEqual([
            '01.01.2023 – løpende',
            '01.01.2019 – løpende',
            '01.06.2022 – 31.12.2023',
            '01.01.2021 – 31.12.2023',
            '01.01.2020 – 31.12.2022',
        ]);
    });

    it('viser UKJENT_PRIVAT som arbeidsgiver uten å slå opp organisasjonsnavn', async () => {
        render(
            <ArbeidsforholdIGrunnlaget
                arbeidsforhold={[{ ...etArbeidsforhold('2020-01-01', null), organisasjonsnummer: 'UKJENT_PRIVAT' }]}
            />,
        );

        await userEvent.click(screen.getByRole('button', { name: /Arbeidsforhold i grunnlaget/ }));

        const celler = within(within(screen.getByRole('table')).getAllByRole('row')[1]!).getAllByRole('cell');
        expect(celler[0]?.textContent).toBe('UKJENT_PRIVAT');
        expect(celler[1]?.textContent).toBe('UKJENT_PRIVAT');
        expect(useOrganisasjonQuery).not.toHaveBeenCalledWith('UKJENT_PRIVAT');
    });

    it('viser 11-sifret arbeidsgivernummer uten å slå opp organisasjonsnavn', async () => {
        render(
            <ArbeidsforholdIGrunnlaget
                arbeidsforhold={[{ ...etArbeidsforhold('2020-01-01', null), organisasjonsnummer: '12345678901' }]}
            />,
        );

        await userEvent.click(screen.getByRole('button', { name: /Arbeidsforhold i grunnlaget/ }));

        const celler = within(within(screen.getByRole('table')).getAllByRole('row')[1]!).getAllByRole('cell');
        expect(celler[0]?.textContent).toBe('12345678901');
        expect(celler[1]?.textContent).toBe('12345678901');
        expect(useOrganisasjonQuery).not.toHaveBeenCalledWith('12345678901');
    });
});

function etArbeidsforhold(fom: string, tom: string | null | undefined): ApiArbeidsforhold {
    return { organisasjonsnummer: '123456789', fom, tom, type: ApiArbeidsforholdtype.ORDINÆRT };
}
