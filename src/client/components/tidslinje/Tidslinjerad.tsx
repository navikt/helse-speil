import { TidslinjeradObject } from './useTidslinjerader';
import { InfotrygdradObject } from './useInfotrygdrader';
import { useAktivVedtaksperiode, useSetAktivVedtaksperiode } from '../../state/vedtaksperiode';
import styled from '@emotion/styled';
import { Row } from '@navikt/helse-frontend-timeline/lib';
import { Tidslinjeperiode } from './Tidslinjeperiode';
import { TidslinjeTooltip } from './TidslinjeTooltip';
import React from 'react';

interface TidslinjeradProps {
    rad: TidslinjeradObject | InfotrygdradObject;
    index: number;
    erKlikkbar: boolean;
}

export const Tidslinjerad = ({ rad, index, erKlikkbar = true }: TidslinjeradProps) => {
    const setAktivVedtaksperiode = useSetAktivVedtaksperiode();
    const aktivVedtaksperiode = useAktivVedtaksperiode();

    const erAktiv = erKlikkbar && !!rad.perioder.find((it) => it.id === aktivVedtaksperiode?.id);

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
        margin-bottom: 10px;
    `;

    return (
        <Tidslinjerad erAktiv={erAktiv} key={index}>
            {rad.perioder.map((it, index) => (
                <Tidslinjeperiode
                    key={index}
                    id={it.id}
                    style={it.style}
                    className={it.tilstand}
                    hoverLabel={it.hoverLabel ? <TidslinjeTooltip>{it.hoverLabel}</TidslinjeTooltip> : undefined}
                    skalVisePin={it.skalVisePin}
                    onClick={erKlikkbar ? setAktivVedtaksperiode : undefined}
                    erAktiv={erKlikkbar ? it.id === aktivVedtaksperiode?.id : false}
                />
            ))}
        </Tidslinjerad>
    );
};
