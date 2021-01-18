import React from 'react';
import { FlexColumn } from '../Flex';
import { NORSK_DATOFORMAT } from '../../utils/date';
import styled from '@emotion/styled';
import { Undertekst } from 'nav-frontend-typografi';
import { Vedtaksperiode } from 'internal-types';
import { somPenger } from '../../utils/locale';

const Container = styled(FlexColumn)`
    align-items: flex-start;
`;

const Linje = styled(Undertekst)`
    white-space: nowrap;
    user-select: text;
`;

interface HoverInfoProps {
    vedtaksperiode: Vedtaksperiode;
}

export const HoverInfo = ({ vedtaksperiode }: HoverInfoProps) => {
    const fom = vedtaksperiode.fom.format(NORSK_DATOFORMAT);
    const tom = vedtaksperiode.tom.format(NORSK_DATOFORMAT);
    const utbetalt =
        (vedtaksperiode.behandlet || vedtaksperiode.automatiskBehandlet) &&
        vedtaksperiode.utbetalingstidslinje.reduce((utbetalt, { utbetaling }) => utbetalt + (utbetaling ?? 0), 0);
    return (
        <Container>
            <Linje>
                Periode: {fom} - {tom}
            </Linje>
            {utbetalt && utbetalt !== 0 && <Linje>Utbetalt: {somPenger(utbetalt)} kr</Linje>}
        </Container>
    );
};
