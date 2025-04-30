import cn from 'classnames';
import React, { ReactElement, useEffect, useState } from 'react';

import { BodyShort, Box, Checkbox, HStack, Table, VStack } from '@navikt/ds-react';

import { AnonymizableTextWithEllipsis } from '@components/anonymizable/AnonymizableText';
import { ArbeidsgiverFragment, Utbetalingsdagtype } from '@io/graphql';
import { IconArbeidsdag } from '@saksbilde/table/icons/IconArbeidsdag';
import { IconFailure } from '@saksbilde/table/icons/IconFailure';
import { IconFerie } from '@saksbilde/table/icons/IconFerie';
import { IconSyk } from '@saksbilde/table/icons/IconSyk';
import { DateString } from '@typer/shared';
import { erHelg, somNorskDato } from '@utils/date';
import { capitalizeArbeidsgiver } from '@utils/locale';

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
    const [valgteDatoer, setValgteDatoer] = useState<DateString[]>([]);
    const arbeidsgiverdager = tabellArbeidsdager(arbeidsgivere).filter((dag) => dag.dato >= fom && dag.dato <= tom);
    const valgbareArbeidsdager = arbeidsgiverdager.filter((dag) => !erHelg(dag.dato));
    const toggleValgtDato = (dato: DateString) =>
        setValgteDatoer((prev) => (prev.includes(dato) ? prev.filter((value) => value !== dato) : [...prev, dato]));

    useEffect(() => {
        setDagerSomSkalEkskluderes(valgteDatoer);
    }, [valgteDatoer, setDagerSomSkalEkskluderes]);

    return (
        <VStack paddingBlock="18 6">
            <Box background={'surface-subtle'} borderWidth="0 0 0 1" borderColor="border-default" paddingBlock="4 0">
                <BodyShort weight="semibold" className={styles.tabellTittel} spacing>
                    Velg hvilke dager som ikke skal graderes
                </BodyShort>
                <Table size="small" className={styles.tabell}>
                    <Table.Header className={styles.tabellHeader}>
                        <Table.Row>
                            <Table.HeaderCell className={styles.datoKolonne}>
                                <HStack gap="2" align="center">
                                    <Checkbox
                                        checked={valgbareArbeidsdager.length === valgteDatoer.length}
                                        indeterminate={
                                            valgteDatoer.length > 0 &&
                                            valgteDatoer.length !== valgbareArbeidsdager.length
                                        }
                                        onChange={() => {
                                            if (valgteDatoer.length > 0) {
                                                setValgteDatoer([]);
                                            } else {
                                                setValgteDatoer(valgbareArbeidsdager.map((dag) => dag.dato));
                                            }
                                        }}
                                        hideLabel
                                        size="small"
                                    >
                                        Valg alle rader
                                    </Checkbox>
                                    Dato
                                </HStack>
                            </Table.HeaderCell>
                            {arbeidsgiverdager[0]?.arbeidsgivere.map((arbeidsgiver) => (
                                <Table.HeaderCell key={arbeidsgiver.navn}>
                                    <AnonymizableTextWithEllipsis className={styles.arbeidsgiverNavn}>
                                        {capitalizeArbeidsgiver(arbeidsgiver.navn)}
                                    </AnonymizableTextWithEllipsis>
                                </Table.HeaderCell>
                            ))}
                        </Table.Row>
                    </Table.Header>
                    <Table.Body className={styles.tabelBody}>
                        {arbeidsgiverdager.map((dag) => (
                            <Table.Row
                                key={dag.dato + 'row'}
                                className={cn(
                                    erHelg(dag.dato) && styles.helg,
                                    valgteDatoer.includes(dag.dato) && styles.valgteDatoer,
                                )}
                            >
                                <Table.DataCell>
                                    <HStack align="center" paddingInline="2 0">
                                        {!erHelg(dag.dato) && (
                                            <Checkbox
                                                checked={valgteDatoer.includes(dag.dato)}
                                                onChange={() => toggleValgtDato(dag.dato)}
                                                aria-labelledby={`id-${dag.dato}`}
                                                size="small"
                                            >
                                                {' '}
                                            </Checkbox>
                                        )}
                                        <span id={`id-${dag.dato}`}>{somNorskDato(dag.dato)}</span>
                                    </HStack>
                                </Table.DataCell>
                                {dag.arbeidsgivere.map((arbeidsgiver) => (
                                    <Table.DataCell key={dag.dato + arbeidsgiver.navn}>
                                        <div className={styles.dagtypeContainer}>
                                            <div className={styles.icon}>
                                                {getTypeIcon(arbeidsgiver.dagtype, erHelg(dag.dato))}
                                            </div>
                                            <BodyShort>
                                                {dekorerTekst(arbeidsgiver.dagtype, erHelg(dag.dato))}
                                            </BodyShort>
                                        </div>
                                    </Table.DataCell>
                                ))}
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
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

export const dekorerTekst = (dagtype: Utbetalingsdagtype, erHelg: boolean): string => {
    switch (dagtype) {
        case Utbetalingsdagtype.AvvistDag:
        case Utbetalingsdagtype.ForeldetDag:
            return 'Avslått';
        case Utbetalingsdagtype.Arbeidsgiverperiodedag:
            return erHelg ? 'Helg (AGP)' : 'Syk (AGP)';
        case Utbetalingsdagtype.Helgedag:
        case Utbetalingsdagtype.Navhelgdag:
            return 'Helg';
        case Utbetalingsdagtype.Feriedag:
            return 'Ferie';
        case Utbetalingsdagtype.Navdag:
            return 'Syk';
        case Utbetalingsdagtype.Arbeidsdag:
            return 'Arbeid';
        case Utbetalingsdagtype.UkjentDag:
        default:
            return 'Ukjent';
    }
};

export const getTypeIcon = (dagtype: Utbetalingsdagtype, erHelg: boolean): ReactElement | null => {
    switch (dagtype) {
        case Utbetalingsdagtype.AvvistDag:
        case Utbetalingsdagtype.ForeldetDag:
            return <IconFailure />;
        case Utbetalingsdagtype.Navdag:
        case Utbetalingsdagtype.Arbeidsgiverperiodedag:
            return erHelg ? null : <IconSyk />;
        case Utbetalingsdagtype.Feriedag:
            return <IconFerie />;
        case Utbetalingsdagtype.Arbeidsdag:
            return <IconArbeidsdag />;
        case Utbetalingsdagtype.Helgedag:
        case Utbetalingsdagtype.Navhelgdag:
        case Utbetalingsdagtype.UkjentDag:
        default:
            return null;
    }
};
