import styled from '@emotion/styled';
import { Dayjs } from 'dayjs';
import { nanoid } from 'nanoid';
import React, { useMemo } from 'react';

import { getPositionedPeriods, PeriodObject } from '@navikt/helse-frontend-timeline/lib';

import { NORSK_DATOFORMAT } from '@utils/date';

import { TidslinjeperiodeObject } from './Tidslinje.types';
import { TidslinjeradObject } from './useTidslinjerader';

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

const status = (typetekst: Infotrygdutbetaling['typetekst']): Infotrygdperiodetilstand => {
    switch (typetekst) {
        case 'Utbetaling':
        case 'ArbRef':
            return 'utbetaltIInfotrygd';
        case 'Ferie':
            return 'infotrygdferie';
        default:
            return 'infotrygdukjent';
    }
};

interface InfotrygdperiodeObject extends PeriodObject {
    tilstand: Infotrygdperiodetilstand;
}

type Infotrygdrader = { [arbeidsgiver: string]: InfotrygdperiodeObject[] };

const hoverLabel = (infotrygdutbetaling: Infotrygdutbetaling) => (
    <Label>
        <Tekst>Behandlet i Infotrygd</Tekst>
        <Tekst>
            {`Sykepenger (${infotrygdutbetaling.fom.format(NORSK_DATOFORMAT)} - ${infotrygdutbetaling.tom.format(
                NORSK_DATOFORMAT
            )})`}
        </Tekst>
        <Tekst>{`Type: ${infotrygdutbetaling.typetekst}`}</Tekst>
        {infotrygdutbetaling.grad !== undefined && <Tekst>{`Grad: ${infotrygdutbetaling.grad} %`}</Tekst>}
        {infotrygdutbetaling.dagsats !== undefined && <Tekst>{`Dagsats: ${infotrygdutbetaling.dagsats} kr`}</Tekst>}
    </Label>
);

export const useInfotrygdrader = (person: Person, fom: Dayjs, tom: Dayjs): TidslinjeradObject[] =>
    useMemo(() => {
        const infotrygdutbetalinger = person.infotrygdutbetalinger.reduce((rader: Infotrygdrader, utbetalingen) => {
            const infotrygdtidslinje = rader[utbetalingen.organisasjonsnummer];
            const periode = {
                id: nanoid(),
                start: utbetalingen.fom.toDate(),
                end: utbetalingen.tom.toDate(),
                tilstand: status(utbetalingen.typetekst),
                hoverLabel: hoverLabel(utbetalingen),
                skalVisePin: false,
            };
            const nyTidslinje: InfotrygdperiodeObject[] =
                infotrygdtidslinje !== undefined ? [...infotrygdtidslinje, periode] : [periode];
            return { ...rader, [utbetalingen.organisasjonsnummer]: nyTidslinje };
        }, {});

        return Object.entries(infotrygdutbetalinger)
            .sort(
                (a, b) =>
                    person.arbeidsgivere?.findIndex((arb) => a[0] === arb.organisasjonsnummer) -
                    person.arbeidsgivere?.findIndex((arb) => b[0] === arb.organisasjonsnummer)
            )
            .map(([organisasjonsnummer, perioder]) => {
                const arbeidsgiver = person.arbeidsgivere.find((it) => it.organisasjonsnummer === organisasjonsnummer);
                return {
                    id: organisasjonsnummer,
                    arbeidsgiver: arbeidsgiver?.organisasjonsnummer ?? '',
                    erAktiv: false,
                    perioder: getPositionedPeriods(
                        fom.toDate(),
                        tom.toDate(),
                        perioder,
                        'right'
                    ) as TidslinjeperiodeObject[],
                };
            }) as TidslinjeradObject[];
    }, [person, fom, tom]);
