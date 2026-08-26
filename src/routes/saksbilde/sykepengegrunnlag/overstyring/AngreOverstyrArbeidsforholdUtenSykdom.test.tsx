import { vi } from 'vitest';

import { AngreOverstyrArbeidsforholdUtenSykdom } from '@saksbilde/sykepengegrunnlag/overstyring/AngreOverstyrArbeidsforholdUtenSykdom';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enBeregnetPeriode } from '@test-data/periode';
import { enPerson } from '@test-data/person';
import { render, screen } from '@test-utils';

vi.mock('@io/sse/useAbonnerPåEndringer', () => ({
    useAbonnerPåEndringer: vi.fn(),
}));

const mockUseHarSkrivetilgang = vi.fn();

vi.mock('@hooks/brukerrolleHooks', () => ({
    useHarSkrivetilgang: () => mockUseHarSkrivetilgang(),
}));

describe('AngreOverstyrArbeidsforholdUtenSykdom', () => {
    const renderKomponent = () => {
        const periode = enBeregnetPeriode();
        const arbeidsgiver = enArbeidsgiver().medPerioder([periode]);
        const person = enPerson().medArbeidsgivere([arbeidsgiver]);
        return render(
            <AngreOverstyrArbeidsforholdUtenSykdom
                person={person}
                organisasjonsnummerAktivPeriode={arbeidsgiver.organisasjonsnummer}
                skjæringstidspunkt={periode.skjaeringstidspunkt}
                onClick={vi.fn()}
            />,
        );
    };

    it('viser knappen "Bruk arbeidsforholdet i beregningen likevel" når bruker har skrivetilgang', () => {
        mockUseHarSkrivetilgang.mockReturnValue(true);
        renderKomponent();
        expect(screen.getByRole('button', { name: 'Bruk arbeidsforholdet i beregningen likevel' })).toBeInTheDocument();
    });

    it('viser ikke knappen "Bruk arbeidsforholdet i beregningen likevel" når bruker ikke har skrivetilgang', () => {
        mockUseHarSkrivetilgang.mockReturnValue(false);
        renderKomponent();
        expect(
            screen.queryByRole('button', { name: 'Bruk arbeidsforholdet i beregningen likevel' }),
        ).not.toBeInTheDocument();
    });
});
