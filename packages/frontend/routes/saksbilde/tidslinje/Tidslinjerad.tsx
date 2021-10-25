import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React from 'react';

import { Row } from '@navikt/helse-frontend-timeline/lib';

import { decomposedId, useMaybeAktivPeriode, useSetAktivPeriode } from '../../../state/tidslinje';

import { Tidslinjeperiode } from './Tidslinjeperiode';
import { InfotrygdradObject } from './useInfotrygdrader';
import { TidslinjeradObject } from './useTidslinjerader';

const Container = styled(Row)<{ erAktiv?: boolean }>`
    box-sizing: border-box;
    ${({ erAktiv }) =>
        erAktiv
            ? css`
                  background-color: #e5f3ff;
              `
            : css`
                  button:hover {
                      z-index: 20;
                  }
              `}
`;

interface TidslinjeradProps {
    rad: TidslinjeradObject | InfotrygdradObject;
    erKlikkbar?: boolean;
    erForeldet?: boolean;
}

export const Tidslinjerad = ({ rad, erKlikkbar = true, erForeldet = false }: TidslinjeradProps) => {
    const setAktivPeriode = useSetAktivPeriode();
    const aktivPeriode = useMaybeAktivPeriode();

    const erAktiv =
        erKlikkbar &&
        aktivPeriode &&
        rad.perioder.find((it) => {
            const { id, beregningId, unique } = decomposedId(it.id);
            return (
                id === aktivPeriode?.id && beregningId === aktivPeriode?.beregningId && unique === aktivPeriode?.unique
            );
        }) !== undefined;

    const onClick = (id: string) => {
        if (erKlikkbar) {
            setAktivPeriode(id);
        }
    };

    return (
        <Container erAktiv={erAktiv}>
            {rad.perioder.map((it, i) => {
                const { id, beregningId, unique } = decomposedId(it.id);
                return (
                    <Tidslinjeperiode
                        key={`tidslinjeperiode-${i}`}
                        id={it.id}
                        start={it.start}
                        end={it.end}
                        style={it.style}
                        tilstand={it.tilstand}
                        erForeldet={erForeldet}
                        hoverLabel={it.hoverLabel ? it.hoverLabel : undefined}
                        skalVisePin={!erForeldet ? it.skalVisePin : false}
                        onClick={() => onClick(it.id)}
                        erAktiv={
                            erKlikkbar &&
                            id === aktivPeriode?.id &&
                            beregningId === aktivPeriode?.beregningId &&
                            aktivPeriode?.unique === unique
                        }
                    />
                );
            })}
        </Container>
    );
};
