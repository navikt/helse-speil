import agurk from '../../assets/ingen-oppgaver-agurk.png';
import fredagstaco from '../../assets/ingen-oppgaver-fredagstaco.png';
import brevkasse from '../../assets/ingen-oppgaver.png';
import dayjs from 'dayjs';
import React, { PropsWithChildren } from 'react';

import { Heading } from '@navikt/ds-react';

import { TabType, useAktivTab } from './tabState';

import styles from './IngenOppgaver.module.css';

const erFredag = () => dayjs().isoWeekday() === 5;

const Caption = ({ children }: PropsWithChildren) => {
    return (
        <Heading as="figcaption" size="medium">
            {children}
        </Heading>
    );
};

export const IngenOppgaver: React.FC = () => {
    const aktivTab = useAktivTab();

    switch (aktivTab) {
        case TabType.BehandletIdag: {
            return (
                <figure className={styles.IngenOppgaver}>
                    <img alt="Tom brevkasse som smiler" src={brevkasse.src} />
                    <Caption>Du har ingen behandlede saker</Caption>
                </figure>
            );
        }
        case TabType.TilGodkjenning:
            return (
                <figure className={styles.IngenOppgaver}>
                    {erFredag() ? (
                        <img alt="Agurk med armer og bein ikledd sombrero som holder en taco" src={fredagstaco.src} />
                    ) : (
                        <img alt="Agurk med armer og bein som holder kaffekopp" src={agurk.src} />
                    )}
                    <Caption>Ooops! Ingen saker å plukke...</Caption>
                </figure>
            );
        case TabType.Mine:
            return (
                <figure className={styles.IngenOppgaver}>
                    <img alt="Tom brevkasse som smiler" src={brevkasse.src} />
                    <Caption>Du har ingen tildelte saker</Caption>
                </figure>
            );
        case TabType.Ventende:
            return (
                <figure className={styles.IngenOppgaver}>
                    <img alt="Tom brevkasse som smiler" src={brevkasse.src} />
                    <Caption>Du har ingen saker på vent</Caption>
                </figure>
            );
        default:
            return null;
    }
};
