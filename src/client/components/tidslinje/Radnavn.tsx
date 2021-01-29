import React from 'react';
import { Arbeidsgiverikon } from '../ikoner/Arbeidsgiverikon';
import { Infotrygdikon } from '../ikoner/Infotrygdikon';
import { UtbetalingerPerArbeidsgiver } from './useInfotrygdrader';
import styled from '@emotion/styled';
import { usePerson } from '../../state/person';

interface RadnavnProps {
    infotrygdrader: UtbetalingerPerArbeidsgiver;
}

const Labels = styled.div`
    margin-top: 44px;
    padding: 0 0 26px;
`;

const Label = styled.label`
    height: 1.5rem;
    margin: 0 0 1.5rem;
    display: flex;
    align-items: center;
    font-size: 14px;
    color: var(--navds-color-text-primary);

    > svg {
        margin-right: 10px;
    }
`;

const formaterArbeidsgivernavn = (navn: string) => (navn.length > 32 ? `${navn.substring(0, 32)}...` : navn);

export const Radnavn = ({ infotrygdrader }: RadnavnProps) => {
    const personTilBehandling = usePerson();
    const radnavnArbeidsgiver =
        personTilBehandling?.arbeidsgivere.map((arbeidsgiver) =>
            arbeidsgiver.navn.toLowerCase() !== 'ukjent' && arbeidsgiver.navn.toLowerCase() !== 'ikke tilgjengelig'
                ? formaterArbeidsgivernavn(arbeidsgiver.navn)
                : arbeidsgiver.organisasjonsnummer
        ) ?? [];

    const radnavnInfotrygd = Object.keys(infotrygdrader).map((organisasjonsnummer) =>
        organisasjonsnummer !== '0' ? `Infotrygd — ${organisasjonsnummer}` : `Infotrygd — Periode uten utbetaling`
    );

    return (
        <Labels>
            {radnavnArbeidsgiver.map((navn, i) => (
                <Label key={`tidslinjerad-${i}`}>
                    <Arbeidsgiverikon />
                    {navn}
                </Label>
            ))}
            {radnavnInfotrygd.map((navn, i) => (
                <Label key={`tidslinjerad-${i}`}>
                    <Infotrygdikon />
                    {navn}
                </Label>
            ))}
        </Labels>
    );
};
