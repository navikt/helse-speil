import { Infotrygdtypetekst, Infotrygdutbetaling, Person, Vedtaksperiode } from '../../context/types.internal';
import { Sykepengeperiode, Vedtaksperiodetilstand } from '@navikt/helse-frontend-tidslinje';
import React, { useMemo } from 'react';
import uuid from 'uuid';
import { NORSK_DATOFORMAT } from '../../utils/date';
import styled from '@emotion/styled';

export interface Infotrygdtidslinje {
    perioder: Sykepengeperiode[];
    organisasjonsnummer: string;
}

type UtbetalingerPerArbeidsgiver = { [key: string]: { perioder: any[]; organisasjonsnummer: string } };

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

const status = (typetekst: Infotrygdtypetekst) => {
    switch (typetekst) {
        case Infotrygdtypetekst.UTBETALING:
        case Infotrygdtypetekst.ARBEIDSGIVERREFUSJON:
            return Vedtaksperiodetilstand.UtbetaltIInfotrygd;
        case Infotrygdtypetekst.FERIE:
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
    )
});

export const useInfotrygdrader = (person?: Person, aktivVedtaksperiode?: Vedtaksperiode) =>
    useMemo(() => {
        const tidslinjer =
            person?.infotrygdutbetalinger.reduce((rader: UtbetalingerPerArbeidsgiver, utbetaling) => {
                const infotrygdtidslinje = rader[utbetaling.organisasjonsnummer];
                if (infotrygdtidslinje !== undefined) {
                    return {
                        ...rader,
                        [utbetaling.organisasjonsnummer]: {
                            ...infotrygdtidslinje,
                            perioder: [...infotrygdtidslinje.perioder, toSykepengeperiode(utbetaling)]
                        }
                    };
                } else {
                    return {
                        ...rader,
                        [utbetaling.organisasjonsnummer]: {
                            perioder: [toSykepengeperiode(utbetaling)],
                            organisasjonsnummer: utbetaling.organisasjonsnummer
                        }
                    };
                }
            }, {}) ?? {};
        return Object.values(tidslinjer);
    }, [person, aktivVedtaksperiode]);
