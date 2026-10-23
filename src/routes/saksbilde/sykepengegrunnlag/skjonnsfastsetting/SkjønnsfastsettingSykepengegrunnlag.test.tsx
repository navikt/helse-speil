import { createStore } from 'jotai';
import React from 'react';
import { Mock, vi } from 'vitest';

import { useSkjønnsfastsettelsesMaler } from '@external/sanity';
import {
    ApiBeregnetPeriode,
    ApiGhostPeriode,
    ApiSaksbildePerson,
    ApiVilkårsgrunnlagSpleisV2,
} from '@io/rest/generated/spesialist.schemas';
import type { SkjonnsfastsettelseMalerQueryResult } from '@io/sanity/generated/sanity.types';
import { SkjønnsfastsettingSykepengegrunnlag } from '@saksbilde/sykepengegrunnlag/skjonnsfastsetting/SkjønnsfastsettingSykepengegrunnlag';
import { usePostSkjønnsfastsattSykepengegrunnlag } from '@saksbilde/sykepengegrunnlag/skjonnsfastsetting/skjønnsfastsetting';
import { PersonStoreContext } from '@state/contexts/personStore';
import { useActivePeriod } from '@state/periode';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enBehandling } from '@test-data/behandling';
import { enBeregnetPeriode, enGhostPeriode } from '@test-data/periode';
import { enPerson } from '@test-data/person';
import { etVilkårsgrunnlagFraSpleis } from '@test-data/vilkårsgrunnlag';
import { render, screen } from '@test-utils';
import userEvent from '@testing-library/user-event';

vi.mock('@external/sanity');
vi.mock('@state/periode');
vi.mock('@saksbilde/sykepengegrunnlag/skjonnsfastsetting/skjønnsfastsetting');
vi.mock('@hooks/brukerrolleHooks', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@hooks/brukerrolleHooks')>()),
    useHarSkrivetilgang: () => true,
}));

const maler: SkjonnsfastsettelseMalerQueryResult = [
    {
        _id: '1',
        iProd: true,
        arbeidsforholdMal: [],
        arsak: 'Testårsak',
        begrunnelse: 'Testbegrunnelse',
        konklusjon: 'Testkonklusjon',
        lovhjemmel: {
            _id: 'lovhjemmel-1',
            _type: 'lovhjemmel' as const,
            _createdAt: '',
            _updatedAt: '',
            _rev: '',
            ledd: 'ledd',
            lovverk: 'lovverk',
            lovverksversjon: 'lovverkversjon',
            paragraf: 'paragraf',
        },
    },
];

describe('SkjønnsfastsettingSykepengegrunnlag', () => {
    const nyestePeriode = enBeregnetPeriode();
    const tidligerePeriode = enBeregnetPeriode();
    const arbeidsgiver = enArbeidsgiver({
        behandlinger: [enBehandling({ perioder: [nyestePeriode] }), enBehandling({ perioder: [tidligerePeriode] })],
    });
    const person = enPerson({ arbeidsgivere: [arbeidsgiver] });

    beforeEach(() => {
        (useSkjønnsfastsettelsesMaler as Mock).mockReturnValue({ maler, error: null, loading: false });
        (usePostSkjønnsfastsattSykepengegrunnlag as Mock).mockReturnValue({
            isLoading: false,
            error: null,
            postSkjønnsfastsetting: vi.fn(),
        });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('viser skjønnsfastsett-knapp for periode i siste behandling', () => {
        (useActivePeriod as Mock).mockReturnValue(nyestePeriode);

        renderSkjønnsfastsetting(person, nyestePeriode);

        expect(screen.getByRole('button', { name: 'Skjønnsfastsett' })).toBeInTheDocument();
    });

    it('viser ikke skjønnsfastsett-knapp for periode i en tidligere behandling', () => {
        (useActivePeriod as Mock).mockReturnValue(tidligerePeriode);

        renderSkjønnsfastsetting(person, tidligerePeriode);

        expect(screen.queryByRole('button', { name: 'Skjønnsfastsett' })).not.toBeInTheDocument();
    });

    it('viser skjønnsfastsett-knapp for ghostperiode', () => {
        const ghostPeriode = enGhostPeriode();
        const ghostArbeidsgiver = enArbeidsgiver().medGhostPerioder([ghostPeriode]);
        const personMedGhost = enPerson({ arbeidsgivere: [ghostArbeidsgiver] });
        (useActivePeriod as Mock).mockReturnValue(ghostPeriode);

        renderSkjønnsfastsetting(personMedGhost, ghostPeriode);

        expect(screen.getByRole('button', { name: 'Skjønnsfastsett' })).toBeInTheDocument();
    });

    it('skjuler skjemaet som ble åpnet i siste behandling når man navigerer til en tidligere behandling', async () => {
        const store = createStore();
        (useActivePeriod as Mock).mockReturnValue(nyestePeriode);
        const { rerender } = renderSkjønnsfastsetting(person, nyestePeriode, store);

        await userEvent.click(screen.getByRole('button', { name: 'Skjønnsfastsett' }));
        expect(screen.getByText('Testårsak')).toBeInTheDocument();

        (useActivePeriod as Mock).mockReturnValue(tidligerePeriode);
        rerender(medSkjønnsfastsetting(person, tidligerePeriode, store));

        expect(screen.queryByText('Testårsak')).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Avbryt' })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Skjønnsfastsett' })).not.toBeInTheDocument();

        (useActivePeriod as Mock).mockReturnValue(nyestePeriode);
        rerender(medSkjønnsfastsetting(person, nyestePeriode, store));

        expect(screen.getByText('Testårsak')).toBeInTheDocument();
    });

    it('lukker skjemaet når vilkårsgrunnlaget endres', async () => {
        const store = createStore();
        (useActivePeriod as Mock).mockReturnValue(nyestePeriode);
        const { rerender } = renderSkjønnsfastsetting(person, nyestePeriode, store);

        await userEvent.click(screen.getByRole('button', { name: 'Skjønnsfastsett' }));
        expect(screen.getByText('Testårsak')).toBeInTheDocument();

        rerender(medSkjønnsfastsetting(person, nyestePeriode, store, etVilkårsgrunnlagFraSpleis()));

        expect(screen.queryByText('Testårsak')).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Skjønnsfastsett' })).toBeInTheDocument();
    });

    it('gjenbruker ikke skjemaverdier fra et tidligere vilkårsgrunnlag', async () => {
        const store = createStore();
        const nyttVilkårsgrunnlag = etVilkårsgrunnlagFraSpleis();
        (useActivePeriod as Mock).mockReturnValue(nyestePeriode);
        const { rerender } = renderSkjønnsfastsetting(person, nyestePeriode, store);

        await userEvent.click(screen.getByRole('button', { name: 'Skjønnsfastsett' }));
        await userEvent.click(screen.getByRole('radio', { name: 'Testårsak' }));
        expect(screen.queryByRole('radio', { name: 'Testårsak' })).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Endre' })).toBeInTheDocument();

        rerender(medSkjønnsfastsetting(person, nyestePeriode, store, nyttVilkårsgrunnlag));
        await userEvent.click(screen.getByRole('button', { name: 'Skjønnsfastsett' }));

        expect(screen.getByRole('radio', { name: 'Testårsak' })).not.toBeChecked();
        expect(screen.queryByRole('button', { name: 'Endre' })).not.toBeInTheDocument();
    });
});

const standardVilkårsgrunnlag = etVilkårsgrunnlagFraSpleis();

function renderSkjønnsfastsetting(
    person: ApiSaksbildePerson,
    periode: ApiBeregnetPeriode | ApiGhostPeriode,
    store = createStore(),
) {
    return render(medSkjønnsfastsetting(person, periode, store));
}

function medSkjønnsfastsetting(
    person: ApiSaksbildePerson,
    periode: ApiBeregnetPeriode | ApiGhostPeriode,
    store: ReturnType<typeof createStore>,
    vilkårsgrunnlag: ApiVilkårsgrunnlagSpleisV2 = standardVilkårsgrunnlag,
) {
    return (
        <PersonStoreContext.Provider value={store}>
            <SkjønnsfastsettingSykepengegrunnlag
                person={person}
                periode={periode}
                vilkårsgrunnlagId={vilkårsgrunnlag.id}
                sykepengegrunnlag={vilkårsgrunnlag.sykepengegrunnlag}
                sykepengegrunnlagsgrense={vilkårsgrunnlag.sykepengegrunnlagsgrense}
                omregnetÅrsinntekt={Number(vilkårsgrunnlag.avviksvurdering!.beregningsgrunnlag)}
                sammenligningsgrunnlag={Number(vilkårsgrunnlag.avviksvurdering!.sammenligningsgrunnlag)}
                skjønnsmessigFastsattÅrlig={null}
                inntekter={vilkårsgrunnlag.inntekter}
                avviksprosent={0}
                organisasjonsnummer={arbeidsgiverOrgnummer(person)}
            />
        </PersonStoreContext.Provider>
    );
}

function arbeidsgiverOrgnummer(person: ApiSaksbildePerson): string {
    return person.arbeidsgivere[0]?.organisasjonsnummer ?? '';
}
