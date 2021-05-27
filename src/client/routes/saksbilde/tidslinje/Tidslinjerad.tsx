import styled from '@emotion/styled';
import React from 'react';

import { Row } from '@navikt/helse-frontend-timeline/lib';

import { useAktivPeriode, useSetAktivPeriode } from '../../../state/tidslinje';

import { TidslinjeTooltip } from './TidslinjeTooltip';
import { Tidslinjeperiode } from './Tidslinjeperiode';
import { InfotrygdradObject } from './useInfotrygdrader';
import { TidslinjeradObject } from './useTidslinjerader';

const Container = styled(Row)<{ erAktiv: boolean }>`
    ${({ erAktiv }) =>
        erAktiv
            ? `
    background-color: #E5F3FF;
    `
            : `
    button:hover {
        z-index: 20;
    }
    `}
    box-sizing: border-box;
`;

interface TidslinjeradProps {
    rad: TidslinjeradObject | InfotrygdradObject;
    erKlikkbar?: boolean;
    erForeldet?: boolean;
}

export const Tidslinjerad = ({ rad, erKlikkbar = true, erForeldet = false }: TidslinjeradProps) => {
    const setAktivPeriode = useSetAktivPeriode();
    const aktivPeriode = useAktivPeriode();

    const erAktiv = erKlikkbar && !!rad.perioder.find((it) => it.id === aktivPeriode?.id);

    const onClick = (id: string) => {
        if (erKlikkbar) {
            setAktivPeriode(id);
        }
    };

    return (
        <Container erAktiv={erAktiv}>
            {rad.perioder.reverse().map((it) => (
                <Tidslinjeperiode
                    key={`${it.id}`}
                    id={it.id}
                    style={it.style}
                    tilstand={it.tilstand}
                    erForeldet={erForeldet}
                    hoverLabel={it.hoverLabel ? <TidslinjeTooltip>{it.hoverLabel}</TidslinjeTooltip> : undefined}
                    skalVisePin={it.skalVisePin}
                    onClick={onClick}
                    erAktiv={erKlikkbar && it.id === aktivPeriode?.id}
                />
            ))}
        </Container>
    );
};
