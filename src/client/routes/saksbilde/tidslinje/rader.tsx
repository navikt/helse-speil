import { css } from '@emotion/react';
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

const arbeidsgivernavnStyle = css`
    display: flex;
    align-items: center;
    color: var(--navds-color-text-primary);
    line-height: 1rem;
    padding-right: 1rem;
    box-sizing: border-box;
    height: 24px;
    width: var(--tidslinje-rad-offset);
    max-width: var(--tidslinje-rad-offset);

    > * {
        margin-right: 0.5rem;
    }
`;

const Arbeidsgivernavn = styled.div`
    ${arbeidsgivernavnStyle};
`;

const EkspanderbartArbeidsgivernavn = styled(Button)<{ erEkspandert: boolean }>`
    padding: 0;
    ${arbeidsgivernavnStyle};

    cursor: pointer;
    font-weight: 600;
    color: var(--navds-color-action-default);

    > svg {
        color: var(--navds-color-action-default);

        > path {
            fill: var(--navds-color-action-default);
        }
    }
`;

const LeftContainer = styled.div`
    width: 1.5rem;
    max-width: 1.5rem;
`;

const Rader = styled(FlexColumn)`
    background-color: var(--speil-background-secondary);
    width: 100%;
    height: 100%;
    flex: 1;
`;

const ForeldedeRaderContainer = styled.div`
    overflow: hidden;
    padding: 6px 3px;
    margin: -3px;

    & > .row {
        margin-bottom: 0.25rem;
    }
`;

interface ArbeidsgiverProps {
    rader: TidslinjeradObject[];
    id: string;
    navn: string;
    erEkspandert: boolean;
    toggleEkspanderbarRad: (id: string) => void;
}

const Arbeidsgiver = ({ rader, navn, id, toggleEkspanderbarRad, erEkspandert }: ArbeidsgiverProps) => (
    <Flex alignItems="start">
        {rader.length > 1 ? (
            <EkspanderbartArbeidsgivernavn erEkspandert={erEkspandert} onClick={() => toggleEkspanderbarRad(id)}>
                <LeftContainer>
                    <NavFrontendChevron type={erEkspandert ? 'ned' : 'høyre'} />
                </LeftContainer>
                <Arbeidsgiverikon />
                <Flex style={{ overflow: 'hidden' }}>
                    <TekstMedEllipsis data-tip="Arbeidsgiver">{navn}</TekstMedEllipsis>
                </Flex>
            </EkspanderbartArbeidsgivernavn>
        ) : (
            <Arbeidsgivernavn>
                <LeftContainer />
                <Arbeidsgiverikon />
                <Flex style={{ overflow: 'hidden' }}>
                    <TekstMedEllipsis data-tip="Arbeidsgiver">{navn}</TekstMedEllipsis>
                </Flex>
            </Arbeidsgivernavn>
        )}
        {rader.length > 0 && (
            <Rader>
                <Tidslinjerad key="tidslinjerad-0" rad={rader[0]} erKlikkbar={true} />
                <AnimatePresence>
                    {erEkspandert && (
                        <ForeldedeRaderContainer>
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

interface InfotrygdProps {
    rad: InfotrygdradObject;
    navn: string;
}

const Infotrygd = ({ rad, navn }: InfotrygdProps) => (
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
