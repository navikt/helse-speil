import { createStore } from 'jotai';
import { Mock, vi } from 'vitest';

import { useSkjønnsfastsettelsesMaler } from '@external/sanity';
import { useEndringerForPeriode } from '@hooks/useEndringerForPeriode';
import { ApiBeregnetPeriode, ApiPeriodetilstand } from '@io/rest/generated/spesialist.schemas';
import { useVilkårsgrunnlag } from '@saksbilde/sykepengegrunnlag/useVilkårsgrunnlag';
import { PersonStoreContext } from '@state/contexts/personStore';
import { useActivePeriod } from '@state/periode';
import { useFetchPersonQuery } from '@state/person';
import { useNyttSaksbildeoppsett } from '@state/toggles';
import { useTotrinnsvurdering } from '@state/totrinnsvurdering';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enArbeidsgiverinntekt } from '@test-data/arbeidsgiverinntekt';
import { enBehandling } from '@test-data/behandling';
import { enBeregnetPeriode, enUberegnetPeriode } from '@test-data/periode';
import { enPerson } from '@test-data/person';
import { tilleggsinfoFraEnInntektskilde } from '@test-data/tilleggsinfoFraInntektskilde';
import { enTotrinnsvurdering } from '@test-data/totrinnsvurdering';
import { etVilkårsgrunnlagFraSpleis } from '@test-data/vilkårsgrunnlag';
import { render, screen } from '@test-utils';

import { Sykepengegrunnlag } from './Sykepengegrunnlag';

vi.mock('@external/sanity');
vi.mock('@state/periode');
vi.mock('@saksbilde/sykepengegrunnlag/useVilkårsgrunnlag');
vi.mock('@state/toggles');
vi.mock('@state/person');
vi.mock('@hooks/useEndringerForPeriode');
vi.mock('@state/totrinnsvurdering', async (importOriginal) => ({
    ...(await importOriginal<typeof import('@state/totrinnsvurdering')>()),
    useTotrinnsvurdering: vi.fn(),
}));

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

    describe('redigering', () => {
        const periodeTilGodkjenning = enBeregnetPeriode({
            vilkarsgrunnlagId: vilkårsgrunnlag.id,
            fom: '2020-01-01',
            tom: '2020-01-31',
        }).somErTilGodkjenning();
        const periodeEtterPeriodenTilGodkjenning = enBeregnetPeriode({
            vilkarsgrunnlagId: vilkårsgrunnlag.id,
            fom: '2020-02-01',
            tom: '2020-02-29',
        });
        const uberegnetPeriode = enUberegnetPeriode({ fom: '2020-03-01', tom: '2020-03-31' });
        const annullertPeriode = enBeregnetPeriode({
            vilkarsgrunnlagId: null,
            periodetilstand: ApiPeriodetilstand.Annullert,
            fom: '2020-04-01',
            tom: '2020-04-30',
        });
        const personMedFlerePerioder = enPerson()
            .medArbeidsgivere([
                enArbeidsgiver({
                    organisasjonsnummer: snill.organisasjonsnummer,
                    navn: snill.navn,
                    behandlinger: [
                        enBehandling({
                            perioder: [annullertPeriode, periodeEtterPeriodenTilGodkjenning, periodeTilGodkjenning],
                        }),
                        enBehandling({
                            perioder: [
                                enBeregnetPeriode({
                                    vedtaksperiodeId: annullertPeriode.vedtaksperiodeId,
                                    vilkarsgrunnlagId: vilkårsgrunnlag.id,
                                    fom: '2020-04-01',
                                    tom: '2020-04-30',
                                }),
                            ],
                        }),
                    ],
                }),
                // Den uberegnede perioden ligger hos en annen arbeidsgiver, så knappen kan ikke hente noe fra den valgte perioden
                enArbeidsgiver({
                    organisasjonsnummer: '987654321',
                    behandlinger: [enBehandling({ perioder: [uberegnetPeriode] })],
                }),
            ])
            .medTilleggsinfoForInntektskilder([
                tilleggsinfoFraEnInntektskilde({ navn: snill.navn, orgnummer: snill.organisasjonsnummer }),
            ]);
        const valgbarePerioder = [
            { periodetype: 'beregnet', valgtPeriode: periodeEtterPeriodenTilGodkjenning },
            { periodetype: 'uberegnet', valgtPeriode: uberegnetPeriode },
            { periodetype: 'annullert', valgtPeriode: annullertPeriode },
        ];

        beforeEach(() => {
            (useFetchPersonQuery as Mock).mockReturnValue({ data: personMedFlerePerioder });
            (useVilkårsgrunnlag as Mock).mockReturnValue(
                vilkårsgrunnlag.medInntekter([
                    enArbeidsgiverinntekt({ arbeidsgiver: snill.organisasjonsnummer }).medInntektFraAOrdningen(),
                ]),
            );
        });

        describe('med toggelen på', () => {
            beforeEach(() => (useNyttSaksbildeoppsett as Mock).mockReturnValue(true));

            it.each(valgbarePerioder)('vises når den valgte perioden er $periodetype', ({ valgtPeriode }) => {
                (useActivePeriod as Mock).mockReturnValue(valgtPeriode);
                visSykepengegrunnlag(periodeTilGodkjenning);

                expect(screen.getByRole('button', { name: 'Revurder' })).toBeInTheDocument();
            });

            it.each(valgbarePerioder)(
                'skjules når totrinnsvurderingen venter på beslutter og den valgte perioden er $periodetype',
                ({ valgtPeriode }) => {
                    (useTotrinnsvurdering as Mock).mockReturnValue(enTotrinnsvurdering({ erBeslutteroppgave: true }));
                    (useActivePeriod as Mock).mockReturnValue(valgtPeriode);
                    visSykepengegrunnlag(periodeTilGodkjenning);

                    expect(screen.getByRole('button', { name: 'Perioden kan ikke overstyres' })).toBeInTheDocument();
                    expect(screen.queryByRole('button', { name: /Endre|Revurder/ })).not.toBeInTheDocument();
                },
            );
        });

        describe('med toggelen av', () => {
            beforeEach(() => (useNyttSaksbildeoppsett as Mock).mockReturnValue(false));

            it('skjules når den valgte perioden ligger etter perioden til godkjenning, som i dag', () => {
                (useActivePeriod as Mock).mockReturnValue(periodeEtterPeriodenTilGodkjenning);
                visSykepengegrunnlag(periodeEtterPeriodenTilGodkjenning);

                expect(screen.getByRole('button', { name: 'Perioden kan ikke overstyres' })).toBeInTheDocument();
                expect(screen.queryByRole('button', { name: /Endre|Revurder/ })).not.toBeInTheDocument();
            });
        });

        function visSykepengegrunnlag(periode: ApiBeregnetPeriode) {
            render(
                <PersonStoreContext.Provider value={createStore()}>
                    <Sykepengegrunnlag person={personMedFlerePerioder} periode={periode} />
                </PersonStoreContext.Provider>,
            );
        }
    });
});
