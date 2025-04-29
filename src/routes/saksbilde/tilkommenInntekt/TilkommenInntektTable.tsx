import cn from 'classnames';
import React, { ReactElement } from 'react';

import { Box, Checkbox, CheckboxGroup, Table, VStack } from '@navikt/ds-react';

import { ArbeidsgiverFragment, Utbetalingsdagtype } from '@io/graphql';
import { DateString } from '@typer/shared';
import { erHelg, somNorskDato } from '@utils/date';

import styles from './TilkommenTable.module.css';

interface TilkommenInntektTableProps {
    arbeidsgivere: ArbeidsgiverFragment[];
    fom: DateString;
    tom: DateString;
    setDagerSomSkalEkskluderes: (datoer: DateString[]) => void;
}

export const TilkommenInntektTable = ({
    arbeidsgivere,
    fom,
    tom,
    setDagerSomSkalEkskluderes,
}: TilkommenInntektTableProps): ReactElement => {
    const arbeidsgiverdager = tabellArbeidsdager(arbeidsgivere).filter((dag) => dag.dato >= fom && dag.dato <= tom);

    return (
        <VStack paddingBlock="8 6">
            <Box
                background={'surface-subtle'}
                borderWidth="0 0 0 3"
                style={{ borderColor: 'transparent' }}
                paddingBlock="4"
                paddingInline={'10'}
                minWidth={'390px'}
                maxWidth={'630px'}
            >
                <CheckboxGroup
                    legend="Velg hvilke dager som ikke skal graderes"
                    onChange={(valgte: DateString[]) => setDagerSomSkalEkskluderes(valgte)}
                >
                    <Table size="small">
                        <Table.Header>
                            <Table.Row>
                                <Table.DataCell>Dato</Table.DataCell>
                                {arbeidsgiverdager[0]?.arbeidsgivere.map((arbeidsgiver) => (
                                    <Table.DataCell key={arbeidsgiver.navn}>{arbeidsgiver.navn}</Table.DataCell>
                                ))}
                            </Table.Row>
                        </Table.Header>
                        <Table.Body className={styles.tabelBody}>
                            {arbeidsgiverdager.map((dag) => (
                                <Table.Row key={dag.dato + 'row'} className={cn(erHelg(dag.dato) && styles.helg)}>
                                    <Table.DataCell key={dag.dato}>
                                        {erHelg(dag.dato) ? (
                                            somNorskDato(dag.dato)
                                        ) : (
                                            <Checkbox size="small" value={dag.dato} className={styles.checkbox}>
                                                {somNorskDato(dag.dato)}
                                            </Checkbox>
                                        )}
                                    </Table.DataCell>
                                    {dag.arbeidsgivere.map((arbeidsgiver) => (
                                        <Table.DataCell key={dag.dato + arbeidsgiver.navn}>
                                            {arbeidsgiver.dagtype}
                                        </Table.DataCell>
                                    ))}
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                </CheckboxGroup>
            </Box>
        </VStack>
    );
};

interface TabellArbeidsdag {
    dato: DateString;
    arbeidsgivere: {
        navn: string;
        dagtype: Utbetalingsdagtype;
    }[];
}

const tabellArbeidsdager = (arbeidsgivere: ArbeidsgiverFragment[]): TabellArbeidsdag[] => {
    const gruppertPåDato = new Map<DateString, { navn: string; dagtype: Utbetalingsdagtype }[]>();
    const gruppertPåArbeidsgiver: {
        navn: string;
        dager: { dato: DateString; dagtype: Utbetalingsdagtype }[];
    }[] = arbeidsgivere.map((arbeidsgiver) => ({
        navn: arbeidsgiver.navn,
        dager:
            arbeidsgiver.generasjoner[0]?.perioder
                .flatMap((periode) =>
                    periode.tidslinje.map((linje) => ({
                        dato: linje.dato,
                        dagtype: linje.utbetalingsdagtype,
                    })),
                )
                .filter((dag) => dag != null) ?? [],
    }));

    gruppertPåArbeidsgiver.forEach(({ navn, dager }) => {
        dager.forEach(({ dato, dagtype }) => {
            if (!gruppertPåDato.has(dato)) {
                gruppertPåDato.set(dato, []);
            }
            gruppertPåDato.get(dato)?.push({
                navn: navn,
                dagtype: dagtype,
            });
        });
    });

    return Array.from(gruppertPåDato.entries().map(([dato, arbeidsgivere]) => ({ dato, arbeidsgivere })));
};
