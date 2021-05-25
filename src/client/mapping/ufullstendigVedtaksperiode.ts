import dayjs from 'dayjs';
import { SpesialistArbeidsgiver, SpesialistPerson, UfullstendigSpesialistVedtaksperiode } from 'external-types';
import { UfullstendigVedtaksperiode, Vedtaksperiodetilstand } from 'internal-types';

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

    private unmapped: UfullstendigSpesialistVedtaksperiode;
    private person: SpesialistPerson;
    private arbeidsgiver: SpesialistArbeidsgiver;
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
                tilstand: Vedtaksperiodetilstand[this.unmapped.tilstand] ?? Vedtaksperiodetilstand.Ukjent,
                utbetalingstidslinje: this.unmapped.utbetalingstidslinje?.map(mapUtbetalingsdag()) ?? [],
            },
            problems: this.problems,
        };
    };
}
