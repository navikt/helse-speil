import styled from '@emotion/styled';
import classNames from 'classnames';
import { Dayjs } from 'dayjs';
import React, { ReactNode, useState } from 'react';

import { Popover } from '@navikt/ds-react';
import { PeriodProps } from '@navikt/helse-frontend-timeline/lib/components/Period';

import { NORSK_DATOFORMAT } from '@utils/date';

import { Periodeknapp, PeriodePin } from './Tidslinjeperiode.styles';

const ariaLabel = (tilstand: Tidslinjetilstand | Infotrygdperiodetilstand, fom: Dayjs, tom: Dayjs): string => {
    const fomString = fom.format(NORSK_DATOFORMAT);
    const tomString = tom.format(NORSK_DATOFORMAT);
    switch (tilstand) {
        case 'tilUtbetaling':
            return `Periode til utbetaling fra ${fomString} til ${tomString}`;
        case 'utbetalt':
            return `Utbetalt periode fra ${fomString} til ${tomString}`;
        case 'oppgaver':
            return `Periode til behandling fra ${fomString} til ${tomString}`;
        case 'venter':
        case 'venterPåKiling':
            return `Periode som venter på mer informasjon fra ${fomString} til ${tomString}`;
        case 'avslag':
            return `Avvist periode fra ${fomString} til ${tomString}`;
        case 'ingenUtbetaling':
            return `Periode uten utbetaling fra ${fomString} til ${tomString}`;
        case 'kunFerie':
            return `Ferieperiode fra ${fomString} til ${tomString}`;
        case 'kunPermisjon':
            return `Permisjonsperiode fra ${fomString} til ${tomString}`;
        case 'feilet':
            return `Periode med feil fra ${fomString} til ${tomString}`;
        case 'revurderingFeilet':
            return `Revurdert periode med feil fra ${fomString} til ${tomString}`;
        case 'tilInfotrygd':
            return `Periode som ble sendt til Infotrygd fra ${fomString} til ${tomString}`;
        case 'annullert':
            return `Annullert periode fra ${fomString} til ${tomString}`;
        case 'tilAnnullering':
            return `Periode sendt til annullering fra ${fomString} til ${tomString}`;
        case 'annulleringFeilet':
            return `Periode med feilet annullering fra ${fomString} til ${tomString}`;
        case 'utbetaltAutomatisk':
            return `Periode som er utbetalt automatisk fra ${fomString} til ${tomString}`;
        case 'tilUtbetalingAutomatisk':
            return `Periode som venter på å bli utbetalt automatisk fra ${fomString} til ${tomString}`;
        case 'revurderes':
            return `Periode som revurderes fra ${fomString} til ${tomString}`;
        case 'revurdert':
            return `Periode som har blitt revudert fra ${fomString} til ${tomString}`;
        case 'revurdertIngenUtbetaling':
            return `Revurdert periode uten utbetaling fra ${fomString} til ${tomString}`;
        case 'ukjent':
            return `Periode med ukjent tilstand fra ${fomString} til ${tomString}`;
        case 'utbetaltIInfotrygd':
            return `Periode utbetalt i Infotrygd fra ${fomString} til ${tomString}`;
        case 'infotrygdferie':
            return `Ferieperiode hentet fra Infotrygd fra ${fomString} til ${tomString}`;
        case 'infotrygdukjent':
            return `Periode fra Infotrygd med ukjent tilstand fra ${fomString} til ${tomString}`;
        case 'utenSykefravær':
            return `Arbeidsforhold uten sykefravær ${fomString} til ${tomString}`;
    }
};

const Tooltip = styled(Popover)`
    background-color: #ffffff;
    border: 1px solid var(--navds-color-gray-20);
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
    padding: 0.5rem 1rem;
`;

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
                tabIndex={0}
                onMouseOver={assignAnchor}
                onMouseOut={removeAnchor}
                onClick={onClickWrapper}
                active={erAktiv}
                className={classNames(tilstand, erForeldet ? 'foreldet' : 'gjeldende')}
                aria-label={ariaLabel(tilstand, start, end)}
                {...props}
            >
                {skalVisePin && <PeriodePin />}
            </Periodeknapp>
            {hoverLabel && (
                <Tooltip anchorEl={anchor} open={anchor !== null} onClose={removeAnchor}>
                    {hoverLabel}
                </Tooltip>
            )}
        </div>
    );
};
