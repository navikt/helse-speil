import React, { useContext } from 'react';
import Element from 'nav-frontend-typografi/lib/element';
import { overstyrbareTabellerEnabled, overstyreUtbetaltPeriodeEnabled } from '../../../featureToggles';
import { Overstyringsknapp } from '../../../components/tabell/Overstyringsknapp';
import styled from '@emotion/styled';
import { NORSK_DATOFORMAT } from '../../../utils/date';
import { PersonContext } from '../../../context/PersonContext';
import { dato, gradering, ikon, kilde, tomCelle, type } from '../../../components/tabell/rader';
import { Dagtype, Vedtaksperiode, Vedtaksperiodetilstand } from 'internal-types';
import { Tabell } from '@navikt/helse-frontend-tabell';
import classNames from 'classnames';
import { Infoikon } from '../../../components/ikoner/Infoikon';

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
}

export const Sykmeldingsperiodetabell = ({ toggleOverstyring }: SykmeldingsperiodetabellProps) => {
    const { personTilBehandling, aktivVedtaksperiode } = useContext(PersonContext);
    const fom = aktivVedtaksperiode?.fom.format(NORSK_DATOFORMAT);
    const tom = aktivVedtaksperiode?.tom.format(NORSK_DATOFORMAT);
    const tabellbeskrivelse = `Sykmeldingsperiode fra ${fom} til ${tom}`;

    const visOverstyringAvUtbetaltPeriode = (vedtaksperiode: Vedtaksperiode): boolean => {
        if (!personTilBehandling?.arbeidsgivere) return false;
        const førstePeriode = personTilBehandling.arbeidsgivere[0].vedtaksperioder.sort((a, b) =>
            a.fom.isAfter(b.fom) ? -1 : 1
        )[0];
        return (
            overstyreUtbetaltPeriodeEnabled &&
            aktivVedtaksperiode === førstePeriode &&
            vedtaksperiode.tilstand === Vedtaksperiodetilstand.Utbetalt
        );
    };

    const visOverstyring =
        overstyrbareTabellerEnabled &&
        aktivVedtaksperiode &&
        ([
            Vedtaksperiodetilstand.Oppgaver,
            Vedtaksperiodetilstand.Avslag,
            Vedtaksperiodetilstand.IngenUtbetaling,
            Vedtaksperiodetilstand.Feilet,
        ].includes(aktivVedtaksperiode.tilstand) ||
            visOverstyringAvUtbetaltPeriode(aktivVedtaksperiode));

    const rader =
        aktivVedtaksperiode?.sykdomstidslinje.map((dag) => {
            const overstyring = aktivVedtaksperiode?.overstyringer.find((overstyring) =>
                overstyring.overstyrteDager.find((overstyrtDag) => overstyrtDag.dato.isSame(dag.dato))
            );
            const førsteCelle = () => (overstyring ? <OverstyrtInfoIkon width={20} height={20} /> : tomCelle());
            return {
                celler: [
                    førsteCelle(),
                    dato(dag),
                    ikon(dag),
                    type(dag),
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
        '',
        <Element>Dato</Element>,
        {
            render: <Element>Dagtype</Element>,
            kolonner: 2,
        },
        <Element>Grad</Element>,
        '',
        visOverstyring ? <Overstyringsknapp overstyrer={false} toggleOverstyring={toggleOverstyring} /> : '',
    ];
    return <Periodetabell beskrivelse={tabellbeskrivelse} headere={headere} rader={rader} />;
};
