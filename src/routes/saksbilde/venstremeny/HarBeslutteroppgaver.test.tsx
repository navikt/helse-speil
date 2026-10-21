import React from 'react';
import { Mock, vi } from 'vitest';

import { ApiHandlingType, ApiSaksbehandlerhandling } from '@io/rest/generated/spesialist.schemas';
import { HarBeslutteroppgaver } from '@saksbilde/venstremeny/HarBeslutteroppgaver';
import { useHentSaksbehandlerhandlinger } from '@state/saksbehandlerhandlinger';
import { useHentTilkommenInntektQuery } from '@state/tilkommenInntekt';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enBeregnetPeriode } from '@test-data/periode';
import { enPerson } from '@test-data/person';
import { render, screen } from '@test-utils';

vi.mock('@state/tilkommenInntekt');
vi.mock('@state/saksbehandlerhandlinger', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@state/saksbehandlerhandlinger')>()),
    useHentSaksbehandlerhandlinger: vi.fn(),
}));

describe('HarBeslutteroppgaver', () => {
    const tidligerePeriode = enBeregnetPeriode({
        fom: '2024-01-01',
        tom: '2024-01-31',
        skjaeringstidspunkt: '2024-01-01',
    });
    const periodeTilGodkjenning = enBeregnetPeriode({
        fom: '2024-02-01',
        tom: '2024-02-29',
        skjaeringstidspunkt: '2024-01-01',
        totrinnsvurdering: {
            erBeslutteroppgave: true,
            erRetur: false,
            saksbehandler: null,
            beslutter: null,
        },
    }).somErTilGodkjenning();
    const person = enPerson().medArbeidsgivere([
        enArbeidsgiver().medPerioder([periodeTilGodkjenning, tidligerePeriode]),
    ]);

    beforeEach(() => {
        (useHentTilkommenInntektQuery as Mock).mockReturnValue({ data: [] });
    });

    it('viser bare perioden til godkjenning for handling med skjæringstidspunkt', () => {
        medHandlinger({ skjæringstidspunkt: '2024-01-01', behandlingId: null });

        render(<HarBeslutteroppgaver person={person} />);

        expect(screen.getByRole('button', { name: '01.02.2024 – 29.02.2024' })).toBeVisible();
        expect(screen.queryByRole('button', { name: '01.01.2024 – 31.01.2024' })).not.toBeInTheDocument();
    });

    it('viser perioden med behandlingen for handling med behandlingId', () => {
        medHandlinger({ skjæringstidspunkt: '2024-01-01', behandlingId: tidligerePeriode.behandlingId });

        render(<HarBeslutteroppgaver person={person} />);

        expect(screen.getByRole('button', { name: '01.01.2024 – 31.01.2024' })).toBeVisible();
        expect(screen.queryByRole('button', { name: '01.02.2024 – 29.02.2024' })).not.toBeInTheDocument();
    });
});

function medHandlinger(overrides: Partial<ApiSaksbehandlerhandling>) {
    const handling: ApiSaksbehandlerhandling = {
        handlingId: 'handling-1',
        handlingType: ApiHandlingType.MANUELT_VURDERT_OPPTJENING,
        saksbehandlerIdent: 'S123456',
        tidspunkt: '2024-02-10T10:00:00.000',
        erDelAvAktivTotrinnsvurdering: true,
        ...overrides,
    };
    (useHentSaksbehandlerhandlinger as Mock).mockReturnValue({ data: [handling] });
}
