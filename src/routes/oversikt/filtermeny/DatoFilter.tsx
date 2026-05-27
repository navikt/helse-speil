import dayjs from 'dayjs';
import React, { ReactElement } from 'react';

import { Accordion, BodyShort, DatePicker, VStack, useDatepicker } from '@navikt/ds-react';

import { useSetDatofilter } from '@oversikt/table/state/filter';

import styles from './FilterList.module.css';

type DatoRadProps = {
    label: string;
    defaultSelected?: Date;
    onChange: (dato: string | undefined) => void;
};

const DatoRad = ({ label, defaultSelected, onChange }: DatoRadProps): ReactElement => {
    const datepicker = useDatepicker({
        defaultSelected,
        onDateChange: (dato) => {
            onChange(dato ? dayjs(dato).format('YYYY-MM-DD') : undefined);
        },
    });

    return (
        <DatePicker {...datepicker.datepickerProps} dropdownCaption>
            <DatePicker.Input {...datepicker.inputProps} label={label} size="small" />
        </DatePicker>
    );
};

export const DatoFilter = (): ReactElement => {
    const { datofilter, setOppgaveKlarFom, setOppgaveKlarTom } = useSetDatofilter();

    return (
        <Accordion indent={false}>
            <Accordion.Item defaultOpen className={styles.liste}>
                <Accordion.Header className={styles.header}>
                    <BodyShort weight="semibold">Oppgave klar</BodyShort>
                </Accordion.Header>
                <Accordion.Content className={styles.innhold}>
                    <VStack gap="space-8">
                        <DatoRad
                            key={datofilter.oppgaveKlarFom}
                            label="Fra og med"
                            defaultSelected={
                                datofilter.oppgaveKlarFom ? new Date(datofilter.oppgaveKlarFom) : undefined
                            }
                            onChange={setOppgaveKlarFom}
                        />
                        <DatoRad
                            key={datofilter.oppgaveKlarTom}
                            label="Til og med"
                            defaultSelected={
                                datofilter.oppgaveKlarTom ? new Date(datofilter.oppgaveKlarTom) : undefined
                            }
                            onChange={setOppgaveKlarTom}
                        />
                    </VStack>
                </Accordion.Content>
            </Accordion.Item>
        </Accordion>
    );
};
