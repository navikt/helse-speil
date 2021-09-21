import dayjs from 'dayjs';

import { mapUtbetalingsdag } from './dag';

export class UfullstendigVedtaksperiodeBuilder {
    constructor(
        person: ExternalPerson,
        arbeidsgiver: ExternalArbeidsgiver,
        vedtaksperiode: ExternalUfullstendigVedtaksperiode
    ) {
        this.person = person;
        this.arbeidsgiver = arbeidsgiver;
        this.unmapped = vedtaksperiode;
    }

    private readonly unmapped: ExternalUfullstendigVedtaksperiode;
    private readonly arbeidsgiver: ExternalArbeidsgiver;
    private person: ExternalPerson;
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
                        case 'TilUtbetaling':
                            return 'tilUtbetaling';
                        case 'Utbetalt':
                            return 'utbetalt';
                        case 'Oppgaver':
                            return 'oppgaver';
                        case 'Venter':
                            return 'venter';
                        case 'VenterPåKiling':
                            return 'venterPåKiling';
                        case 'IngenUtbetaling':
                            return 'ingenUtbetaling';
                        case 'Feilet':
                            return 'feilet';
                        case 'TilInfotrygd':
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
