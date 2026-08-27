import dayjs from 'dayjs';
import { ReactElement } from 'react';

import { DatePicker, HStack, useDatepicker } from '@navikt/ds-react';

import { useOppgavelisteDato } from '@state/oppgavelister';

export const OppgavelisteDatoFilter = (): ReactElement => {
    const { dato, setOppgaveKlarFom, setOppgaveKlarTom, setBehandlingOpprettetFom, setBehandlingOpprettetTom } =
        useOppgavelisteDato();

    const fomDatePicker = useDatepicker({
        defaultSelected: dato.oppgaveKlarFom ? new Date(dato.oppgaveKlarFom) : undefined,
        onDateChange: (d) => setOppgaveKlarFom(d ? dayjs(d).format('YYYY-MM-DD') : undefined),
    });

    const tomDatePicker = useDatepicker({
        defaultSelected: dato.oppgaveKlarTom ? new Date(dato.oppgaveKlarTom) : undefined,
        onDateChange: (d) => setOppgaveKlarTom(d ? dayjs(d).format('YYYY-MM-DD') : undefined),
    });

    const behandlingOpprettetFomDatePicker = useDatepicker({
        defaultSelected: dato.behandlingOpprettetFom ? new Date(dato.behandlingOpprettetFom) : undefined,
        onDateChange: (d) => setBehandlingOpprettetFom(d ? dayjs(d).format('YYYY-MM-DD') : undefined),
    });

    const behandlingOpprettetTomDatePicker = useDatepicker({
        defaultSelected: dato.behandlingOpprettetTom ? new Date(dato.behandlingOpprettetTom) : undefined,
        onDateChange: (d) => setBehandlingOpprettetTom(d ? dayjs(d).format('YYYY-MM-DD') : undefined),
    });

    return (
        <HStack wrap gap="space-32">
            <DatePicker {...fomDatePicker.datepickerProps} dropdownCaption>
                <DatePicker.Input {...fomDatePicker.inputProps} label="Oppgave klar f.o.m." size="small" />
            </DatePicker>
            <DatePicker {...tomDatePicker.datepickerProps} dropdownCaption>
                <DatePicker.Input {...tomDatePicker.inputProps} label="Oppgave klar t.o.m." size="small" />
            </DatePicker>
            <DatePicker {...behandlingOpprettetFomDatePicker.datepickerProps} dropdownCaption>
                <DatePicker.Input
                    {...behandlingOpprettetFomDatePicker.inputProps}
                    label="Startdato f.o.m."
                    size="small"
                />
            </DatePicker>
            <DatePicker {...behandlingOpprettetTomDatePicker.datepickerProps} dropdownCaption>
                <DatePicker.Input
                    {...behandlingOpprettetTomDatePicker.inputProps}
                    label="Startdato t.o.m."
                    size="small"
                />
            </DatePicker>
        </HStack>
    );
};
