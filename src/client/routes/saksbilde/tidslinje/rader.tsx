import styled from '@emotion/styled';
import React from 'react';

import { Flex, FlexColumn } from '../../../components/Flex';
import { TekstMedEllipsis } from '../../../components/TekstMedEllipsis';
import { Arbeidsgiverikon } from '../../../components/ikoner/Arbeidsgiverikon';
import { Infotrygdikon } from '../../../components/ikoner/Infotrygdikon';

import { EkspanderRaderKnapp } from './EkspanderRaderKnapp';
import { Tidslinjerad } from './Tidslinjerad';
import { InfotrygdradObject } from './useInfotrygdrader';
import { TidslinjeradObject } from './useTidslinjerader';

const Arbeidsgivernavn = styled(Flex)`
    align-items: center;
    font-size: 14px;
    color: var(--navds-color-text-primary);
    line-height: 1rem;
    padding-right: 1rem;
    box-sizing: border-box;

    > svg:first-of-type {
        margin-right: 1rem;
    }

    width: var(--tidslinje-rad-offset);
`;

const Rader = styled(FlexColumn)`
    width: 100%;
    height: 100%;
    flex: 1;

    > *:not(:last-of-type) {
        margin-bottom: 1rem;
    }
`;

interface ArbeidsgiverradProps {
    rader: TidslinjeradObject[];
    id: string;
    navn: string;
    erEkspandert: boolean;
    toggleEkspanderbarRad: (id: string) => void;
}

const Arbeidsgiver = ({ rader, navn, id, toggleEkspanderbarRad, erEkspandert }: ArbeidsgiverradProps) => (
    <Flex alignItems="start">
        <Arbeidsgivernavn>
            <Arbeidsgiverikon />
            <TekstMedEllipsis style={{ flex: 1 }} data-tip="Arbeidsgiver">
                {navn}
            </TekstMedEllipsis>
            {rader.length > 1 && (
                <EkspanderRaderKnapp onClick={() => toggleEkspanderbarRad(id)} erAktiv={erEkspandert} />
            )}
        </Arbeidsgivernavn>
        <Rader>
            <Tidslinjerad key="tidslinjerad-0" rad={rader[0]} erKlikkbar={true} />
            {erEkspandert &&
                rader
                    .slice(1)
                    .map((it, i) => (
                        <Tidslinjerad key={`tidslinjerad-${i + 1}`} rad={it} erKlikkbar={true} erForeldet />
                    ))}
        </Rader>
    </Flex>
);

interface InfotrygdradProps {
    rad: InfotrygdradObject;
    navn: string;
}

const Infotrygd = ({ rad, navn }: InfotrygdradProps) => (
    <Flex alignItems="start">
        <Arbeidsgivernavn>
            <Infotrygdikon />
            <TekstMedEllipsis data-tip="Arbeidsgiver (Infotrygd)">{navn}</TekstMedEllipsis>
        </Arbeidsgivernavn>
        <Rader>
            <Tidslinjerad rad={rad} erKlikkbar={false} />
        </Rader>
    </Flex>
);

export const Rad = {
    Arbeidsgiver,
    Infotrygd,
};
