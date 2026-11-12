import {
    ApiDag,
    ApiDagoverstyring,
    ApiDagtype,
    ApiKildetype,
    ApiLøpendeVilkår,
    ApiSykdomsdagtype,
    ApiUtbetalingsdagtype,
    ApiUtfallAvLøpendeVilkår,
} from '@io/rest/generated/spesialist.schemas';
import { renderHook } from '@testing-library/react';
import { DateString } from '@typer/shared';

import { antallSykedagerTilOgMedMaksdato, createDagerMap, useTabelldagerMap } from './useTabelldagerMap';

const getDag = (dato: DateString, overrides?: Partial<ApiDag>): ApiDag => ({
    dato: dato,
    kilde: { id: 'en-id', type: ApiKildetype.INNTEKTSMELDING },
    sykdomsdagtype: ApiSykdomsdagtype.SYKEDAG,
    utbetalingsdagtype: ApiUtbetalingsdagtype.NAVDAG,
    begrunnelser: null,
    vurderingerAvLøpendeVilkår: [],
    grad: null,
    utbetalingsinfo: null,
    ...overrides,
});

const dager: ApiDag[] = [
    getDag('2021-01-01'),
    getDag('2021-01-02', { utbetalingsdagtype: ApiUtbetalingsdagtype.AVVIST_DAG }),
    getDag('2021-01-03'),
    getDag('2021-01-04', { utbetalingsdagtype: ApiUtbetalingsdagtype.HELGEDAG }),
    getDag('2021-01-05', { utbetalingsdagtype: ApiUtbetalingsdagtype.HELGEDAG }),
    getDag('2021-01-06'),
    getDag('2021-01-07'),
    getDag('2021-01-08'),
    getDag('2021-01-09'),
    getDag('2021-01-10'),
    getDag('2021-01-11'),
    getDag('2021-01-12'),
    getDag('2021-01-13'),
];

describe('createDagerMap', () => {
    it('mapper ut riktig antall dager igjen', () => {
        const dagerMap = createDagerMap(dager, false, 6);
        const utbetalingsdager = Array.from(dagerMap.values()).map((it) => it.dagerIgjen);
        expect(utbetalingsdager).toEqual([5, 5, 4, 4, 4, 3, 2, 1, 0, 0, 0, 0, 0]);
    });
});

describe('antallSykedagerTilOgMedMaksdato', () => {
    it('returnerer antall sykedager t.o.m. maksdato', () => {
        expect(antallSykedagerTilOgMedMaksdato(dager, '2021-01-11')).toEqual(8);
        expect(antallSykedagerTilOgMedMaksdato(dager, '2021-01-04')).toEqual(2);
        expect(antallSykedagerTilOgMedMaksdato(dager, '2021-01-31')).toEqual(10);
        expect(antallSykedagerTilOgMedMaksdato(dager, '2020-01-01')).toEqual(0);
    });
});

describe('useTabelldagerMap', () => {
    it('returnerer et map med utbetalingsdager', () => {
        const { result } = renderHook(() =>
            useTabelldagerMap({
                tidslinje: dager,
                erSelvstendigNæringsdrivende: false,
                gjenståendeDager: 100,
            }),
        );

        expect(result.current.get('2021-01-01')?.dag.speilDagtype).toEqual('Syk');
        expect(result.current.get('2021-01-02')?.dag.speilDagtype).toEqual('Avslått');
        expect(result.current.get('2021-01-08')?.dag.speilDagtype).toEqual('Syk');
    });

    it('mapper overstyringer', () => {
        const overstyringer: ApiDagoverstyring[] = [
            {
                type: 'ApiDagoverstyring',
                vedtaksperiodeId: '',
                hendelseId: 'en-id',
                timestamp: '2020-01-01',
                begrunnelse: 'Fordi',
                dager: [
                    {
                        dato: '2021-01-02',
                        type: ApiDagtype.Sykedag,
                        grad: 80,
                        fraGrad: null,
                        fraType: null,
                    },
                ],
                saksbehandler: {
                    navn: 'et-navn',
                    ident: 'en-ident',
                },
                ferdigstilt: false,
                organisasjonsnummer: '987654321',
            },
        ];

        const { result } = renderHook(() =>
            useTabelldagerMap({
                tidslinje: dager,
                erSelvstendigNæringsdrivende: false,
                overstyringer: overstyringer,
                gjenståendeDager: 100,
            }),
        );

        expect(result.current.get('2021-01-01')?.overstyringer).toBeUndefined();
        expect(result.current.get('2021-01-02')?.overstyringer?.[0]?.begrunnelse).toEqual('Fordi');
        expect(result.current.get('2021-01-02')?.overstyringer?.[0]?.saksbehandler.ident).toEqual('en-ident');
        expect(result.current.get('2021-01-02')?.overstyringer?.[0]?.saksbehandler.navn).toEqual('et-navn');
    });

    it('mapper vurderinger av løpende vilkår', () => {
        const vurdering = {
            vilkår: ApiLøpendeVilkår.OPPHOLDSKRAV,
            vurderingId: 'en-vurdering',
            utfall: ApiUtfallAvLøpendeVilkår.OPPFYLT,
        };
        const { result } = renderHook(() =>
            useTabelldagerMap({
                tidslinje: [getDag('2021-01-01', { vurderingerAvLøpendeVilkår: [vurdering] }), getDag('2021-01-02')],
                erSelvstendigNæringsdrivende: false,
                gjenståendeDager: 100,
            }),
        );

        expect(result.current.get('2021-01-01')?.vurderingerAvLøpendeVilkår).toEqual([vurdering]);
        expect(result.current.get('2021-01-02')?.vurderingerAvLøpendeVilkår).toEqual([]);
    });

    describe('Syk utenfor EØS', () => {
        it('vises som Utenfor EØS før oppholdskravet er vurdert', () => {
            expect(tabelldag({})).toEqual(
                expect.objectContaining({ speilDagtype: 'UtenforEøs', visningstekst: 'Utenfor EØS' }),
            );
        });

        it('vises som Utenfor EØS også i helgen før oppholdskravet er vurdert', () => {
            expect(tabelldag({ utbetalingsdagtype: ApiUtbetalingsdagtype.NAVHELGDAG })?.speilDagtype).toEqual(
                'UtenforEøs',
            );
        });

        it('vises som Syk når oppholdskravet er oppfylt', () => {
            expect(
                tabelldag({ vurderingerAvLøpendeVilkår: [vurdering(ApiUtfallAvLøpendeVilkår.OPPFYLT)] })?.speilDagtype,
            ).toEqual('Syk');
        });

        it('vises som Syk (Avslått) når oppholdskravet ikke er oppfylt', () => {
            expect(
                tabelldag({
                    utbetalingsdagtype: ApiUtbetalingsdagtype.AVVIST_DAG,
                    vurderingerAvLøpendeVilkår: [vurdering(ApiUtfallAvLøpendeVilkår.IKKE_OPPFYLT)],
                }),
            ).toEqual(expect.objectContaining({ speilDagtype: 'Avslått', visningstekst: 'Syk' }));
        });

        it('vises som Helg i arbeidsgiverperioden når oppholdskravet er vurdert', () => {
            expect(
                tabelldag(
                    {
                        utbetalingsdagtype: ApiUtbetalingsdagtype.ARBEIDSGIVERPERIODEDAG,
                        vurderingerAvLøpendeVilkår: [vurdering(ApiUtfallAvLøpendeVilkår.OPPFYLT)],
                    },
                    lørdag,
                )?.speilDagtype,
            ).toEqual('SykHelg');
        });

        it('vises som Helg (Avslått) når oppholdskravet ikke er oppfylt for en helgedag', () => {
            expect(
                tabelldag(
                    {
                        utbetalingsdagtype: ApiUtbetalingsdagtype.AVVIST_DAG,
                        vurderingerAvLøpendeVilkår: [vurdering(ApiUtfallAvLøpendeVilkår.IKKE_OPPFYLT)],
                    },
                    lørdag,
                ),
            ).toEqual(expect.objectContaining({ speilDagtype: 'Avslått', visningstekst: 'Helg' }));
        });

        const mandag = '2021-01-04';
        const lørdag = '2021-01-09';

        function vurdering(utfall: ApiUtfallAvLøpendeVilkår) {
            return { vilkår: ApiLøpendeVilkår.OPPHOLDSKRAV, vurderingId: 'en-vurdering', utfall };
        }

        function tabelldag(overrides: Partial<ApiDag>, dato: DateString = mandag) {
            const { result } = renderHook(() =>
                useTabelldagerMap({
                    tidslinje: [getDag(dato, { sykdomsdagtype: ApiSykdomsdagtype.SYK_UTENFOR_EOS, ...overrides })],
                    erSelvstendigNæringsdrivende: false,
                    gjenståendeDager: 100,
                }),
            );
            return result.current.get(dato)?.dag;
        }
    });
});
