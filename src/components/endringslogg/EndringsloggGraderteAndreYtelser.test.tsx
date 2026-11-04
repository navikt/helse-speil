import { ApiGraderteAndreYtelserEndretDag } from '@io/rest/generated/andre-ytelser/andre-ytelser.schemas';
import { GraderteAndreYtelserEndring } from '@saksbilde/utbetaling/utbetalingstabell/graderteAndreYtelserEndringer';
import { render, screen, within } from '@test-utils';

import { EndringsloggGraderteAndreYtelser } from './EndringsloggGraderteAndreYtelser';

describe('EndringsloggGraderteAndreYtelser', () => {
    it('viser den første fordelingen av en dag uten fra-verdier', () => {
        render(<EndringsloggGraderteAndreYtelser endringer={[enEndring()]} onOpenChange={vi.fn()} />);

        const [rad] = dataRader();
        expect(within(rad!).getByText('Foreldrepenger 40 %')).toBeVisible();
        expect(within(rad!).getByText('50 %')).toBeVisible();
        expect(within(rad!).getByText('10 %')).toBeVisible();
        expect(within(rad!).getByText('Et notat')).toBeVisible();
        expect(within(rad!).getByText('A123456')).toHaveAttribute('data-sensitive');
        expect(rad!.querySelector('.line-through')).toBeNull();
    });

    it('viser flere endringer av samme dag med nyeste først og fra-verdiene overstrøket', () => {
        const første = enEndring();
        const andre = enEndring({
            tidspunkt: '2024-02-02T10:00:00',
            notatTilBeslutter: 'Et nytt notat',
            dag: {
                andreYtelserGrader: { FORELDREPENGER: 20, OMSORGSPENGER: 10 },
                sykdomsgrad: 60,
                arbeidsgrad: 10,
                fraAndreYtelserGrader: { FORELDREPENGER: 40 },
                fraSykdomsgrad: 50,
                fraArbeidsgrad: 10,
            },
        });

        render(<EndringsloggGraderteAndreYtelser endringer={[første, andre]} onOpenChange={vi.fn()} />);

        const [nyeste, eldste] = dataRader();
        expect(within(nyeste!).getByText('Et nytt notat')).toBeVisible();
        expect(within(nyeste!).getByText('Foreldrepenger 40 %')).toHaveClass('line-through');
        expect(within(nyeste!).getByText(/Foreldrepenger 20 %, Omsorgspenger 10 %/)).toBeVisible();
        expect(within(nyeste!).getByText('50 %')).toHaveClass('line-through');
        expect(within(nyeste!).queryAllByText('10 %')).toHaveLength(1);
        expect(within(eldste!).getByText('Et notat')).toBeVisible();
    });

    it('viser at ytelsene er fjernet fra dagen', () => {
        const fjernet = enEndring({
            dag: {
                andreYtelserGrader: {},
                sykdomsgrad: 90,
                arbeidsgrad: 10,
                fraAndreYtelserGrader: { FORELDREPENGER: 40 },
                fraSykdomsgrad: 50,
                fraArbeidsgrad: 10,
            },
        });

        render(<EndringsloggGraderteAndreYtelser endringer={[fjernet]} onOpenChange={vi.fn()} />);

        const [rad] = dataRader();
        expect(within(rad!).getByText('Foreldrepenger 40 %')).toHaveClass('line-through');
        expect(within(rad!).getByText(/Ingen/)).toBeVisible();
    });
});

function dataRader(): HTMLElement[] {
    return within(screen.getByRole('dialog')).getAllByRole('row').slice(1);
}

function enEndring({
    dag,
    ...overrides
}: Partial<Omit<GraderteAndreYtelserEndring, 'dag'>> & {
    dag?: Partial<ApiGraderteAndreYtelserEndretDag>;
} = {}): GraderteAndreYtelserEndring {
    return {
        tidspunkt: '2024-02-01T10:00:00',
        saksbehandlerIdent: 'A123456',
        notatTilBeslutter: 'Et notat',
        dag: {
            dato: '2024-01-01',
            andreYtelserGrader: { FORELDREPENGER: 40 },
            sykdomsgrad: 50,
            arbeidsgrad: 10,
            sykdomsgradFørFordeling: 90,
            fraAndreYtelserGrader: null,
            fraSykdomsgrad: null,
            fraArbeidsgrad: null,
            fraSykdomsgradFørFordeling: null,
            ...dag,
        },
        ...overrides,
    };
}
