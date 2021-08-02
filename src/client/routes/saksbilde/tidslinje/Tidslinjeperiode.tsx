import styled from '@emotion/styled';
import classNames from 'classnames';
import { Infotrygdperiodetilstand, Tidslinjetilstand } from 'internal-types';
import React, { ReactNode, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';

import Popover from 'nav-frontend-popover';

import { PeriodProps } from '@navikt/helse-frontend-timeline/lib/components/Period';

import { prideifisertState } from '../../../components/ikoner/VimpelMedPalmeIkon';

import { Periodeknapp, PeriodePin } from './Tidslinjeperiode.styles';

interface TidslinjeperiodeProps extends PeriodProps {
    id: string;
    style: React.CSSProperties;
    tilstand: Tidslinjetilstand | Infotrygdperiodetilstand;
    erAktiv?: boolean;
    erForeldet?: boolean;
    hoverLabel?: ReactNode;
    skalVisePin: boolean;
}

const Tooltip = styled(Popover)`
    background-color: #ffffff;
    border: 1px solid var(--navds-color-gray-20);
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
    padding: 0.5rem 1rem;
`;

export const Tidslinjeperiode = ({
    hoverLabel,
    erAktiv,
    tilstand,
    erForeldet,
    skalVisePin,
    ...props
}: TidslinjeperiodeProps) => {
    const ref = useRef<HTMLButtonElement>(null);
    const [anchor, setAnchor] = useState<HTMLButtonElement | undefined>(undefined);
    const erPrideifisert = useRecoilValue(prideifisertState);

    return (
        <div
            onMouseOver={(_) => setAnchor(ref.current!)}
            onMouseOut={() => setAnchor(undefined)}
            data-testid={`tidslinjeperiode-${props.id}`}
        >
            <Periodeknapp
                erAktiv={erAktiv}
                ref={ref}
                className={classNames(tilstand, erForeldet ? 'foreldet' : 'gjeldende', erPrideifisert ? 'pride' : '')}
                {...props}
            >
                {skalVisePin && <PeriodePin />}
            </Periodeknapp>
            <Tooltip autoFokus={false} ankerEl={anchor}>
                {hoverLabel}
            </Tooltip>
        </div>
    );
};
