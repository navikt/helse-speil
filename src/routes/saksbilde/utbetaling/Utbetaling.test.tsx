import { Mock, vi } from 'vitest';

import { useIsReadOnlyOppgave } from '@hooks/useIsReadOnlyOppgave';
import { ApiYrkesaktivitetstype } from '@io/rest/generated/andre-ytelser/andre-ytelser.schemas';
import { ApiBeregnetPeriode, ApiInntektstype, ApiUtbetalingsdagtype } from '@io/rest/generated/spesialist.schemas';
import { useGraderteAndreYtelser } from '@state/graderteAndreYtelser';
import { useAktivOppgaveForPeriode } from '@state/oppgave';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enAktivOppgave } from '@test-data/oppgave';
import { enBeregnetPeriode, enDag } from '@test-data/periode';
import { enPerson } from '@test-data/person';
import { enUtbetaling } from '@test-data/utbetaling';
import { render } from '@test-utils';
import { screen, within } from '@testing-library/react';
import { useSkalSeGraderteAndreYtelser } from '@utils/featureToggles';
import { generateId } from '@utils/generateId';

import { Utbetaling } from './Utbetaling';

vi.mock('@state/oppgave', async () => ({
    ...(await vi.importActual('@state/oppgave')),
    useAktivOppgaveForPeriode: vi.fn(),
}));

vi.mock('@utils/featureToggles', () => ({
    useSkalSeGraderteAndreYtelser: vi.fn(),
}));
vi.mock('@state/graderteAndreYtelser', () => ({
    useGraderteAndreYtelser: vi.fn(),
}));
vi.mock('@hooks/useIsReadOnlyOppgave', () => ({
    useIsReadOnlyOppgave: vi.fn(),
}));
vi.mock('@hooks/brukerrolleHooks', () => ({
    useHarSkrivetilgang: () => true,
    useHarBeslutterrolle: () => true,
}));

describe('Utbetaling', () => {
    beforeEach(() => {
        (useAktivOppgaveForPeriode as Mock).mockImplementation((periode?: ApiBeregnetPeriode | null) =>
            periode ? enAktivOppgave({ id: '1234', vedtaksperiodeId: periode.vedtaksperiodeId }) : null,
        );
        (useSkalSeGraderteAndreYtelser as Mock).mockReturnValue(false);
        (useGraderteAndreYtelser as Mock).mockReturnValue([]);
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    it('rendrer revurderbar utbetaling', () => {
        const tidslinje = [enDag({ dato: '2020-01-01' }), enDag({ dato: '2020-01-02' }), enDag({ dato: '2020-01-03' })];
        const periode = enBeregnetPeriode({ tidslinje });
        const arbeidsgiver = enArbeidsgiver().medPerioder([periode]);
        const person = enPerson().medArbeidsgivere([arbeidsgiver]);

        render(<Utbetaling person={person} periode={periode} />);

        expect(screen.getByRole('button', { name: 'Endre dagtype' })).toBeVisible();
        expect(screen.getByText('3 dager')).toBeVisible();
        expect(screen.getByText('01.01.2020')).toBeVisible();
        expect(screen.getByText('02.01.2020')).toBeVisible();
        expect(screen.getByText('03.01.2020')).toBeVisible();
        expect(screen.getAllByText('100 %')).toHaveLength(6);
        expect(screen.getAllByText('Syk')).toHaveLength(3);
    });

    it('rendrer utbetaling for forkastet periode', () => {
        const tidslinje = [enDag({ dato: '2020-01-01' })];
        const periode = enBeregnetPeriode({ tidslinje }).somErForkastet().somErTilGodkjenning();
        const arbeidsgiver = enArbeidsgiver().medPerioder([periode]);
        const person = enPerson().medArbeidsgivere([arbeidsgiver]);

        render(<Utbetaling person={person} periode={periode} />);

        expect(screen.getByText('Kan ikke revurdere perioden på grunn av manglende datagrunnlag')).toBeVisible();
    });

    it('rendrer utbetaling for periode med kun AGP', () => {
        const tidslinje = [
            enDag({ dato: '2020-01-01', utbetalingsdagtype: ApiUtbetalingsdagtype.ARBEIDSGIVERPERIODEDAG }),
        ];
        const periode = enBeregnetPeriode({ tidslinje }).somErTilGodkjenning();
        const arbeidsgiver = enArbeidsgiver().medPerioder([periode]);
        const person = enPerson().medArbeidsgivere([arbeidsgiver]);

        render(<Utbetaling person={person} periode={periode} />);

        expect(screen.getByRole('button', { name: 'Endre dagtype' })).toBeVisible();
    });

    it('rendrer utbetaling for periode som har vært delvis behandlet i Infotrygd', () => {
        const periodeA = enBeregnetPeriode().somErTilGodkjenning();
        const periodeB = enBeregnetPeriode().medUtbetaling(enUtbetaling({ arbeidsgiverFagsystemId: generateId() }));
        const arbeidsgiver = enArbeidsgiver().medPerioder([periodeB, periodeA]);
        const person = enPerson().medArbeidsgivere([arbeidsgiver]);

        render(<Utbetaling person={person} periode={periodeA} />);

        expect(screen.getByRole('button', { name: 'Endre dagtype' })).toBeVisible();
    });

    it('rendrer utbetaling for periode som har et tidligere skjæringstidspunkt', () => {
        const periodeA = enBeregnetPeriode({ skjaeringstidspunkt: '2020-01-01' }).somErTilGodkjenning();
        const periodeB = enBeregnetPeriode({ skjaeringstidspunkt: '2020-02-01' });
        const arbeidsgiver = enArbeidsgiver().medPerioder([periodeB, periodeA]);
        const person = enPerson().medArbeidsgivere([arbeidsgiver]);

        render(<Utbetaling person={person} periode={periodeA} />);

        expect(screen.getByRole('button', { name: 'Endre dagtype' })).toBeVisible();
    });

    it('rendrer utbetaling for periode som ikke kan overstyres eller revurderes', () => {
        const periodeA = enBeregnetPeriode({ inntektstype: ApiInntektstype.FLEREARBEIDSGIVERE }).somErTilGodkjenning();
        const periodeB = enBeregnetPeriode({
            inntektstype: ApiInntektstype.FLEREARBEIDSGIVERE,
            fom: '2024-01-01',
            tom: '2024-01-31',
            skjaeringstidspunkt: '2024-01-01',
        });
        const arbeidsgiverA = enArbeidsgiver().medPerioder([periodeA]);
        const arbeidsgiverB = enArbeidsgiver().medPerioder([periodeB]);
        const person = enPerson().medArbeidsgivere([arbeidsgiverA, arbeidsgiverB]);

        render(<Utbetaling person={person} periode={periodeB} />);

        expect(screen.queryByText('Overstyr dager')).not.toBeInTheDocument();
    });

    it('viser fordelingen i beslutters dagoversikt', () => {
        (useSkalSeGraderteAndreYtelser as Mock).mockReturnValue(true);
        (useIsReadOnlyOppgave as Mock).mockReturnValue(true);
        const tidslinje = [enDag({ dato: '2024-01-01' }), enDag({ dato: '2024-01-02' })];
        const periode = enBeregnetPeriode({ fom: '2024-01-01', tom: '2024-01-02', tidslinje }).somErTilGodkjenning();
        const arbeidsgiver = enArbeidsgiver().medPerioder([periode]);
        const person = enPerson().medArbeidsgivere([arbeidsgiver]);
        (useGraderteAndreYtelser as Mock).mockReturnValue([
            graderteAndreYtelser(arbeidsgiver.organisasjonsnummer, { FORELDREPENGER: 40 }),
            graderteAndreYtelser('999999999', { OMSORGSPENGER: 20 }),
        ]);

        render(<Utbetaling person={person} periode={periode} />);

        expect(screen.queryByRole('button', { name: /dager$/ })).not.toBeInTheDocument();
        expect(screen.getByRole('columnheader', { name: 'Andre ytelser' })).toBeVisible();
        expect(screen.getByText('40 %')).toBeVisible();
        expect(screen.getByText('Foreldrepenger')).toBeVisible();
        expect(screen.queryByText('20 %')).not.toBeInTheDocument();
        expect(screen.queryByText('Omsorgspenger')).not.toBeInTheDocument();
    });

    it('viser en dag uten fordeling når fordelingen er fjernet', () => {
        (useSkalSeGraderteAndreYtelser as Mock).mockReturnValue(true);
        (useIsReadOnlyOppgave as Mock).mockReturnValue(true);
        const tidslinje = [enDag({ dato: '2024-01-01' })];
        const periode = enBeregnetPeriode({ fom: '2024-01-01', tom: '2024-01-01', tidslinje }).somErTilGodkjenning();
        const arbeidsgiver = enArbeidsgiver().medPerioder([periode]);
        const person = enPerson().medArbeidsgivere([arbeidsgiver]);
        (useGraderteAndreYtelser as Mock).mockReturnValue([graderteAndreYtelser(arbeidsgiver.organisasjonsnummer, {})]);

        render(<Utbetaling person={person} periode={periode} />);

        const kolonne = screen
            .getAllByRole('columnheader')
            .findIndex((header) => header.textContent === 'Andre ytelser');
        const rad = screen.getByRole('row', { name: /01\.01\.2024/ });
        expect(within(rad).getAllByRole('cell')[kolonne]).toHaveTextContent(/^-$/);
    });
});

function graderteAndreYtelser(organisasjonsnummer: string, andreYtelserGrader: Record<string, number>) {
    return {
        yrkesaktivitet: ApiYrkesaktivitetstype.ARBEIDSTAKER,
        organisasjonsnummer,
        versjon: generateId(),
        dager: [
            { dato: '2024-01-01', andreYtelserGrader, sykdomsgrad: 50, arbeidsgrad: 10, sykdomsgradFørFordeling: 90 },
        ],
        events: [],
    };
}
