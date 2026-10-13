import type { DagEndringArbeidstakerFormFields, DagEndringSelvstendigFormFields } from '@form-schemas/dagEndringSkjema';
import type { Utbetalingstabelldag } from '@typer/utbetalingstabell';

export type DagEndringFormFields = DagEndringArbeidstakerFormFields | DagEndringSelvstendigFormFields;

export interface EndreDagerFormProps {
    markerteDager: Map<string, Utbetalingstabelldag>;
    onSubmitEndring: (endring: Partial<Utbetalingstabelldag>) => void;
    erSelvstendig: boolean;
}
