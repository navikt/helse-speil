import React, { useContext } from 'react';
import Arbeidsgiverikon from '../Ikon/Arbeidsgiverikon';
import Infotrygdikon from '../Ikon/Infotrygdikon';
import { PersonContext } from '../../context/PersonContext';
import { Infotrygdrad } from './useInfotrygdrader';
import styled from '@emotion/styled';

interface RadnavnProps {
    infotrygdrader: Infotrygdrad[];
}

const Labels = styled.div`
    padding: 14px 0;
`;

const Label = styled.label`
    height: 24px;
    margin: 0.25rem 0;
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #3e3832;

    > svg {
        margin-right: 10px;
    }
`;

export const Radnavn = ({ infotrygdrader }: RadnavnProps) => {
    const { personTilBehandling } = useContext(PersonContext);
    const radnavnArbeidsgiver =
        personTilBehandling?.arbeidsgivere.map((arbeidsgiver) =>
            arbeidsgiver.navn !== 'ukjent' ? arbeidsgiver.navn : arbeidsgiver.organisasjonsnummer
        ) ?? [];

    const radnavnInfotrygd = infotrygdrader.flatMap((rad) =>
        rad.organisasjonsnummer !== '0'
            ? `Infotrygd — ${rad.organisasjonsnummer}`
            : `Infotrygd — Periode uten utbetaling`
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
