import dayjs from 'dayjs';
import { ReactElement } from 'react';

import { DatePicker, HStack, useDatepicker } from '@navikt/ds-react';

import { useHarPorteføljestyringrolle } from '@hooks/brukerrolleHooks';
import { useOppgavelisteSokSkjema } from '@state/oppgavelister';

export const OppgavelisteDatoFilter = (): ReactElement => {
    const harPorteføljestyringrolle = useHarPorteføljestyringrolle();
    const { draft, setOppgaveKlarFom, setOppgaveKlarTom, setBehandlingOpprettetFom, setBehandlingOpprettetTom } =
        useOppgavelisteSokSkjema();

    const fomDatePicker = useDatepicker({
        defaultSelected: draft.oppgaveKlarFom ? new Date(draft.oppgaveKlarFom) : undefined,
        onDateChange: (d) => setOppgaveKlarFom(d ? dayjs(d).format('YYYY-MM-DD') : undefined),
    });

    const tomDatePicker = useDatepicker({
        defaultSelected: draft.oppgaveKlarTom ? new Date(draft.oppgaveKlarTom) : undefined,
        onDateChange: (d) => setOppgaveKlarTom(d ? dayjs(d).format('YYYY-MM-DD') : undefined),
    });

    const behandlingOpprettetFomDatePicker = useDatepicker({
        defaultSelected: draft.behandlingOpprettetFom ? new Date(draft.behandlingOpprettetFom) : undefined,
        onDateChange: (d) => setBehandlingOpprettetFom(d ? dayjs(d).format('YYYY-MM-DD') : undefined),
    });

    const behandlingOpprettetTomDatePicker = useDatepicker({
        defaultSelected: draft.behandlingOpprettetTom ? new Date(draft.behandlingOpprettetTom) : undefined,
        onDateChange: (d) => setBehandlingOpprettetTom(d ? dayjs(d).format('YYYY-MM-DD') : undefined),
    });

    return (
        <HStack wrap gap="space-16">
            <DatePicker {...fomDatePicker.datepickerProps} dropdownCaption>
                <DatePicker.Input {...fomDatePicker.inputProps} label="Oppgave klar f.o.m." size="small" />
            </DatePicker>
            <DatePicker {...tomDatePicker.datepickerProps} dropdownCaption>
                <DatePicker.Input {...tomDatePicker.inputProps} label="Oppgave klar t.o.m." size="small" />
            </DatePicker>
            {harPorteføljestyringrolle && (
                <>
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
                </>
            )}
        </HStack>
    );
};
