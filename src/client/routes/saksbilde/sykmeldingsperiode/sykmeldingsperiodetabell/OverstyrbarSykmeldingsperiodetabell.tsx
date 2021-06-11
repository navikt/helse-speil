import styled from '@emotion/styled';
import { Dagtype, Kildetype, OverstyrtDag, Sykdomsdag, Utbetalingsdag } from 'internal-types';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useSetRecoilState } from 'recoil';

import { postAbonnerPåAktør, postOverstyring } from '../../../../io/http';
import { OverstyrtDagDTO } from '../../../../io/types';
import { Tidslinjeperiode } from '../../../../modell/UtbetalingshistorikkElement';
import { opptegnelsePollingTimeState } from '../../../../state/opptegnelser';
import { usePerson } from '../../../../state/person';
import { useAddToast } from '../../../../state/toasts';
import { NORSK_DATOFORMAT } from '../../../../utils/date';

import { overstyrbareTabellerEnabled } from '../../../../featureToggles';
import { Header } from '../../table/Header';
import { Table } from '../../table/Table';
import { trimLedendeArbeidsdager } from '../Sykmeldingsperiode';
import { kalkulererToast } from '../kalkuleringstoasts';
import { DateCell } from './DateCell';
import { KildeCell } from './KildeCell';
import { OverstyrbarDagtypeCell } from './OverstyrbarDagtypeCell';
import { OverstyrbarGradCell } from './OverstyrbarGradCell';
import { Overstyringsknapp } from './Overstyringsknapp';
import { Overstyringsskjema } from './Overstyringsskjema';
import { SykmeldingsperiodeRow } from './SykmeldingsperiodeRow';
import { useOverstyrteDager } from './useOverstyrteDager';

const Container = styled.section`
    flex: 1;
    padding: 2rem 0;
    overflow-x: scroll;
    margin: 0;
    height: 100%;
    width: 400px;
`;

const Feilmelding = styled.p`
    color: var(--navds-color-text-error);
    margin: 1rem 0 0;
    font-weight: 600;
`;

const tilOverstyrtDagtype = (type: Dagtype): 'Sykedag' | 'Feriedag' | 'Egenmeldingsdag' | 'Permisjonsdag' | Dagtype => {
    switch (type) {
        case Dagtype.Syk:
            return 'Sykedag';
        case Dagtype.Ferie:
            return 'Feriedag';
        case Dagtype.Permisjon:
            return 'Permisjonsdag';
        case Dagtype.Egenmelding:
            return 'Egenmeldingsdag';
        default:
            return type;
    }
};

const tilOverstyrteDager = (dager: Sykdomsdag[]): OverstyrtDagDTO[] =>
    dager.map((dag) => ({
        dato: dag.dato.format('YYYY-MM-DD'),
        type: tilOverstyrtDagtype(dag.type),
        grad: dag.gradering,
    }));

const getMatchingUtbetalingsdag = (sykdomsdag: Sykdomsdag, utbetalingstidslinje: Utbetalingsdag[]): Utbetalingsdag =>
    utbetalingstidslinje.find(({ dato }) => dato.isSame(sykdomsdag.dato)) ??
    (() => {
        const dato = sykdomsdag.dato.format(NORSK_DATOFORMAT);
        throw Error(`Sykdomsdag ${dato} har ikke tilsvarende sykdomsdag i sykdomstidslinjen.`);
    })();

const getMatchingOverstyrtDag = (sykdomsdag: Sykdomsdag, overstyrteDager: OverstyrtDag[]): OverstyrtDag | undefined =>
    overstyrteDager.find((overstyrtDag) => overstyrtDag.dato.isSame(sykdomsdag.dato));

interface OverstyrbarSykmeldingsperiodetabellProps {
    aktivPeriode: Tidslinjeperiode;
    onOverstyr: () => void;
    onToggleOverstyring: () => void;
    originaleDager?: Sykdomsdag[];
}

export const OverstyrbarSykmeldingsperiodetabell = ({
    aktivPeriode,
    onOverstyr,
    onToggleOverstyring,
    originaleDager,
}: OverstyrbarSykmeldingsperiodetabellProps) => {
    const { overstyrteDager, leggTilOverstyrtDag } = useOverstyrteDager(originaleDager);
    const personTilBehandling = usePerson();
    const [overstyringserror, setOverstyringserror] = useState<string>();
    const leggtilEnToast = useAddToast();
    const form = useForm({ shouldFocusError: false, mode: 'onBlur' });
    const setOpptegnelsePollingTime = useSetRecoilState(opptegnelsePollingTimeState);

    const fom = aktivPeriode?.fom.format(NORSK_DATOFORMAT);
    const tom = aktivPeriode?.tom.format(NORSK_DATOFORMAT);

    const tabellrader: [Sykdomsdag, Utbetalingsdag, OverstyrtDag | undefined][] = trimLedendeArbeidsdager(
        aktivPeriode?.sykdomstidslinje ?? []
    ).map((it) => [
        it,
        getMatchingUtbetalingsdag(it, aktivPeriode.utbetalingstidslinje),
        getMatchingOverstyrtDag(it, overstyrteDager),
    ]);

    const overstyring = () => ({
        aktørId: personTilBehandling!.aktørId,
        fødselsnummer: personTilBehandling!.fødselsnummer,
        organisasjonsnummer: aktivPeriode.organisasjonsnummer,
        dager: tilOverstyrteDager(overstyrteDager),
        begrunnelse: form.getValues().begrunnelse,
    });

    const sendOverstyring = () => {
        postOverstyring(overstyring())
            .then(() => {
                leggtilEnToast(kalkulererToast({}));
                onOverstyr();
                postAbonnerPåAktør(personTilBehandling!.aktørId).then(() => {
                    setOpptegnelsePollingTime(1000);
                });
            })
            .catch(() => setOverstyringserror('Feil under sending av overstyring. Prøv igjen senere.'));
    };

    return (
        <Container>
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(sendOverstyring)}>
                    <Table aria-label={`Overstyrer sykmeldingsperiode fra ${fom} til ${tom}`}>
                        <thead>
                            <tr>
                                <Header scope="column" colSpan={1}>
                                    Dato
                                </Header>
                                <Header scope="column" colSpan={1}>
                                    Dagtype
                                </Header>
                                <Header scope="column" colSpan={1}>
                                    Grad
                                </Header>
                                <Header scope="column" colSpan={1} aria-label="Kilde" />
                                <Header>
                                    {overstyrbareTabellerEnabled && (
                                        <Overstyringsknapp overstyrer toggleOverstyring={onToggleOverstyring} />
                                    )}
                                </Header>
                            </tr>
                        </thead>
                        <tbody>
                            {tabellrader.map(([sykdomsdag, utbetalingsdag, maybeOverstyrdag], i) => (
                                <SykmeldingsperiodeRow key={i} type={sykdomsdag.type}>
                                    <DateCell date={sykdomsdag.dato} />
                                    <OverstyrbarDagtypeCell
                                        sykdomsdag={sykdomsdag}
                                        utbetalingsdag={utbetalingsdag}
                                        onOverstyr={leggTilOverstyrtDag}
                                    />
                                    <OverstyrbarGradCell
                                        sykdomsdag={sykdomsdag}
                                        utbetalingsdag={utbetalingsdag}
                                        onOverstyr={leggTilOverstyrtDag}
                                    />
                                    <KildeCell kilde={maybeOverstyrdag ? Kildetype.Saksbehandler : sykdomsdag.kilde} />
                                    <td style={{ width: '100%' }} />
                                </SykmeldingsperiodeRow>
                            ))}
                        </tbody>
                    </Table>
                    <Overstyringsskjema avbrytOverstyring={onToggleOverstyring} overstyrteDager={overstyrteDager} />
                    {overstyringserror && <Feilmelding role="alert">{overstyringserror}</Feilmelding>}
                </form>
            </FormProvider>
        </Container>
    );
};
