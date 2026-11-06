import { lagDagEndringSchema, lagDagEndringSelvstendigSchema } from '@form-schemas/dagEndringSkjema';
import {
    alleTypeendringer,
    overstyringsdagtyperArbeidstaker,
    overstyringsdagtyperSelvstendig,
} from '@saksbilde/utbetaling/utbetalingstabell/endringForm/endringFormUtils';
import type { Speildag } from '@saksbilde/utbetaling/utbetalingstabell/utbetalingstabelldager';
import type { Utbetalingstabelldag } from '@typer/utbetalingstabell';

import type { DagEndringFormFields, Dagendring } from './types';

export function lagSchema(erSelvstendig: boolean, markerteDager: Map<string, Utbetalingstabelldag>) {
    const lagDagEndring = erSelvstendig ? lagDagEndringSelvstendigSchema : lagDagEndringSchema;
    return lagDagEndring(finnMinimumGrad(markerteDager), [...markerteDager.values()]);
}

export function lagStandardverdier(erSelvstendig: boolean): DagEndringFormFields {
    return {
        dagtype: erSelvstendig ? 'MeldingTilNav' : 'Syk',
        grad: erSelvstendig ? null : 100,
    };
}

export function overstyringsdagtyper(erSelvstendig: boolean): Speildag[] {
    return erSelvstendig ? overstyringsdagtyperSelvstendig : overstyringsdagtyperArbeidstaker;
}

export function tilDagendring(values: DagEndringFormFields): Dagendring {
    return {
        grad: values.grad,
        dag: alleTypeendringer.find((dag) => dag.speilDagtype === values.dagtype)!,
        erAvvist: false,
        erForeldet: false,
        gradertAnnenYtelse: null,
    };
}

// Sykdomsgraden før fordeling er graden dagen har i Spleis, slik saksbehandler ser den i dagoversikten
export function tilEndringForDag(endring: Dagendring, fraDag: Utbetalingstabelldag): Partial<Utbetalingstabelldag> {
    const { gradertAnnenYtelse, ...resten } = endring;
    return {
        ...resten,
        gradertAnnenYtelse: gradertAnnenYtelse && { ...gradertAnnenYtelse, sykdomsgradFørFordeling: fraDag.grad ?? 0 },
    };
}

function finnMinimumGrad(markerteDager: Map<string, Utbetalingstabelldag>): number {
    return markerteDager
        .values()
        .reduce((previousValue, currentValue) => Math.max(previousValue, currentValue.grad ?? 0), 0);
}
