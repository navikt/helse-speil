import { Mock, vi } from 'vitest';

import { customAxios } from '@app/axios/axiosClient';
import { VenterPåEndringProvider } from '@saksbilde/VenterPåEndringContext';
import { OverstyrArbeidsforholdUtenSykdom } from '@saksbilde/sykepengegrunnlag/overstyring/OverstyrArbeidsforholdUtenSykdom';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enBeregnetPeriode } from '@test-data/periode';
import { enPerson } from '@test-data/person';
import { render, screen } from '@test-utils';
import userEvent from '@testing-library/user-event';

vi.mock('@io/sse/useAbonnerPåEndringer', () => ({
    useAbonnerPåEndringer: vi.fn(),
}));

vi.mock('@hooks/brukerrolleHooks', () => ({
    useHarSkrivetilgang: () => true,
}));

describe('OverstyrArbeidsforholdUtenSykdom Tests', () => {
    beforeEach(() => {
        (customAxios as unknown as Mock).mockResolvedValue({ data: undefined, status: 204 });
    });

    it('skal vise ikke bruk arbeidsforholdet knap om arbeidsforholdet ikke er deaktivert og knappen ikke er trykket', () => {
        const periode = enBeregnetPeriode();
        const arbeidsgiver = enArbeidsgiver().medPerioder([periode]);
        const person = enPerson().medArbeidsgivere([arbeidsgiver]);
        render(
            <OverstyrArbeidsforholdUtenSykdom
                organisasjonsnummerAktivPeriode={arbeidsgiver.organisasjonsnummer}
                skjæringstidspunkt={periode.skjaeringstidspunkt}
                arbeidsforholdErDeaktivert={false}
                person={person}
            />,
        );
        expect(screen.getByText('Ikke bruk arbeidsforholdet i beregningen')).toBeInTheDocument();
    });

    it('skal ikke vise ikke bruk arbeidsforholdet knap om arbeidsforholdet ikke er deaktivert og arbeidsforholdet har blitt markert som ikke i bruk', async () => {
        const periode = enBeregnetPeriode();
        const arbeidsgiver = enArbeidsgiver().medPerioder([periode]);
        const person = enPerson().medArbeidsgivere([arbeidsgiver]);

        render(
            <VenterPåEndringProvider>
                <OverstyrArbeidsforholdUtenSykdom
                    organisasjonsnummerAktivPeriode={arbeidsgiver.organisasjonsnummer}
                    skjæringstidspunkt={periode.skjaeringstidspunkt}
                    arbeidsforholdErDeaktivert={false}
                    person={person}
                />
            </VenterPåEndringProvider>,
        );
        await userEvent.click(screen.getByRole('button'));
        await userEvent.click(screen.getAllByRole('radio')[0]!);
        await userEvent.type(screen.getByRole('textbox'), 'En begrunnelse');
        await userEvent.click(screen.getByRole('button', { name: 'Ferdig' }));
        expect(
            screen.queryByRole('button', { name: 'Ikke bruk arbeidsforholdet i beregningen' }),
        ).not.toBeInTheDocument();
    });

    it('skal vise angreknap om arbeidsforholdet er deaktivert og knappen ikke er trykket', () => {
        const periode = enBeregnetPeriode();
        const arbeidsgiver = enArbeidsgiver().medPerioder([periode]);
        const person = enPerson().medArbeidsgivere([arbeidsgiver]);
        render(
            <OverstyrArbeidsforholdUtenSykdom
                organisasjonsnummerAktivPeriode={arbeidsgiver.organisasjonsnummer}
                skjæringstidspunkt={periode.skjaeringstidspunkt}
                arbeidsforholdErDeaktivert={true}
                person={person}
            />,
        );
        expect(screen.getByText('Bruk arbeidsforholdet i beregningen likevel')).toBeInTheDocument();
    });

    it('skal vise ikke vise angreknap om arbeidsforholdet er deaktivert og knappen allerede er trykket', async () => {
        const periode = enBeregnetPeriode();
        const arbeidsgiver = enArbeidsgiver().medPerioder([periode]);
        const person = enPerson().medArbeidsgivere([arbeidsgiver]);
        render(
            <VenterPåEndringProvider>
                <OverstyrArbeidsforholdUtenSykdom
                    organisasjonsnummerAktivPeriode={arbeidsgiver.organisasjonsnummer}
                    skjæringstidspunkt={periode.skjaeringstidspunkt}
                    arbeidsforholdErDeaktivert={true}
                    person={person}
                />
            </VenterPåEndringProvider>,
        );

        await userEvent.click(screen.getByRole('button'));
        await userEvent.click(screen.getByRole('button', { name: 'Ja' }));

        expect(screen.queryByText('Bruk arbeidsforholdet i beregningen likevel')).not.toBeInTheDocument();
    });
});
