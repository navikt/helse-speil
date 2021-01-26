import React from 'react';
import { FlexColumn } from '../Flex';
import { NORSK_DATOFORMAT } from '../../utils/date';
import styled from '@emotion/styled';
import { Undertekst } from 'nav-frontend-typografi';
import { Dagtype, UfullstendigVedtaksperiode, Vedtaksperiode } from 'internal-types';
import { somPenger } from '../../utils/locale';

const Container = styled(FlexColumn)`
    align-items: flex-start;
`;

const Linje = styled(Undertekst)`
    white-space: nowrap;
    user-select: text;
`;

const utbetaltForPeriode = (vedtaksperiode: Vedtaksperiode | UfullstendigVedtaksperiode): number | undefined => {
    if (vedtaksperiode.kanVelges) {
        const { behandlet, automatiskBehandlet, utbetalingstidslinje } = vedtaksperiode as Vedtaksperiode;
        return (
            ((behandlet || automatiskBehandlet) &&
                utbetalingstidslinje.reduce((utbetalt, { utbetaling }) => utbetalt + (utbetaling ?? 0), 0)) ||
            undefined
        );
    } else {
        return undefined;
    }
};

const antallArbeidsgiverperiodedager = (vedtaksperiode: Vedtaksperiode | UfullstendigVedtaksperiode): number =>
    vedtaksperiode.utbetalingstidslinje?.filter(({ type }) => type === Dagtype.Arbeidsgiverperiode).length ?? 0;

const antallFeriedager = (vedtaksperiode: Vedtaksperiode | UfullstendigVedtaksperiode): number =>
    vedtaksperiode.utbetalingstidslinje?.filter(({ type }) => type === Dagtype.Ferie).length ?? 0;

interface HoverInfoProps {
    vedtaksperiode: Vedtaksperiode | UfullstendigVedtaksperiode;
}

export const HoverInfo = ({ vedtaksperiode }: HoverInfoProps) => {
    const fom = vedtaksperiode.fom.format(NORSK_DATOFORMAT);
    const tom = vedtaksperiode.tom.format(NORSK_DATOFORMAT);

    const utbetalt = utbetaltForPeriode(vedtaksperiode);
    const arbeidsgiverperiodedager = antallArbeidsgiverperiodedager(vedtaksperiode);
    const feriedager = antallFeriedager(vedtaksperiode);

    return (
        <Container>
            <Linje>
                Periode: {fom} - {tom}
            </Linje>
            {utbetalt && utbetalt !== 0 && <Linje>Utbetalt: {somPenger(utbetalt)} kr</Linje>}
            {arbeidsgiverperiodedager !== 0 && <Linje>Arbeidsgiverperiode: {arbeidsgiverperiodedager} dager</Linje>}
            {feriedager !== 0 && <Linje>Ferie: {feriedager} dager</Linje>}
        </Container>
    );
};
