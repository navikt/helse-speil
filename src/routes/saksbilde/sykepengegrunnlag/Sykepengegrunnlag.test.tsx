import { createStore } from 'jotai';
import { Mock, vi } from 'vitest';

import { useSkjønnsfastsettelsesMaler } from '@external/sanity';
import { useEndringerForPeriode } from '@hooks/useEndringerForPeriode';
import { ApiBeregnetPeriode } from '@io/rest/generated/spesialist.schemas';
import { useVilkårsgrunnlag } from '@saksbilde/sykepengegrunnlag/useVilkårsgrunnlag';
import { PersonStoreContext } from '@state/contexts/personStore';
import { useActivePeriod } from '@state/periode';
import { useFetchPersonQuery } from '@state/person';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enArbeidsgiverinntekt } from '@test-data/arbeidsgiverinntekt';
import { enBehandling } from '@test-data/behandling';
import { enBeregnetPeriode } from '@test-data/periode';
import { enPerson } from '@test-data/person';
import { tilleggsinfoFraEnInntektskilde } from '@test-data/tilleggsinfoFraInntektskilde';
import { etVilkårsgrunnlagFraSpleis } from '@test-data/vilkårsgrunnlag';
import { render, screen } from '@test-utils';

import { Sykepengegrunnlag } from './Sykepengegrunnlag';

vi.mock('@external/sanity');
vi.mock('@state/periode');
vi.mock('@saksbilde/sykepengegrunnlag/useVilkårsgrunnlag');
vi.mock('@state/toggles');
vi.mock('@state/person');
vi.mock('@hooks/useEndringerForPeriode');

describe('Sykepengegrunnlag', () => {
    const vilkårsgrunnlag = etVilkårsgrunnlagFraSpleis({ skjaeringstidspunkt: '2020-01-01' });
    const periodeHosSnill = enBeregnetPeriode({ vilkarsgrunnlagId: vilkårsgrunnlag.id });
    const periodeHosFrisør = enBeregnetPeriode({ vilkarsgrunnlagId: vilkårsgrunnlag.id });
    const snill = enArbeidsgiver({
        organisasjonsnummer: '967170232',
        navn: 'Snill Torpedo',
        behandlinger: [enBehandling({ perioder: [periodeHosSnill] })],
    });
    const frisør = enArbeidsgiver({
        organisasjonsnummer: '839942907',
        navn: 'Hårreisende Frisør',
        behandlinger: [enBehandling({ perioder: [periodeHosFrisør] })],
    });
    const person = enPerson()
        .medArbeidsgivere([snill, frisør])
        .medTilleggsinfoForInntektskilder([
            tilleggsinfoFraEnInntektskilde({ navn: snill.navn, orgnummer: snill.organisasjonsnummer }),
            tilleggsinfoFraEnInntektskilde({ navn: frisør.navn, orgnummer: frisør.organisasjonsnummer }),
        ]);
    const vilkårsgrunnlagMedInntekter = vilkårsgrunnlag.medInntekter([
        enArbeidsgiverinntekt({ arbeidsgiver: snill.organisasjonsnummer }).medInntektFraAOrdningen(),
        enArbeidsgiverinntekt({ arbeidsgiver: frisør.organisasjonsnummer }).medInntektFraAOrdningen(),
    ]);

    beforeEach(() => {
        (useSkjønnsfastsettelsesMaler as Mock).mockReturnValue({ maler: [], loading: false });
        (useFetchPersonQuery as Mock).mockReturnValue({ data: person });
        (useVilkårsgrunnlag as Mock).mockReturnValue(vilkårsgrunnlagMedInntekter);
        (useEndringerForPeriode as Mock).mockReturnValue({
            inntektsendringer: [],
            arbeidsforholdendringer: [],
            dagendringer: [],
            skjønnsfastsettingsendringer: [],
        });
    });

    afterEach(() => vi.clearAllMocks());

    it('viser arbeidsgiveren til den valgte perioden når saksbehandler velger en periode hos en annen arbeidsgiver i samme sykefraværstilfelle', () => {
        const store = createStore();
        (useActivePeriod as Mock).mockReturnValue(periodeHosSnill);
        const { rerender } = render(<SykepengegrunnlagMedStore store={store} periode={periodeHosSnill} />);
        expect(screen.getAllByText(snill.navn)).toHaveLength(2);

        (useActivePeriod as Mock).mockReturnValue(periodeHosFrisør);
        rerender(<SykepengegrunnlagMedStore store={store} periode={periodeHosFrisør} />);

        expect(screen.getAllByText(frisør.navn)).toHaveLength(2);
        expect(screen.getAllByText(snill.navn)).toHaveLength(1);
    });

    function SykepengegrunnlagMedStore({
        store,
        periode,
    }: {
        store: ReturnType<typeof createStore>;
        periode: ApiBeregnetPeriode;
    }) {
        return (
            <PersonStoreContext.Provider value={store}>
                <Sykepengegrunnlag person={person} periode={periode} />
            </PersonStoreContext.Provider>
        );
    }
});
