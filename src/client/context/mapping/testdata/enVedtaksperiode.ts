import {
    SpesialistVedtaksperiode,
    SpleisAktivitet,
    SpleisForlengelseFraInfotrygd,
    SpleisHendelsetype,
    SpleisSykdomsdag,
    SpleisSøknad,
    SpleisUtbetalingsdag,
    SpleisVedtaksperiodetilstand,
    SpleisPeriodetype,
} from '../types.external';
import { max as dayjsMax } from 'dayjs';
import { somDato } from '../vedtaksperiodemapper';
import { ISO_DATOFORMAT } from '../../../utils/date';
import { defaultUtbetalingstidslinje } from './defaultUtbetalingstidslinje';
import { defaultSykdomstidslinje } from './defaultSykdomstidslinje';
import { defaultHendelser } from './defaultHendelser';

export const enVedtaksperiode = (
    ekstraDager: SpleisSykdomsdag[] = [],
    _utbetalingstidslinje: SpleisUtbetalingsdag[] = defaultUtbetalingstidslinje,
    aktivitetslogg: SpleisAktivitet[] = []
): SpesialistVedtaksperiode => {
    const søknad = defaultHendelser.find((it) => it.type === SpleisHendelsetype.SØKNAD_NAV) as SpleisSøknad;
    const sykdomstidslinje = [...ekstraDager, ...defaultSykdomstidslinje];
    const fom = sykdomstidslinje.map((it) => it.dagen)[0];
    return {
        id: 'fa02d7a5-daf2-488c-9798-2539edd7fe3f',
        fom: fom,
        tom: dayjsMax(sykdomstidslinje.map((it) => somDato(it.dagen))).format(ISO_DATOFORMAT),
        gruppeId: 'gruppe-1',
        tilstand: SpleisVedtaksperiodetilstand.Oppgaver,
        oppgavereferanse: '3982',
        fullstendig: true,
        utbetalingsreferanse: '12345',
        utbetalingstidslinje: _utbetalingstidslinje,
        utbetalinger: {
            arbeidsgiverUtbetaling: {
                fagsystemId: '81549300',
                linjer: [
                    {
                        fom: '2019-09-26',
                        tom: '2019-09-30',
                        dagsats: 1431,
                        grad: 100,
                    },
                ],
            },
            personUtbetaling: {
                fagsystemId: '81549301',
                linjer: [
                    {
                        fom: '2019-09-26',
                        tom: '2019-09-30',
                        dagsats: 1431,
                        grad: 100,
                    },
                ],
            },
        },
        sykdomstidslinje: sykdomstidslinje,
        godkjentAv: undefined,
        godkjenttidspunkt: undefined,
        vilkår: {
            sykepengedager: {
                forbrukteSykedager: 3,
                førsteFraværsdag: fom,
                førsteSykepengedag: '2019-09-26',
                maksdato: '2020-09-07',
                oppfylt: true,
            },
            alder: {
                alderSisteSykedag: 28,
                oppfylt: true,
            },
            opptjening: {
                antallKjenteOpptjeningsdager: 3539,
                fom: somDato('2019-09-10').subtract(3539, 'day').format(ISO_DATOFORMAT),
                oppfylt: true,
            },
            søknadsfrist: {
                sendtNav: søknad.sendtNav,
                søknadFom: søknad.fom,
                søknadTom: søknad.tom,
                oppfylt: true,
            },
            sykepengegrunnlag: {
                sykepengegrunnlag: 372000.0,
                grunnbeløp: 99858,
                oppfylt: true,
            },
        },
        førsteFraværsdag: fom,
        inntektFraInntektsmelding: 31000.0,
        totalbeløpArbeidstaker:
            _utbetalingstidslinje
                .map((utbetaling) => utbetaling.utbetaling)
                .reduce((acc: number, val) => (val === undefined ? acc : acc + val), 0) ?? 0,
        hendelser: defaultHendelser,
        dataForVilkårsvurdering: {
            antallOpptjeningsdagerErMinst: 3539,
            avviksprosent: 0.0,
            beregnetÅrsinntektFraInntektskomponenten: 372000.0,
            erEgenAnsatt: false,
            harOpptjening: true,
        },
        utbetalingslinjer: [
            {
                fom: '2019-09-26',
                tom: '2019-09-30',
                dagsats: 1431,
                grad: 100,
            },
        ],
        aktivitetslogg: aktivitetslogg,
        forlengelseFraInfotrygd: SpleisForlengelseFraInfotrygd.NEI,
        periodetype: SpleisPeriodetype.FØRSTEGANGSBEHANDLING,
    };
};
