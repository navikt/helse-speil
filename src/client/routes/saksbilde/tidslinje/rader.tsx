import styled from '@emotion/styled';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

import NavFrontendChevron from 'nav-frontend-chevron';

import { Button } from '../../../components/Button';
import { Flex, FlexColumn } from '../../../components/Flex';
import { TekstMedEllipsis } from '../../../components/TekstMedEllipsis';
import { Arbeidsgiverikon } from '../../../components/ikoner/Arbeidsgiverikon';
import { Infotrygdikon } from '../../../components/ikoner/Infotrygdikon';

import { Tidslinjerad } from './Tidslinjerad';
import { InfotrygdradObject } from './useInfotrygdrader';
import { TidslinjeradObject } from './useTidslinjerader';

const Arbeidsgivernavn = styled(Flex)`
    align-items: center;
    font-weight: 400;
    font-size: 14px;
    color: var(--navds-color-text-primary);
    line-height: 1rem;
    padding-right: 1rem;
    box-sizing: border-box;
    height: 24px;

    > svg:first-of-type {
        margin-right: 1rem;
    }
    width: var(--tidslinje-rad-offset);
`;

const KlikkbarArbeidsgivernavn = styled(Arbeidsgivernavn)`
    color: var(--navds-color-action-default);
    font-weight: 600;
    font-size: 16px;
    cursor: pointer;
    > button,
    svg {
        > path {
            fill: var(--navds-color-action-default);
        }
        color: var(--navds-color-action-default);
    }
`;

const Rader = styled(FlexColumn)`
    background-color: var(--speil-background-secondary);
    width: 100%;
    height: 100%;
    flex: 1;
`;

interface ArbeidsgiverradProps {
    rader: TidslinjeradObject[];
    id: string;
    navn: string;
    erEkspandert: boolean;
    toggleEkspanderbarRad: (id: string) => void;
}

interface ArbeidsgiverInfoProps {
    navn: string;
}

const ForeldedeRaderContainer = styled.div`
    margin-top: 0.375rem;

    & > .row {
        margin-bottom: 0.25rem;
    }
`;

const FlexSpan = styled.span`
    display: flex;
`;

const StyledChevron = styled(NavFrontendChevron)`
    margin-right: 0.5rem;
`;

const ArbeidsgiverInfo = ({ navn }: ArbeidsgiverInfoProps) => (
    <>
        <Arbeidsgiverikon />
        <FlexSpan>
            <TekstMedEllipsis data-tip="Arbeidsgiver">{navn}</TekstMedEllipsis>
        </FlexSpan>
    </>
);

const Arbeidsgiver = ({ rader, navn, id, toggleEkspanderbarRad, erEkspandert }: ArbeidsgiverradProps) => (
    <Flex alignItems="start">
        {rader.length > 1 ? (
            <Button onClick={() => toggleEkspanderbarRad(id)}>
                <KlikkbarArbeidsgivernavn>
                    <StyledChevron type={erEkspandert ? 'ned' : 'høyre'} />
                    <ArbeidsgiverInfo navn={navn} />
                </KlikkbarArbeidsgivernavn>
            </Button>
        ) : (
            <Arbeidsgivernavn>
                <ArbeidsgiverInfo navn={navn} />
            </Arbeidsgivernavn>
        )}
        {rader.length > 0 && (
            <Rader>
                <Tidslinjerad key="tidslinjerad-0" rad={rader[0]} erKlikkbar={true} />
                <AnimatePresence>
                    {erEkspandert && (
                        <ForeldedeRaderContainer style={{ overflow: 'hidden', padding: '6px 3px', margin: -3 }}>
                            {rader.slice(1).map((it, i) => (
                                <motion.div
                                    key={`tidslinjerad-${i + 1}`}
                                    initial={{ height: 0 }}
                                    animate={{ height: 'max-content' }}
                                    exit={{ height: 0 }}
                                    transition={{
                                        type: 'tween',
                                        ease: 'easeInOut',
                                        duration: 0.1,
                                    }}
                                >
                                    <Tidslinjerad rad={it} erKlikkbar={true} erForeldet />
                                </motion.div>
                            ))}
                        </ForeldedeRaderContainer>
                    )}
                </AnimatePresence>
            </Rader>
        )}
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
