import React, { useContext } from 'react';
import Element from 'nav-frontend-typografi/lib/element';
import { overstyrbareTabellerEnabled } from '../../../featureToggles';
import { Overstyringsknapp } from '../../../components/tabell/Overstyringsknapp';
import styled from '@emotion/styled';
import { NORSK_DATOFORMAT } from '../../../utils/date';
import { PersonContext } from '../../../context/PersonContext';
import { dato, gradering, ikon, kilde, tomCelle, type } from '../../../components/tabell/rader';
import { Dagtype, Vedtaksperiodetilstand } from '../../../context/types.internal';
import { Tabell } from '@navikt/helse-frontend-tabell';
import classNames from 'classnames';
import Infoikon from '../../../components/Ikon/Infoikon';

const Periodetabell = styled(Tabell)`
    thead tr th {
        vertical-align: bottom;
        box-sizing: border-box;
        height: 51px;
    }
`;

const HøyrestiltContainer = styled.div`
    display: flex;
    justify-content: flex-end;
`;

const OverstyrtInfoIkon = styled(Infoikon)`
    display: flex;
    margin-right: -1rem;
`;

interface SykmeldingsperiodetabellProps {
    toggleOverstyring: () => void;
}

export const Sykmeldingsperiodetabell = ({ toggleOverstyring }: SykmeldingsperiodetabellProps) => {
    const { aktivVedtaksperiode } = useContext(PersonContext);
    const fom = aktivVedtaksperiode?.fom.format(NORSK_DATOFORMAT);
    const tom = aktivVedtaksperiode?.tom.format(NORSK_DATOFORMAT);
    const tabellbeskrivelse = `Sykmeldingsperiode fra ${fom} til ${tom}`;

    const visOverstyring =
        overstyrbareTabellerEnabled &&
        aktivVedtaksperiode &&
        [
            Vedtaksperiodetilstand.Oppgaver,
            Vedtaksperiodetilstand.Avslag,
            Vedtaksperiodetilstand.IngenUtbetaling,
            Vedtaksperiodetilstand.Feilet,
        ].includes(aktivVedtaksperiode.tilstand);

    const rader =
        aktivVedtaksperiode?.sykdomstidslinje.map((dag) => {
            const overstyring = aktivVedtaksperiode?.overstyringer.find((overstyring) =>
                overstyring.overstyrteDager.find((overstyrtDag) => overstyrtDag.dato.isSame(dag.dato))
            );
            const førsteCelle = () => (overstyring ? <OverstyrtInfoIkon size={20} /> : tomCelle());
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
        {
            render: <Element>Sykmeldingsperiode</Element>,
            kolonner: 3,
        },
        {
            render: <Element>Gradering</Element>,
        },
        '',
        visOverstyring ? (
            <HøyrestiltContainer>
                <Overstyringsknapp overstyrer={false} toggleOverstyring={toggleOverstyring} />
            </HøyrestiltContainer>
        ) : (
            ''
        ),
    ];
    return <Periodetabell beskrivelse={tabellbeskrivelse} headere={headere} rader={rader} />;
};
