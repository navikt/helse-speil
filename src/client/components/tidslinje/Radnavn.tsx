import React, { useContext } from 'react';
import { Arbeidsgiverikon } from '../ikoner/Arbeidsgiverikon';
import { Infotrygdikon } from '../ikoner/Infotrygdikon';
import { PersonContext } from '../../context/PersonContext';
import { UtbetalingerPerArbeidsgiver } from './useInfotrygdrader';
import styled from '@emotion/styled';

interface RadnavnProps {
    infotrygdrader: UtbetalingerPerArbeidsgiver;
}

const Labels = styled.div`
    margin-top: 56px;
    padding: 0 0 26px;
`;

const Label = styled.label`
    height: 1.5rem;
    margin: 1.56rem 0;
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #3e3832;

    > svg {
        margin-right: 10px;
    }
`;

const formaterArbeidsgivernavn = (navn: string) => (navn.length > 32 ? `${navn.substring(0, 32)}...` : navn);

export const Radnavn = ({ infotrygdrader }: RadnavnProps) => {
    const { personTilBehandling } = useContext(PersonContext);
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
