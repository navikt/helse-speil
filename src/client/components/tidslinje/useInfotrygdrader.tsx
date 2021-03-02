import { InfotrygdTypetekst, Infotrygdutbetaling, Person } from 'internal-types';
import React, { useMemo } from 'react';
import { NORSK_DATOFORMAT } from '../../utils/date';
import styled from '@emotion/styled';
import { Sykepengeperiode, Vedtaksperiodetilstand } from '@navikt/helse-frontend-tidslinje';
import { nanoid } from 'nanoid';
import { getPositionedPeriods } from '@navikt/helse-frontend-timeline/src/components/calc';
import { TidslinjeperiodeObject } from './Tidslinje.types';
import { PeriodObject } from '@navikt/helse-frontend-timeline/lib';
import { Dayjs } from 'dayjs';
import { arbeidsgiverNavn } from './Tidslinje';
import { getAnonymArbeidsgiverForOrgnr } from '../../agurkdata';

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

interface InfotrygdperiodeObject extends PeriodObject {
    tilstand: Vedtaksperiodetilstand;
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

export const useInfotrygdrader = (person: Person, fom: Dayjs, tom: Dayjs, anonymiseringEnabled: boolean) =>
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
            .map(([organisasjonsnummer, perioder]) => [
                `Infotrygd - ${
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
                getPositionedPeriods(fom.toDate(), tom.toDate(), perioder, 'right'),
            ]) as [string, TidslinjeperiodeObject[]][];
    }, [person, fom, tom, anonymiseringEnabled]);
