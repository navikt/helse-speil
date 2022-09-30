import agurk from '../../assets/ingen-oppgaver-agurk.png';
import fredagstaco from '../../assets/ingen-oppgaver-fredagstaco.png';
import brevkasse from '../../assets/ingen-oppgaver.png';
import styled from '@emotion/styled';
import dayjs from 'dayjs';
import React from 'react';

import { Heading } from '@navikt/ds-react';

import { TabType, useAktivTab } from './Tabs';

const Container = styled.div`
    align-self: flex-start;
    width: max-content;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem;
`;

const Tekst = styled(Heading)`
    margin: 2rem 0 0;
    font-size: 1.25rem;
    flex: 1;
`;

const erFredag = () => dayjs().isoWeekday() === 5;

export const IngenOppgaver: React.FC = () => {
    const aktivTab = useAktivTab();

    switch (aktivTab) {
        case TabType.BehandletIdag: {
            return (
                <Container>
                    <img alt="Tom brevkasse som smiler" src={brevkasse} />
                    <Tekst as="h2" size="medium">
                        Du har ingen behandlede saker
                    </Tekst>
                </Container>
            );
        }
        case TabType.TilGodkjenning:
            return (
                <Container>
                    {erFredag() ? (
                        <img alt="Agurk med armer og bein ikledd sombrero som holder en taco" src={fredagstaco} />
                    ) : (
                        <img alt="Agurk med armer og bein som holder kaffekopp" src={agurk} />
                    )}
                    <Tekst as="h2" size="medium">
                        Ooops! Ingen saker å plukke...
                    </Tekst>
                </Container>
            );
        case TabType.Mine:
            return (
                <Container>
                    <img alt="Tom brevkasse som smiler" src={brevkasse} />
                    <Tekst as="h2" size="medium">
                        Du har ingen tildelte saker
                    </Tekst>
                </Container>
            );
        case TabType.Ventende:
            return (
                <Container>
                    <img alt="Tom brevkasse som smiler" src={brevkasse} />
                    <Tekst as="h2" size="medium">
                        Du har ingen saker på vent
                    </Tekst>
                </Container>
            );
        default:
            return null;
    }
};
