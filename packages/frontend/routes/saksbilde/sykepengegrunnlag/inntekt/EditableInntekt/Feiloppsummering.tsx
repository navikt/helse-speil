import React from 'react';
import { FieldErrors } from 'react-hook-form';

import { ErrorSummary } from '@navikt/ds-react';

import styles from './EditableInntekt.module.css';

interface FeiloppsummeringProps {
    feiloppsummeringRef?: React.Ref<HTMLDivElement>;
    errors: FieldErrors;
}

//TODO: Fiks opp typing, fjern any
export const Feiloppsummering = ({ feiloppsummeringRef, errors }: FeiloppsummeringProps) => (
    <div className={styles.Feiloppsummering}>
        <ErrorSummary ref={feiloppsummeringRef} heading="Skjemaet inneholder følgende feil:">
            {Object.entries(errors)
                .filter(([_, error]) => error !== undefined)
                .map(([id, error]) => {
                    if (id !== 'refusjonsopplysninger') {
                        return (
                            <ErrorSummary.Item key={id}>
                                {error ? (error.message as string) : undefined}
                            </ErrorSummary.Item>
                        );
                    } else {
                        return (Object.entries(error as any) as any[])
                            ?.filter(
                                ([_, refusjonserror]) =>
                                    refusjonserror !== undefined &&
                                    (typeof refusjonserror?.fom === 'object' ||
                                        typeof refusjonserror?.tom === 'object' ||
                                        typeof refusjonserror?.beløp === 'object')
                            )
                            ?.map(([_, refusjonserror]) => {
                                return Object.entries(refusjonserror)?.map(
                                    ([id, refusjonstypeerror]: [string, any], index) => {
                                        if (refusjonstypeerror?.message) {
                                            return (
                                                <ErrorSummary.Item key={`${id}${index}`}>
                                                    {refusjonstypeerror.message}
                                                </ErrorSummary.Item>
                                            );
                                        } else return undefined;
                                    }
                                );
                            });
                    }
                })}
        </ErrorSummary>
    </div>
);
