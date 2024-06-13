import dayjs from 'dayjs';
import Image from 'next/image';
import React, { PropsWithChildren, ReactElement } from 'react';

import { Heading } from '@navikt/ds-react';

import agurk from '@assets/ingen-oppgaver-agurk.png';
import fredagstaco from '@assets/ingen-oppgaver-fredagstaco.png';
import brevkasse from '@assets/ingen-oppgaver.png';
import { Maybe } from '@io/graphql';

import { TabType, useAktivTab } from './tabState';

import styles from './IngenOppgaver.module.css';

const erFredag = (): boolean => dayjs().isoWeekday() === 5;

const Caption = ({ children }: PropsWithChildren): ReactElement => {
    return (
        <Heading as="figcaption" size="medium">
            {children}
        </Heading>
    );
};

export const IngenOppgaver = (): Maybe<ReactElement> => {
    const aktivTab = useAktivTab();

    switch (aktivTab) {
        case TabType.BehandletIdag: {
            return (
                <figure className={styles.IngenOppgaver}>
                    <Image alt="Tom brevkasse som smiler" src={brevkasse} />
                    <Caption>Du har ingen behandlede saker</Caption>
                </figure>
            );
        }
        case TabType.TilGodkjenning:
            return (
                <figure className={styles.IngenOppgaver}>
                    {erFredag() ? (
                        <Image alt="Agurk med armer og bein ikledd sombrero som holder en taco" src={fredagstaco} />
                    ) : (
                        <Image alt="Agurk med armer og bein som holder kaffekopp" src={agurk} />
                    )}
                    <Caption>Ooops! Ingen saker å plukke...</Caption>
                </figure>
            );
        case TabType.Mine:
            return (
                <figure className={styles.IngenOppgaver}>
                    <Image alt="Tom brevkasse som smiler" src={brevkasse} />
                    <Caption>Du har ingen tildelte saker</Caption>
                </figure>
            );
        case TabType.Ventende:
            return (
                <figure className={styles.IngenOppgaver}>
                    <Image alt="Tom brevkasse som smiler" src={brevkasse} />
                    <Caption>Du har ingen saker på vent</Caption>
                </figure>
            );
        default:
            return null;
    }
};
