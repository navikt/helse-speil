import { TidslinjeradObject } from './useTidslinjerader';
import { InfotrygdradObject } from './useInfotrygdrader';
import styled from '@emotion/styled';
import { Row } from '@navikt/helse-frontend-timeline/lib';
import { Tidslinjeperiode } from './Tidslinjeperiode';
import { TidslinjeTooltip } from './TidslinjeTooltip';
import React from 'react';
import { useAktivPeriode, useSetAktivPeriode } from '../../state/tidslinje';

interface TidslinjeradProps {
    rad: TidslinjeradObject | InfotrygdradObject;
    index: number;
    erKlikkbar: boolean;
    erForeldet?: boolean;
}

export const Tidslinjerad = ({ rad, index, erKlikkbar = true, erForeldet = false }: TidslinjeradProps) => {
    const setAktivPeriode = useSetAktivPeriode();
    const aktivPeriode = useAktivPeriode();

    const erAktiv = erKlikkbar && !!rad.perioder.find((it) => it.id === aktivPeriode?.id);
    const Tidslinjerad = styled(Row)<{ erAktiv: boolean }>`
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

    return (
        <Tidslinjerad erAktiv={erAktiv} key={index}>
            {rad.perioder.reverse().map((it, periodeIndex) => (
                <Tidslinjeperiode
                    key={index + periodeIndex}
                    id={it.id}
                    style={it.style}
                    tilstand={it.tilstand}
                    erForeldet={erForeldet}
                    hoverLabel={it.hoverLabel ? <TidslinjeTooltip>{it.hoverLabel}</TidslinjeTooltip> : undefined}
                    skalVisePin={it.skalVisePin}
                    onClick={erKlikkbar ? setAktivPeriode : undefined}
                    erAktiv={erKlikkbar ? it.id === aktivPeriode?.id : false}
                />
            ))}
        </Tidslinjerad>
    );
};
