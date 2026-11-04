import { lagDagEndringSchema, lagDagEndringSelvstendigSchema } from '@form-schemas/dagEndringSkjema';
import {
    alleTypeendringer,
    overstyringsdagtyperArbeidstaker,
    overstyringsdagtyperSelvstendig,
} from '@saksbilde/utbetaling/utbetalingstabell/endringForm/endringFormUtils';
import type { Speildag } from '@saksbilde/utbetaling/utbetalingstabell/utbetalingstabelldager';
import type { GradertAnnenYtelse, Utbetalingstabelldag } from '@typer/utbetalingstabell';

import type { DagEndringFormFields } from './types';

export function lagSchema(erSelvstendig: boolean, markerteDager: Map<string, Utbetalingstabelldag>) {
    const lagDagEndring = erSelvstendig ? lagDagEndringSelvstendigSchema : lagDagEndringSchema;
    return lagDagEndring(finnMinimumGrad(markerteDager), [...markerteDager.values()]);
}

export function lagStandardverdier(erSelvstendig: boolean): DagEndringFormFields {
    return {
        dagtype: erSelvstendig ? 'MeldingTilNav' : 'Syk',
        grad: erSelvstendig ? null : 100,
        innvigletGrad: null,
        sykepengerGrad: null,
        gradAndreYtelser: null,
        gradererAnnenYtelse: false,
    };
}

export function overstyringsdagtyper(erSelvstendig: boolean): Speildag[] {
    return erSelvstendig ? overstyringsdagtyperSelvstendig : overstyringsdagtyperArbeidstaker;
}

export function tilDagendring(values: DagEndringFormFields): Partial<Utbetalingstabelldag> {
    let gradertAnnenYtelse: GradertAnnenYtelse | null = null;
    if (values.gradererAnnenYtelse) {
        const sykdomsgradFørFordeling = values.innvigletGrad;
        if (sykdomsgradFørFordeling == null) throw new Error('Sykdomsgrad før fordeling mangler');
        gradertAnnenYtelse = {
            sykdomsgradFørFordeling,
            sykdomsgrad: values.sykepengerGrad ?? 0,
            andreYtelseGrad: values.gradAndreYtelser ?? 0,
        };
    }
    return {
        grad: values.gradererAnnenYtelse ? (values.sykepengerGrad ?? 0) + (values.gradAndreYtelser ?? 0) : values.grad,
        dag: alleTypeendringer.find((dag) => dag.speilDagtype === values.dagtype)!,
        erAvvist: false,
        erForeldet: false,
        gradertAnnenYtelse,
    };
}

function finnMinimumGrad(markerteDager: Map<string, Utbetalingstabelldag>): number {
    return markerteDager
        .values()
        .reduce((previousValue, currentValue) => Math.max(previousValue, currentValue.grad ?? 0), 0);
}
