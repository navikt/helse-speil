import styled from '@emotion/styled';
import classNames from 'classnames';
import { Dayjs } from 'dayjs';
import { Infotrygdperiodetilstand, Tidslinjetilstand } from 'internal-types';
import React, { ReactNode, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { Popover } from '@navikt/ds-react';
import { PeriodProps } from '@navikt/helse-frontend-timeline/lib/components/Period';

import { prideifisertState } from '../../../components/ikoner/VimpelMedPalmeIkon';
import { NORSK_DATOFORMAT } from '../../../utils/date';

import { Periodeknapp, PeriodePin } from './Tidslinjeperiode.styles';

const ariaLabel = (tilstand: Tidslinjetilstand | Infotrygdperiodetilstand, fom: Dayjs, tom: Dayjs): string => {
    const fomString = fom.format(NORSK_DATOFORMAT);
    const tomString = tom.format(NORSK_DATOFORMAT);
    switch (tilstand) {
        case Tidslinjetilstand.TilUtbetaling:
            return `Periode til utbetaling fra ${fomString} til ${tomString}`;
        case Tidslinjetilstand.Utbetalt:
            return `Utbetalt periode fra ${fomString} til ${tomString}`;
        case Tidslinjetilstand.Oppgaver:
            return `Periode til behandling fra ${fomString} til ${tomString}`;
        case Tidslinjetilstand.Venter:
        case Tidslinjetilstand.VenterPåKiling:
            return `Periode som venter på mer informasjon fra ${fomString} til ${tomString}`;
        case Tidslinjetilstand.Avslag:
            return `Avvist periode fra ${fomString} til ${tomString}`;
        case Tidslinjetilstand.IngenUtbetaling:
            return `Periode uten utbetaling fra ${fomString} til ${tomString}`;
        case Tidslinjetilstand.KunFerie:
            return `Ferieperiode fra ${fomString} til ${tomString}`;
        case Tidslinjetilstand.KunPermisjon:
            return `Permisjonsperiode fra ${fomString} til ${tomString}`;
        case Tidslinjetilstand.Feilet:
            return `Periode med feil fra ${fomString} til ${tomString}`;
        case Tidslinjetilstand.TilInfotrygd:
            return `Periode som ble sendt til Infotrygd fra ${fomString} til ${tomString}`;
        case Tidslinjetilstand.Annullert:
            return `Annullert periode fra ${fomString} til ${tomString}`;
        case Tidslinjetilstand.TilAnnullering:
            return `Periode sendt til annullering fra ${fomString} til ${tomString}`;
        case Tidslinjetilstand.AnnulleringFeilet:
            return `Periode med feilet annullering fra ${fomString} til ${tomString}`;
        case Tidslinjetilstand.UtbetaltAutomatisk:
            return `Periode som er utbetalt automatisk fra ${fomString} til ${tomString}`;
        case Tidslinjetilstand.TilUtbetalingAutomatisk:
            return `Periode som venter på å bli utbetalt automatisk fra ${fomString} til ${tomString}`;
        case Tidslinjetilstand.Revurderes:
            return `Periode som revurderes fra ${fomString} til ${tomString}`;
        case Tidslinjetilstand.Revurdert:
            return `Periode som har blitt revudert fra ${fomString} til ${tomString}`;
        case Tidslinjetilstand.RevurdertIngenUtbetaling:
            return `Revurdert periode uten utbetaling fra ${fomString} til ${tomString}`;
        case Tidslinjetilstand.Ukjent:
            return `Periode med ukjent tilstand fra ${fomString} til ${tomString}`;
        case Infotrygdperiodetilstand.UtbetaltIInfotrygd:
            return `Periode utbetalt i Infotrygd fra ${fomString} til ${tomString}`;
        case Infotrygdperiodetilstand.Infotrygdferie:
            return `Ferieperiode hentet fra Infotrygd fra ${fomString} til ${tomString}`;
        case Infotrygdperiodetilstand.Infotrygdukjent:
            return `Periode fra Infotrygd med ukjent tilstand fra ${fomString} til ${tomString}`;
    }
};

interface TidslinjeperiodeProps extends PeriodProps {
    id: string;
    start: Dayjs;
    end: Dayjs;
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
    start,
    end,
    hoverLabel,
    erAktiv,
    tilstand,
    erForeldet,
    skalVisePin,
    onClick,
    ...props
}: TidslinjeperiodeProps) => {
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);
    const erPrideifisert = useRecoilValue(prideifisertState);

    const onClickWrapper = (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        setAnchor((anchor) => (anchor ? null : event.currentTarget));
    };

    const assignAnchor = (event: React.MouseEvent<HTMLElement>) => {
        setAnchor(event.currentTarget);
    };

    const removeAnchor = () => {
        setAnchor(null);
    };

    return (
        <div data-testid={`tidslinjeperiode-${props.id}`}>
            <Periodeknapp
                onMouseOver={assignAnchor}
                onMouseOut={removeAnchor}
                onClick={onClickWrapper}
                active={erAktiv}
                className={classNames(tilstand, erForeldet ? 'foreldet' : 'gjeldende', erPrideifisert ? 'pride' : '')}
                aria-label={ariaLabel(tilstand, start, end)}
                {...props}
            >
                {skalVisePin && <PeriodePin />}
            </Periodeknapp>
            <Tooltip anchorEl={anchor} open={anchor !== null} onClose={removeAnchor}>
                {hoverLabel}
            </Tooltip>
        </div>
    );
};
