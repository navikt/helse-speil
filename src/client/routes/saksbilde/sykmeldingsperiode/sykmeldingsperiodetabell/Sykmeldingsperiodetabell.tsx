import styled from '@emotion/styled';
import { Overstyring, Person, Sykdomsdag, Vedtaksperiode } from 'internal-types';
import React from 'react';

import { Tidslinjetilstand } from '../../../../mapping/arbeidsgiver';
import { Tidslinjeperiode } from '../../../../modell/UtbetalingshistorikkElement';
import { NORSK_DATOFORMAT } from '../../../../utils/date';

import { overstyrbareTabellerEnabled, overstyreUtbetaltPeriodeEnabled } from '../../../../featureToggles';
import { Header } from '../../table/Header';
import { Table } from '../../table/Table';
import { trimLedendeArbeidsdager } from '../Sykmeldingsperiode';
import { DagtypeCell } from './DagtypeCell';
import { DateCell } from './DateCell';
import { GradCell } from './GradCell';
import { KildeCell } from './KildeCell';
import { Overstyringsknapp } from './Overstyringsknapp';
import { SykmeldingsperiodeRow } from './SykmeldingsperiodeRow';

const Container = styled.section`
    flex: 1;
    padding: 2rem 0;
    overflow-x: scroll;
    margin: 0;
    height: 100%;
    width: 400px;
`;

const revurderingEnabled = (person: Person, periode: Tidslinjeperiode): boolean =>
    overstyreUtbetaltPeriodeEnabled &&
    person.arbeidsgivere.length > 0 &&
    periode === person.arbeidsgivere[0].tidslinjeperioder?.[0]?.[0] &&
    [Tidslinjetilstand.Utbetalt, Tidslinjetilstand.UtbetaltAutomatisk].includes(periode.tilstand);

const overstyringEnabled = (person: Person, periode: Tidslinjeperiode): boolean =>
    overstyrbareTabellerEnabled &&
    person.arbeidsgivere.length === 1 &&
    ([
        Tidslinjetilstand.Oppgaver,
        Tidslinjetilstand.Avslag,
        Tidslinjetilstand.IngenUtbetaling,
        Tidslinjetilstand.Feilet,
    ].includes(periode.tilstand) ||
        revurderingEnabled(person, periode));

const getOverstyringerForSykdomsdag = (dag: Sykdomsdag, overstyringer: Overstyring[]): Overstyring | undefined =>
    overstyringer.find(({ overstyrteDager }) => overstyrteDager.find(({ dato }) => dato.isSame(dag.dato)));

interface SykmeldingsperiodetabellProps {
    toggleOverstyring: () => void;
    person: Person;
    vedtaksperiode: Vedtaksperiode;
    aktivPeriode: Tidslinjeperiode;
}

export const Sykmeldingsperiodetabell = ({
    toggleOverstyring,
    person,
    vedtaksperiode,
    aktivPeriode,
}: SykmeldingsperiodetabellProps) => {
    const fom = aktivPeriode?.fom.format(NORSK_DATOFORMAT);
    const tom = aktivPeriode?.tom.format(NORSK_DATOFORMAT);

    const revurderingIsEnabled = revurderingEnabled(person, aktivPeriode);
    const overstyringIsEnabled = overstyringEnabled(person, aktivPeriode);

    return (
        <Container>
            <Table aria-label={`Sykmeldingsperiode fra ${fom} til ${tom}`}>
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
                        <Header scope="column" colSpan={1}>
                            {overstyringIsEnabled && (
                                <Overstyringsknapp
                                    overstyrer={false}
                                    toggleOverstyring={toggleOverstyring}
                                    overstyringsknappTekst={revurderingIsEnabled ? 'Revurder' : 'Endre'}
                                />
                            )}
                        </Header>
                    </tr>
                </thead>
                <tbody>
                    {trimLedendeArbeidsdager(vedtaksperiode.sykdomstidslinje)
                        .map((it) => [it, getOverstyringerForSykdomsdag(it, vedtaksperiode.overstyringer)])
                        .map(([dag, maybeOverstyring]: [Sykdomsdag, Overstyring | undefined], i) => (
                            <SykmeldingsperiodeRow
                                key={i}
                                overstyrt={!!maybeOverstyring}
                                type={dag.type}
                                aria-label={maybeOverstyring && 'Dag overstyrt av saksbehandler'}
                            >
                                <DateCell date={dag.dato} />
                                <DagtypeCell type={dag.type} />
                                <GradCell grad={dag.gradering} />
                                <KildeCell kilde={dag.kilde} overstyring={maybeOverstyring} />
                                <td style={{ width: '100%' }} />
                            </SykmeldingsperiodeRow>
                        ))}
                </tbody>
            </Table>
        </Container>
    );
};
