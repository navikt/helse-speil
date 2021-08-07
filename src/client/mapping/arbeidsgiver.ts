import dayjs from 'dayjs';
import {
    EksternUtbetalingshistorikkElement,
    SpesialistArbeidsgiver,
    SpesialistInntektsgrunnlag,
    SpesialistPerson,
    SpesialistVedtaksperiode,
} from 'external-types';
import {
    Arbeidsgiver,
    Dagtype,
    Tidslinjetilstand,
    UfullstendigVedtaksperiode,
    Utbetalingsdag,
    Utbetalingstype,
    Vedtaksperiode,
    Vurdering,
} from 'internal-types';
import { nanoid } from 'nanoid';

import {
    Periodetype,
    sykdomstidslinje,
    Tidslinjeperiode,
    utbetalingshistorikkelement,
    Utbetalingstatus,
    utbetalingstidslinje,
} from '../modell/utbetalingshistorikkelement';

import { mapSykdomstidslinje, mapTidslinjeMedAldersvilkår, mapUtbetalingstidslinje } from './dag';
import { UfullstendigVedtaksperiodeBuilder } from './ufullstendigVedtaksperiode';
import { VedtaksperiodeBuilder } from './vedtaksperiode';

const SKAL_IKKE_KOPIERES = false;

const erAnnullering = (periode: Tidslinjeperiode) => periode.type === Periodetype.ANNULLERT_PERIODE;
const erRevurdering = (periode: Tidslinjeperiode) => periode.type === Periodetype.REVURDERING;

const periodeHarNyereGenerasjon = (id: string, nesteGenerasjon: Tidslinjeperiode[]) =>
    nesteGenerasjon.flatMap((periode) => periode.id).includes(id);

const nesteGenerasjonHarAnnullering = (nesteGenerasjon: Tidslinjeperiode[], fagsystemId?: string) =>
    nesteGenerasjon.find((periode) => erAnnullering(periode) && periode.fagsystemId === fagsystemId);

const tidligerePeriodeINesteGenerasjonErRevurdering = (
    nesteGenerasjon: Tidslinjeperiode[],
    gjeldende: Tidslinjeperiode
) => nesteGenerasjon.find((periode) => erRevurdering(periode) && periode.fom.isBefore(gjeldende.fom)) !== undefined;

export class ArbeidsgiverBuilder {
    private unmapped: SpesialistArbeidsgiver;
    private person: SpesialistPerson;
    private arbeidsgiver: Partial<Arbeidsgiver> = {};
    private inntektsgrunnlag: SpesialistInntektsgrunnlag[];
    private problems: Error[] = [];

    addPerson(person: SpesialistPerson) {
        this.person = person;
        return this;
    }

    addArbeidsgiver(arbeidsgiver: SpesialistArbeidsgiver) {
        this.unmapped = arbeidsgiver;
        return this;
    }

    addInntektsgrunnlag(inntektsgrunnlag: SpesialistInntektsgrunnlag[]) {
        this.inntektsgrunnlag = inntektsgrunnlag;
        return this;
    }

    build(): { arbeidsgiver?: Arbeidsgiver; problems: Error[] } {
        if (!this.unmapped) {
            this.problems.push(Error('Mangler arbeidsgiverdata å mappe'));
            return { problems: this.problems };
        }
        this.mapArbeidsgiverinfo();
        this.mapArbeidsforhold();
        this.mapUtbetalingshistorikk();
        this.mapVedtaksperioder();
        this.sortVedtaksperioder();
        this.markerNyestePeriode();
        this.mapTidslinjeperioder();
        return { arbeidsgiver: this.arbeidsgiver as Arbeidsgiver, problems: this.problems };
    }

    private mapTidslinjeperioder = () => {
        this.arbeidsgiver = {
            ...this.arbeidsgiver,
            tidslinjeperioder: this.flatten(
                this.arbeidsgiver.vedtaksperioder?.flatMap((periode): Tidslinjeperiode[] => {
                    return (
                        periode.beregningIder?.map((beregningId) => {
                            const element = this.arbeidsgiver.utbetalingshistorikk?.find((e) => e.id === beregningId)!;
                            const tidslinje = mapTidslinjeMedAldersvilkår(
                                utbetalingstidslinje(element.utbetaling, periode.fom, periode.tom),
                                (periode as Vedtaksperiode)?.vilkår?.alder
                            );
                            const periodetype = () => {
                                switch (element.utbetaling.type) {
                                    case Utbetalingstype.UTBETALING:
                                        return Periodetype.VEDTAKSPERIODE;
                                    case Utbetalingstype.REVURDERING:
                                        return Periodetype.REVURDERING;
                                    case Utbetalingstype.ANNULLERING:
                                        return Periodetype.ANNULLERT_PERIODE;
                                    default:
                                        return Periodetype.UFULLSTENDIG;
                                }
                            };
                            const harOppgave = !!(periode as Vedtaksperiode)?.oppgavereferanse;
                            return {
                                id: periode.id,
                                beregningId: beregningId,
                                unique: nanoid(),
                                fagsystemId: element.utbetaling.arbeidsgiverFagsystemId,
                                fom: periode.fom,
                                tom: periode.tom,
                                type: periodetype(),
                                tilstand: this.tilstand(
                                    element.utbetaling.status,
                                    periodetype(),
                                    tidslinje,
                                    harOppgave,
                                    element.utbetaling.vurdering
                                ),
                                utbetalingstidslinje: tidslinje,
                                sykdomstidslinje: sykdomstidslinje(element.beregnettidslinje, periode.fom, periode.tom),
                                fullstendig: periode.fullstendig,
                                organisasjonsnummer: this.arbeidsgiver.organisasjonsnummer!,
                                opprettet: element.tidsstempel,
                            };
                        }) ?? [
                            {
                                id: periode.id,
                                beregningId: nanoid(),
                                unique: nanoid(),
                                fom: periode.fom,
                                tom: periode.tom,
                                type: Periodetype.UFULLSTENDIG,
                                tilstand: this.tilstand(
                                    Utbetalingstatus.UKJENT,
                                    Periodetype.UFULLSTENDIG,
                                    periode.utbetalingstidslinje,
                                    false
                                ),
                                utbetalingstidslinje: [],
                                sykdomstidslinje: [],
                                fullstendig: periode.fullstendig,
                                organisasjonsnummer: this.arbeidsgiver.organisasjonsnummer!,
                                opprettet: dayjs(),
                            },
                        ]
                    );
                }) ?? []
            ),
        };
    };

    private mapArbeidsforhold = () => {
        this.arbeidsgiver = {
            ...this.arbeidsgiver,
            arbeidsforhold:
                this.person?.arbeidsforhold
                    ?.filter((it) => it.organisasjonsnummer === this.arbeidsgiver.organisasjonsnummer)
                    .map((it) => ({
                        stillingstittel: it.stillingstittel,
                        stillingsprosent: it.stillingsprosent,
                        startdato: dayjs(it.startdato),
                        sluttdato: it.sluttdato ? dayjs(it.sluttdato) : undefined,
                    })) ?? [],
        };
    };

    private markerNyestePeriode() {
        if (this.arbeidsgiver.vedtaksperioder?.length ?? -1 > 0) {
            this.arbeidsgiver.vedtaksperioder![0].erNyeste = true;
        }
    }

    private mapArbeidsgiverinfo = () => {
        this.arbeidsgiver = {
            ...this.arbeidsgiver,
            navn: this.unmapped.navn,
            id: this.unmapped.id,
            organisasjonsnummer: this.unmapped.organisasjonsnummer,
        };
    };

    private mapUtbetalingshistorikk = () => {
        this.arbeidsgiver = {
            ...this.arbeidsgiver,
            utbetalingshistorikk:
                this.unmapped.utbetalingshistorikk?.map((element: EksternUtbetalingshistorikkElement) => {
                    return utbetalingshistorikkelement(
                        element.beregningId,
                        mapSykdomstidslinje(element.beregnettidslinje),
                        mapSykdomstidslinje(element.hendelsetidslinje),
                        {
                            status: this.utbetalingsstatus(element.utbetaling.status),
                            type: this.utbetalingstype(element.utbetaling.type),
                            utbetalingstidslinje: mapUtbetalingstidslinje(element.utbetaling.utbetalingstidslinje),
                            maksdato: dayjs(element.utbetaling.maksdato),
                            gjenståendeDager: element.utbetaling.gjenståendeSykedager,
                            arbeidsgiverNettobeløp: element.utbetaling.arbeidsgiverNettoBeløp,
                            personNettobeløp: element.utbetaling.personNettoBeløp,
                            arbeidsgiverFagsystemId: element.utbetaling.arbeidsgiverFagsystemId,
                            personFagsystemId: element.utbetaling.personFagsystemId,
                            forbrukteDager: element.utbetaling.forbrukteSykedager,
                            vurdering: element.utbetaling.vurdering
                                ? {
                                      godkjent: element.utbetaling.vurdering.godkjent,
                                      tidsstempel: dayjs(element.utbetaling.vurdering.tidsstempel),
                                      automatisk: element.utbetaling.vurdering.automatisk,
                                      ident: element.utbetaling.vurdering.ident,
                                  }
                                : undefined,
                        },
                        dayjs(element.tidsstempel)
                    );
                }) ?? [],
        };
    };

    private mapVedtaksperioder = () => {
        this.arbeidsgiver.vedtaksperioder = this.unmapped.vedtaksperioder.map((unmappedVedtaksperiode) => {
            if (unmappedVedtaksperiode.fullstendig) {
                const { vedtaksperiode, problems } = new VedtaksperiodeBuilder()
                    .setVedtaksperiode(unmappedVedtaksperiode as SpesialistVedtaksperiode)
                    .setPerson(this.person)
                    .setArbeidsgiver(this.unmapped)
                    .setAnnullertUtbetalingshistorikk(this.arbeidsgiver.utbetalingshistorikk!)
                    .setOverstyringer(this.unmapped.overstyringer)
                    .setInntektsgrunnlag(this.inntektsgrunnlag)
                    .build();
                this.problems.push(...problems);
                return vedtaksperiode as Vedtaksperiode;
            } else {
                const { ufullstendigVedtaksperiode, problems } = new UfullstendigVedtaksperiodeBuilder(
                    this.person,
                    this.unmapped,
                    unmappedVedtaksperiode
                ).build();
                this.problems.push(...problems);
                return ufullstendigVedtaksperiode as UfullstendigVedtaksperiode;
            }
        });
    };

    private sortVedtaksperioder = () => {
        const reversert = (a: Vedtaksperiode, b: Vedtaksperiode) => dayjs(b.fom).valueOf() - dayjs(a.fom).valueOf();
        this.arbeidsgiver.vedtaksperioder?.sort(reversert);
    };

    private flatten = (perioder: Tidslinjeperiode[]) =>
        [...perioder]
            .sort((a, b) => (b.opprettet.isBefore(a.opprettet) ? 1 : -1))
            .map((periode) => [periode])
            .filter((generasjon) => this.ufullstendigePerioder(generasjon).length === 0)
            .filter((generasjon, index, alle) => {
                if (index === alle.length - 1) return true;
                const perioderSomSkalKopieres = this.perioderSomIkkeHarNyereGenerasjon(
                    generasjon,
                    index,
                    alle[index + 1]
                );
                alle[index + 1] = this.kopierTilNesteGenerasjon(alle[index + 1], perioderSomSkalKopieres);
                return perioderSomSkalKopieres.length !== generasjon.length;
            })
            .reverse()
            .map((generasjon, index) => this.leggUfullstendigePerioderPåSisteGenerasjon(generasjon, index, perioder));

    private utbetalingstype = (type: string): Utbetalingstype => {
        switch (type.toUpperCase()) {
            case 'UTBETALING':
                return Utbetalingstype.UTBETALING;
            case 'ANNULLERING':
                return Utbetalingstype.ANNULLERING;
            case 'ETTERUTBETALING':
                return Utbetalingstype.ETTERUTBETALING;
            case 'REVURDERING':
                return Utbetalingstype.REVURDERING;
            default:
                return Utbetalingstype.UKJENT;
        }
    };

    private utbetalingsstatus = (type: string): Utbetalingstatus => {
        switch (type.toUpperCase()) {
            case 'IKKE_UTBETALT':
                return Utbetalingstatus.IKKE_UTBETALT;
            case 'IKKE_GODKJENT':
                return Utbetalingstatus.IKKE_GODKJENT;
            case 'GODKJENT':
                return Utbetalingstatus.GODKJENT;
            case 'SENDT':
                return Utbetalingstatus.SENDT;
            case 'OVERFØRT':
                return Utbetalingstatus.OVERFØRT;
            case 'UTBETALT':
                return Utbetalingstatus.UTBETALT;
            case 'GODKJENT_UTEN_UTBETALING':
                return Utbetalingstatus.GODKJENT_UTEN_UTBETALING;
            case 'UTBETALING_FEILET':
                return Utbetalingstatus.UTBETALING_FEILET;
            case 'ANNULLERT':
                return Utbetalingstatus.ANNULLERT;
            default:
                return Utbetalingstatus.UKJENT;
        }
    };

    private perioderSomIkkeHarNyereGenerasjon = (
        generasjon: Tidslinjeperiode[],
        index: number,
        nesteGenerasjon: Tidslinjeperiode[]
    ): Tidslinjeperiode[] =>
        generasjon
            .filter((periode) => {
                if (!erAnnullering(periode) && nesteGenerasjonHarAnnullering(nesteGenerasjon, periode.fagsystemId))
                    return SKAL_IKKE_KOPIERES;
                if (tidligerePeriodeINesteGenerasjonErRevurdering(nesteGenerasjon, periode)) return SKAL_IKKE_KOPIERES;
                return !periodeHarNyereGenerasjon(periode.id, nesteGenerasjon);
            })
            .map((periode) => ({
                ...periode,
                unique: nanoid(),
            }));

    private leggUfullstendigePerioderPåSisteGenerasjon = (
        generasjon: Tidslinjeperiode[],
        index: number,
        allePerioder: Tidslinjeperiode[]
    ) => {
        if (index === 0) {
            return [...generasjon, ...this.alleUfullstendigePerioder(allePerioder)];
        }
        return generasjon;
    };

    private alleUfullstendigePerioder = (alleGenerasjoner: Tidslinjeperiode[]) =>
        alleGenerasjoner.filter((periode) => !periode.fullstendig);

    private ufullstendigePerioder = (generasjon: Tidslinjeperiode[]) =>
        generasjon.filter((periode) => !periode.fullstendig);

    private kopierTilNesteGenerasjon = (
        nesteGenerasjon: Tidslinjeperiode[],
        perioderSomSkalKopieres: Tidslinjeperiode[]
    ) => [...nesteGenerasjon, ...perioderSomSkalKopieres];

    private tilstand = (
        utbetalingstatus: Utbetalingstatus,
        periodetype: Periodetype,
        utbetalingstidslinje: Utbetalingsdag[],
        harOppgave: boolean,
        vurdering?: Vurdering
    ): Tidslinjetilstand => {
        switch (periodetype) {
            case Periodetype.VEDTAKSPERIODE:
                switch (utbetalingstatus) {
                    case Utbetalingstatus.IKKE_UTBETALT:
                        return harOppgave ? Tidslinjetilstand.Oppgaver : Tidslinjetilstand.Venter;
                    case Utbetalingstatus.IKKE_GODKJENT:
                        return Tidslinjetilstand.Avslag;
                    case Utbetalingstatus.GODKJENT:
                    case Utbetalingstatus.SENDT:
                    case Utbetalingstatus.OVERFØRT:
                        return vurdering?.automatisk
                            ? Tidslinjetilstand.TilUtbetalingAutomatisk
                            : Tidslinjetilstand.TilUtbetaling;
                    case Utbetalingstatus.UTBETALT:
                        return vurdering?.automatisk
                            ? Tidslinjetilstand.UtbetaltAutomatisk
                            : Tidslinjetilstand.Utbetalt;
                    default:
                        return this.defaultTidslinjeTilstander(utbetalingstatus, utbetalingstidslinje);
                }
            case Periodetype.REVURDERING:
                switch (utbetalingstatus) {
                    case Utbetalingstatus.IKKE_UTBETALT:
                        return harOppgave ? Tidslinjetilstand.Revurderes : Tidslinjetilstand.Venter;
                    case Utbetalingstatus.IKKE_GODKJENT:
                        return Tidslinjetilstand.Avslag;
                    case Utbetalingstatus.GODKJENT:
                    case Utbetalingstatus.SENDT:
                    case Utbetalingstatus.OVERFØRT:
                    case Utbetalingstatus.UTBETALT:
                    case Utbetalingstatus.GODKJENT_UTEN_UTBETALING:
                        return this.harDagtype(Dagtype.Syk, utbetalingstidslinje)
                            ? Tidslinjetilstand.Revurdert
                            : Tidslinjetilstand.RevurdertIngenUtbetaling;
                    default:
                        return this.defaultTidslinjeTilstander(utbetalingstatus, utbetalingstidslinje);
                }
            case Periodetype.ANNULLERT_PERIODE:
                switch (utbetalingstatus) {
                    case Utbetalingstatus.GODKJENT:
                    case Utbetalingstatus.SENDT:
                    case Utbetalingstatus.OVERFØRT:
                        return Tidslinjetilstand.TilAnnullering;
                    case Utbetalingstatus.ANNULLERT:
                        return Tidslinjetilstand.Annullert;
                    case Utbetalingstatus.UTBETALING_FEILET:
                        return Tidslinjetilstand.AnnulleringFeilet;
                    default:
                        return this.defaultTidslinjeTilstander(utbetalingstatus, utbetalingstidslinje);
                }
            case Periodetype.UFULLSTENDIG:
                return utbetalingstidslinje.length > 0
                    ? this.defaultTidslinjeTilstander(Utbetalingstatus.GODKJENT_UTEN_UTBETALING, utbetalingstidslinje)
                    : Tidslinjetilstand.Venter;
        }
    };

    private defaultTidslinjeTilstander = (
        utbetalingstatus: Utbetalingstatus,
        utbetalingstidslinje: Utbetalingsdag[]
    ): Tidslinjetilstand => {
        switch (utbetalingstatus) {
            case Utbetalingstatus.GODKJENT_UTEN_UTBETALING:
                return this.harUtelukkende([Dagtype.Ferie, Dagtype.Helg], utbetalingstidslinje)
                    ? Tidslinjetilstand.KunFerie
                    : this.harUtelukkende([Dagtype.Permisjon, Dagtype.Helg], utbetalingstidslinje)
                    ? Tidslinjetilstand.KunPermisjon
                    : Tidslinjetilstand.IngenUtbetaling;
            case Utbetalingstatus.UTBETALING_FEILET:
                return Tidslinjetilstand.Feilet;
            default:
                return Tidslinjetilstand.Ukjent;
        }
    };

    private harUtelukkende = (dagtyper: Dagtype[], utbetalingstidslinje: Utbetalingsdag[]) =>
        utbetalingstidslinje.filter((dag) => dagtyper.includes(dag.type)).length === utbetalingstidslinje.length;

    private harDagtype = (dagtype: Dagtype, utbetalingstidslinje: Utbetalingsdag[]) =>
        utbetalingstidslinje.filter((dag) => dag.type.includes(dagtype)).length > 0;
}
