import type { DagEndringArbeidstakerFormFields, DagEndringSelvstendigFormFields } from '@form-schemas/dagEndringSkjema';
import type { GradertAnnenYtelse, Utbetalingstabelldag } from '@typer/utbetalingstabell';

export type DagEndringFormFields = DagEndringArbeidstakerFormFields | DagEndringSelvstendigFormFields;

export type Fordeling = Omit<GradertAnnenYtelse, 'sykdomsgradFørFordeling'>;

// Endringen fra skjemaet gjelder alle markerte dager, men sykdomsgraden før fordeling er ulik for hver dag
export type Dagendring = Omit<Partial<Utbetalingstabelldag>, 'gradertAnnenYtelse'> & {
    gradertAnnenYtelse: Fordeling | null;
};

export interface EndreDagerFormProps {
    markerteDager: Map<string, Utbetalingstabelldag>;
    onSubmitEndring: (endring: Dagendring) => void;
    erSelvstendig: boolean;
}
