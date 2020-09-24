import { InfotrygdTypetekst, Infotrygdutbetaling, Person } from 'internal-types';
import React, { useMemo } from 'react';
import { v4 as uuid } from 'uuid';
import { NORSK_DATOFORMAT } from '../../utils/date';
import styled from '@emotion/styled';
import { Sykepengeperiode, Vedtaksperiodetilstand } from '@navikt/helse-frontend-tidslinje';

export type UtbetalingerPerArbeidsgiver = { [organisasjonsnummer: string]: Sykepengeperiode[] };

const Label = styled.div`
    display: flex;
    flex-direction: column;
    align-items: start;
`;

const Tekst = styled.p`
    font-family: 'Source Sans Pro', Arial, Helvetica, sans-serif;
    font-size: 14px;
    white-space: nowrap;
`;

const status = (typetekst: InfotrygdTypetekst) => {
    switch (typetekst) {
        case InfotrygdTypetekst.UTBETALING:
        case InfotrygdTypetekst.ARBEIDSGIVERREFUSJON:
            return Vedtaksperiodetilstand.UtbetaltIInfotrygd;
        case InfotrygdTypetekst.FERIE:
            return Vedtaksperiodetilstand.Infotrygdferie;
        default:
            return Vedtaksperiodetilstand.Infotrygdukjent;
    }
};

const toSykepengeperiode = (infotrygdutbetaling: Infotrygdutbetaling): Sykepengeperiode => ({
    id: uuid(),
    fom: infotrygdutbetaling.fom.toDate(),
    tom: infotrygdutbetaling.tom.toDate(),
    status: status(infotrygdutbetaling.typetekst),
    disabled: true,
    disabledLabel: (
        <Label>
            <Tekst>
                {`Sykepenger (${infotrygdutbetaling.fom.format(NORSK_DATOFORMAT)} - ${infotrygdutbetaling.tom.format(
                    NORSK_DATOFORMAT
                )})`}
            </Tekst>
            <Tekst>{`Type: ${infotrygdutbetaling.typetekst}`}</Tekst>
            {infotrygdutbetaling.grad !== undefined && <Tekst>{`Grad: ${infotrygdutbetaling.grad}%`}</Tekst>}
            {infotrygdutbetaling.dagsats !== undefined && <Tekst>{`Dagsats: ${infotrygdutbetaling.dagsats} kr`}</Tekst>}
        </Label>
    ),
});

export const useInfotrygdrader = (person?: Person): UtbetalingerPerArbeidsgiver =>
    useMemo(
        () =>
            person?.infotrygdutbetalinger.reduce((rader: UtbetalingerPerArbeidsgiver, utbetaling) => {
                const infotrygdtidslinje = rader[utbetaling.organisasjonsnummer];
                const nyTidslinje =
                    infotrygdtidslinje !== undefined
                        ? [...infotrygdtidslinje, toSykepengeperiode(utbetaling)]
                        : [toSykepengeperiode(utbetaling)];
                return { ...rader, [utbetaling.organisasjonsnummer]: nyTidslinje };
            }, {}) ?? {},
        [person]
    );
