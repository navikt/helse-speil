import dayjs from 'dayjs';
import React, { ReactElement, useState } from 'react';

import { Accordion, BodyShort, DatePicker, VStack, useDatepicker } from '@navikt/ds-react';

import { useHarPorteføljestyringrolle } from '@hooks/brukerrolleHooks';
import { useSetDatofilter } from '@oversikt/table/state/filter';

import styles from './FilterList.module.css';

export function DatoFilter(): ReactElement {
    const harPorteføljestyringrolle = useHarPorteføljestyringrolle();
    const { datofilter, setOppgaveKlarFom, setOppgaveKlarTom, setBehandlingOpprettetFom, setBehandlingOpprettetTom } =
        useSetDatofilter();

    return (
        <>
            <Accordion.Item defaultOpen className={styles.liste}>
                <Accordion.Header className={styles.header}>
                    <BodyShort weight="semibold">Oppgave klar</BodyShort>
                </Accordion.Header>
                <Accordion.Content className={styles.innhold}>
                    <VStack gap="space-8">
                        <DatoRad label="Fra og med" value={datofilter.oppgaveKlarFom} onChange={setOppgaveKlarFom} />
                        <DatoRad label="Til og med" value={datofilter.oppgaveKlarTom} onChange={setOppgaveKlarTom} />
                    </VStack>
                </Accordion.Content>
            </Accordion.Item>
            {harPorteføljestyringrolle && (
                <Accordion.Item defaultOpen className={styles.liste}>
                    <Accordion.Header className={styles.header}>
                        <BodyShort weight="semibold">Startdato</BodyShort>
                    </Accordion.Header>
                    <Accordion.Content className={styles.innhold}>
                        <VStack gap="space-8">
                            <DatoRad
                                label="Fra og med"
                                value={datofilter.behandlingOpprettetFom}
                                onChange={setBehandlingOpprettetFom}
                            />
                            <DatoRad
                                label="Til og med"
                                value={datofilter.behandlingOpprettetTom}
                                onChange={setBehandlingOpprettetTom}
                            />
                        </VStack>
                    </Accordion.Content>
                </Accordion.Item>
            )}
        </>
    );
}

type DatoRadProps = {
    label: string;
    value?: string;
    onChange: (dato: string | undefined) => void;
};

function DatoRad({ label, value, onChange }: DatoRadProps): ReactElement {
    const [forrigeValue, setForrigeValue] = useState(value);

    const { datepickerProps, inputProps, selectedDay, setSelected } = useDatepicker({
        defaultSelected: tilDate(value),
        onDateChange: (dato) => {
            const filterverdi = tilFilterverdi(dato);
            if (filterverdi !== value) onChange(filterverdi);
        },
    });

    // Synk inn endringer gjort utenfor feltet (fjernet chip, «Nullstill alle»)
    if (value !== forrigeValue) {
        setForrigeValue(value);
        if (value !== tilFilterverdi(selectedDay)) setSelected(tilDate(value));
    }

    return (
        <DatePicker {...datepickerProps} strategy="fixed" dropdownCaption>
            <DatePicker.Input {...inputProps} label={label} size="small" />
        </DatePicker>
    );
}

function tilDate(dato: string | undefined): Date | undefined {
    return dato ? dayjs(dato).toDate() : undefined;
}

function tilFilterverdi(dato: Date | undefined): string | undefined {
    return dato ? dayjs(dato).format('YYYY-MM-DD') : undefined;
}
