import styled from '@emotion/styled';
import React from 'react';

import { Bag, Expand, Next } from '@navikt/ds-icons';

import { Flex, FlexColumn } from '../../../components/Flex';
import { TekstMedEllipsis } from '../../../components/TekstMedEllipsis';

import { Tidslinjerad } from './Tidslinjerad';
import { TidslinjeradObject } from './useTidslinjerader';

const Navn = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--navds-color-text-primary);
    line-height: 1rem;
    padding: 0 1rem 0 1.5rem;
    box-sizing: border-box;
    height: 24px;
    width: var(--tidslinje-rad-offset);
    max-width: var(--tidslinje-rad-offset);
`;

const EkspanderbartNavn = styled(Navn)`
    cursor: pointer;
    font-weight: 600;
    color: var(--navds-color-action-default);

    > svg > path {
        fill: var(--navds-color-action-default);
    }
`;

const Rader = styled(FlexColumn)`
    background-color: var(--speil-background-secondary);
    width: 100%;
    height: 100%;
    flex: 1;
`;

const ForeldedeRaderContainer = styled.div`
    padding: 6px 3px;
    margin: -3px;

    & > .row {
        margin-bottom: 0.25rem;
    }
`;

const IconContainer = styled.div`
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
`;

interface EnkelRadProps {
    rad: TidslinjeradObject;
    navn: string;
}

const EnkelRad: React.FC<EnkelRadProps> = ({ rad, navn }) => (
    <Flex alignItems="start">
        <Navn>
            <Bag title="Arbeidsgiver" />
            <Flex style={{ overflow: 'hidden' }}>
                <TekstMedEllipsis data-tip={navn}>{navn}</TekstMedEllipsis>
            </Flex>
        </Navn>
        <Rader>
            <Tidslinjerad rad={rad} erKlikkbar={true} />
        </Rader>
    </Flex>
);

interface EkspanderbarRadProps extends ArbeidsgiverradProps {}

const EkspanderbarRad: React.FC<EkspanderbarRadProps> = ({ rader, navn, id, toggleEkspanderbarRad, erEkspandert }) => (
    <Flex alignItems="start">
        <EkspanderbartNavn onClick={() => toggleEkspanderbarRad(id)}>
            <IconContainer>{erEkspandert ? <Expand /> : <Next />}</IconContainer>
            <Bag title="Arbeidsgiver" />
            <Flex style={{ overflow: 'hidden' }}>
                <TekstMedEllipsis data-tip={navn}>{navn}</TekstMedEllipsis>
            </Flex>
        </EkspanderbartNavn>
        {rader.length > 0 && (
            <Rader>
                <Tidslinjerad rad={rader[0]} erKlikkbar={true} />
                {erEkspandert && (
                    <ForeldedeRaderContainer>
                        {rader.slice(1).map((it, i) => (
                            <Tidslinjerad key={i} rad={it} erKlikkbar={true} erForeldet />
                        ))}
                    </ForeldedeRaderContainer>
                )}
            </Rader>
        )}
    </Flex>
);

interface ArbeidsgiverradProps {
    rader: TidslinjeradObject[];
    id: string;
    navn: string;
    erEkspandert: boolean;
    toggleEkspanderbarRad: (id: string) => void;
}

export const Arbeidsgiverrad = ({ rader, navn, ...rest }: ArbeidsgiverradProps) =>
    rader.length === 1 ? (
        <EnkelRad rad={rader[0]} navn={navn} />
    ) : (
        <EkspanderbarRad rader={rader} navn={navn} {...rest} />
    );
