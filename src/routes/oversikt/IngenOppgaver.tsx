import dayjs from 'dayjs';
import Image from 'next/image';
import { PropsWithChildren, ReactElement } from 'react';

import { Heading } from '@navikt/ds-react';

import agurk from '@assets/ingen-oppgaver-agurk.png';
import fredagstaco from '@assets/ingen-oppgaver-fredagstaco.png';
import brevkasse from '@assets/ingen-oppgaver.png';

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

export const IngenOppgaver = (): ReactElement | null => {
    const aktivTab = useAktivTab();

    switch (aktivTab) {
        case TabType.BehandletIdag: {
            return (
                <figure className={styles.IngenOppgaver}>
                    <Image alt="Tom brevkasse som smiler" priority={true} src={brevkasse} unoptimized />
                    <Caption>Du har ingen behandlede oppgaver</Caption>
                </figure>
            );
        }
        case TabType.TilGodkjenning:
            return (
                <figure className={styles.IngenOppgaver}>
                    {erFredag() ? (
                        <Image
                            alt="Agurk med armer og bein ikledd sombrero som holder en taco"
                            priority={true}
                            src={fredagstaco}
                            unoptimized
                        />
                    ) : (
                        <Image
                            alt="Agurk med armer og bein som holder kaffekopp"
                            priority={true}
                            src={agurk}
                            unoptimized
                        />
                    )}
                    <Caption>Ooops! Ingen oppgaver å plukke...</Caption>
                </figure>
            );
        case TabType.Mine:
            return (
                <figure className={styles.IngenOppgaver}>
                    <Image alt="Tom brevkasse som smiler" priority={true} src={brevkasse} unoptimized />
                    <Caption>Du har ingen tildelte oppgaver</Caption>
                </figure>
            );
        case TabType.Ventende:
            return (
                <figure className={styles.IngenOppgaver}>
                    <Image alt="Tom brevkasse som smiler" priority={true} src={brevkasse} unoptimized />
                    <Caption>Du har ingen oppgaver på vent</Caption>
                </figure>
            );
        default:
            return null;
    }
};
