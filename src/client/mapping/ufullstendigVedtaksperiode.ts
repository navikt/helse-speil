import dayjs from 'dayjs';
import {
    SpesialistArbeidsgiver,
    SpesialistPerson,
    SpleisVedtaksperiodetilstand,
    UfullstendigSpesialistVedtaksperiode,
} from 'external-types';

import { mapUtbetalingsdag } from './dag';

export class UfullstendigVedtaksperiodeBuilder {
    constructor(
        person: SpesialistPerson,
        arbeidsgiver: SpesialistArbeidsgiver,
        vedtaksperiode: UfullstendigSpesialistVedtaksperiode
    ) {
        this.person = person;
        this.arbeidsgiver = arbeidsgiver;
        this.unmapped = vedtaksperiode;
    }

    private readonly unmapped: UfullstendigSpesialistVedtaksperiode;
    private readonly arbeidsgiver: SpesialistArbeidsgiver;
    private person: SpesialistPerson;
    private problems: Error[] = [];

    build = (): { ufullstendigVedtaksperiode?: UfullstendigVedtaksperiode; problems: Error[] } => {
        if (!this.unmapped || !this.arbeidsgiver) {
            this.problems.push(Error('Kan ikke mappe ufullstendig vedtaksperiode, mangler data.'));
            return { problems: this.problems };
        }
        return this.buildUfullstendigVedtaksperiode();
    };

    private buildUfullstendigVedtaksperiode = (): {
        ufullstendigVedtaksperiode: UfullstendigVedtaksperiode;
        problems: Error[];
    } => {
        return {
            ufullstendigVedtaksperiode: {
                id: this.unmapped.id,
                fom: dayjs(this.unmapped.fom),
                tom: dayjs(this.unmapped.tom),
                fullstendig: false,
                tilstand: ((): Periodetilstand => {
                    switch (this.unmapped.tilstand) {
                        case SpleisVedtaksperiodetilstand.TilUtbetaling:
                            return 'tilUtbetaling';
                        case SpleisVedtaksperiodetilstand.Utbetalt:
                            return 'utbetalt';
                        case SpleisVedtaksperiodetilstand.Oppgaver:
                            return 'oppgaver';
                        case SpleisVedtaksperiodetilstand.Venter:
                            return 'venter';
                        case SpleisVedtaksperiodetilstand.VenterPåKiling:
                            return 'venterPåKiling';
                        case SpleisVedtaksperiodetilstand.IngenUtbetaling:
                            return 'ingenUtbetaling';
                        case SpleisVedtaksperiodetilstand.Feilet:
                            return 'feilet';
                        case SpleisVedtaksperiodetilstand.TilInfotrygd:
                            return 'tilInfotrygd';
                        default:
                            return 'ukjent';
                    }
                })(),
                utbetalingstidslinje: this.unmapped.utbetalingstidslinje?.map(mapUtbetalingsdag()) ?? [],
            },
            problems: this.problems,
        };
    };
}
