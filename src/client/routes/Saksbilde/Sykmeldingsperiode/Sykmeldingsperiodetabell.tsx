import React, { useContext } from 'react';
import Element from 'nav-frontend-typografi/lib/element';
import { overstyrbareTabellerEnabled } from '../../../featureToggles';
import { Overstyringsknapp } from '../../../components/tabell/Overstyringsknapp';
import styled from '@emotion/styled';
import { NORSK_DATOFORMAT } from '../../../utils/date';
import { PersonContext } from '../../../context/PersonContext';
import { dato, gradering, ikon, kilde, tomCelle, type } from '../../../components/tabell/rader';
import { Dagtype } from '../../../context/types.internal';
import { Tabell } from '@navikt/helse-frontend-tabell';

const Periodetabell = styled(Tabell)`
    thead,
    thead tr,
    thead tr th {
        vertical-align: bottom;
    }
`;

const HøyrestiltContainer = styled.div`
    display: flex;
    justify-content: flex-end;
`;

interface SykmeldingsperiodetabellProps {
    toggleOverstyring: () => void;
}

export const Sykmeldingsperiodetabell = ({ toggleOverstyring }: SykmeldingsperiodetabellProps) => {
    const { aktivVedtaksperiode } = useContext(PersonContext);
    const fom = aktivVedtaksperiode?.fom.format(NORSK_DATOFORMAT);
    const tom = aktivVedtaksperiode?.tom.format(NORSK_DATOFORMAT);
    const tabellbeskrivelse = `Sykmeldingsperiode fra ${fom} til ${tom}`;

    const rader =
        aktivVedtaksperiode?.sykdomstidslinje.map((dag) => ({
            celler: [tomCelle(), dato(dag), ikon(dag), type(dag), gradering(dag), kilde(dag)],
            className: dag.type === Dagtype.Helg ? 'disabled' : undefined,
        })) ?? [];

    const headere = [
        '',
        {
            render: <Element>Sykmeldingsperiode</Element>,
            kolonner: 3,
        },
        {
            render: <Element>Gradering</Element>,
        },
        overstyrbareTabellerEnabled ? (
            <HøyrestiltContainer>
                <Overstyringsknapp overstyrer={false} toggleOverstyring={toggleOverstyring} />
            </HøyrestiltContainer>
        ) : (
            ''
        ),
    ];
    return <Periodetabell beskrivelse={tabellbeskrivelse} headere={headere} rader={rader} />;
};
