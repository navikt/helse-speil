import styled from '@emotion/styled';
import { Dayjs } from 'dayjs';
import { nanoid } from 'nanoid';
import React, { useMemo } from 'react';

import { getPositionedPeriods } from '@navikt/helse-frontend-timeline/lib';
import { PeriodObject } from '@navikt/helse-frontend-timeline/lib';

import { NORSK_DATOFORMAT } from '../../../utils/date';

import { getAnonymArbeidsgiverForOrgnr } from '../../../agurkdata';
import { arbeidsgiverNavn } from './Tidslinje';
import { TidslinjeperiodeObject } from './Tidslinje.types';

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

export type InfotrygdradObject = {
    arbeidsgivernavn: string;
    perioder: TidslinjeperiodeObject[];
};

export const useInfotrygdrader = (
    person: Person,
    fom: Dayjs,
    tom: Dayjs,
    anonymiseringEnabled: boolean
): InfotrygdradObject[] =>
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
            .map(([organisasjonsnummer, perioder]) => ({
                arbeidsgivernavn: `Infotrygd - ${
                    person.arbeidsgivere
                        .filter((it) => it.organisasjonsnummer === organisasjonsnummer)
                        .map((arb) => arbeidsgiverNavn(arb, anonymiseringEnabled))
                        .pop() ??
                    (organisasjonsnummer !== '0'
                        ? anonymiseringEnabled
                            ? getAnonymArbeidsgiverForOrgnr(organisasjonsnummer).navn
                            : organisasjonsnummer
                        : 'Ingen utbetaling')
                }`,
                perioder: getPositionedPeriods(fom.toDate(), tom.toDate(), perioder, 'right'),
            })) as InfotrygdradObject[];
    }, [person, fom, tom, anonymiseringEnabled]);
