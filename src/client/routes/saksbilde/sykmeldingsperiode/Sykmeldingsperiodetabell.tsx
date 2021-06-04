import styled from '@emotion/styled';
import classNames from 'classnames';
import { Dagtype, Person, Vedtaksperiode } from 'internal-types';
import React from 'react';

import Element from 'nav-frontend-typografi/lib/element';

import { Tabell } from '@navikt/helse-frontend-tabell';

import { Infoikon } from '../../../components/ikoner/Infoikon';
import { Overstyringsknapp } from '../../../components/tabell/Overstyringsknapp';
import { dato, gradering, ikonSyk, kilde, tomCelle, typeSyk } from '../../../components/tabell/rader';
import { Tidslinjetilstand } from '../../../mapping/arbeidsgiver';
import { Tidslinjeperiode } from '../../../modell/UtbetalingshistorikkElement';
import { NORSK_DATOFORMAT } from '../../../utils/date';

import { overstyrbareTabellerEnabled, overstyreUtbetaltPeriodeEnabled } from '../../../featureToggles';
import { trimLedendeArbeidsdager } from './Sykmeldingsperiode';

const Periodetabell = styled(Tabell)`
    thead tr th {
        vertical-align: top;
        box-sizing: border-box;
        padding-top: 0;
        padding-bottom: 10px;
    }

    tbody tr td:not(:first-of-type):not(:nth-of-type(3)):not(:nth-of-type(5)) {
        padding-right: 3rem;
    }
`;

const OverstyrtInfoIkon = styled(Infoikon)`
    display: flex;
    margin-right: -1.5rem;
`;

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
    const tabellbeskrivelse = `Sykmeldingsperiode fra ${fom} til ${tom}`;

    const visOverstyringAvUtbetaltPeriode = (): boolean =>
        person.arbeidsgivere &&
        overstyreUtbetaltPeriodeEnabled &&
        aktivPeriode === person.arbeidsgivere[0].tidslinjeperioder[0][0] &&
        [Tidslinjetilstand.Utbetalt, Tidslinjetilstand.UtbetaltAutomatisk].includes(aktivPeriode.tilstand);

    const visOverstyring =
        overstyrbareTabellerEnabled &&
        person.arbeidsgivere.length === 1 &&
        ([
            Tidslinjetilstand.Oppgaver,
            Tidslinjetilstand.Avslag,
            Tidslinjetilstand.IngenUtbetaling,
            Tidslinjetilstand.Feilet,
        ].includes(aktivPeriode.tilstand) ||
            visOverstyringAvUtbetaltPeriode());

    let sykdomstidslinje = trimLedendeArbeidsdager(vedtaksperiode.sykdomstidslinje);
    const rader =
        sykdomstidslinje.map((dag) => {
            const overstyring = vedtaksperiode.overstyringer.find(({ overstyrteDager }) =>
                overstyrteDager.find(({ dato }) => dato.isSame(dag.dato))
            );
            return {
                celler: [
                    overstyring ? <OverstyrtInfoIkon width={20} height={20} /> : tomCelle(),
                    dato(dag),
                    ikonSyk(dag),
                    typeSyk(dag),
                    gradering(dag),
                    kilde(dag, overstyring),
                    tomCelle(),
                ],
                className: classNames({
                    disabled: dag.type === Dagtype.Helg,
                    overstyrt: overstyring,
                }),
            };
        }) ?? [];

    const headere = [
        { render: '' },
        { render: <Element>Dato</Element> },
        {
            render: <Element>Dagtype</Element>,
            kolonner: 2,
        },
        { render: <Element>Grad</Element> },
        { render: '' },
        {
            render: visOverstyring ? (
                <Overstyringsknapp
                    overstyrer={false}
                    toggleOverstyring={toggleOverstyring}
                    overstyringsknappTekst={visOverstyringAvUtbetaltPeriode() ? 'Revurder' : 'Endre'}
                />
            ) : (
                ''
            ),
        },
    ];
    return <Periodetabell beskrivelse={tabellbeskrivelse} headere={headere} rader={rader} />;
};
