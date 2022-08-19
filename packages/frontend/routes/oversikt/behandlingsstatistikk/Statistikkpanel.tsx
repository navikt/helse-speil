import React, { ReactNode } from 'react';
import classNames from 'classnames';
import { Accordion, BodyShort } from '@navikt/ds-react';

import { Bold } from '@components/Bold';
import { ProgressBar } from './ProgressBar';

import styles from './Statistikkpanel.module.css';

type Statistikkelement = {
    etikett: ReactNode;
    antall: number;
    elementer?: Array<Statistikkelement>;
};

interface SubpanelProps {
    element: Statistikkelement;
    antallSaker: number;
}

const Subpanel = ({ element, antallSaker }: SubpanelProps) => {
    return (
        <Accordion.Item className={classNames(styles.Statistikkpanel, styles.SubpanelHeader)}>
            <Accordion.Header>
                <Bold className={styles.Antall}>{element.antall}</Bold>
                <span>{element.etikett}</span>
                <ProgressBar value={element.antall} max={antallSaker} />
            </Accordion.Header>
            <Accordion.Content className={classNames(styles.Content, styles.SubpanelContent)}>
                {element.elementer?.map((element, index) => (
                    <React.Fragment key={index}>
                        <Bold className={styles.Antall}>{element.antall}</Bold>
                        <span>{element.etikett}</span>
                        <ProgressBar value={element.antall} max={antallSaker} />
                    </React.Fragment>
                ))}
            </Accordion.Content>
        </Accordion.Item>
    );
};

interface StatistikkpanelProps {
    tittel: string;
    antallSaker: number;
    elementer: Array<Statistikkelement>;
    defaultOpen?: boolean;
}

export const Statistikkpanel = ({ tittel, antallSaker, elementer, defaultOpen = false }: StatistikkpanelProps) => {
    return (
        <Accordion.Item className={styles.Statistikkpanel} defaultOpen={defaultOpen}>
            <Accordion.Header>
                <div className={styles.Heading}>
                    <BodyShort>{tittel}</BodyShort>
                    <BodyShort>{antallSaker}</BodyShort>
                </div>
            </Accordion.Header>
            <Accordion.Content className={styles.Content}>
                {elementer.map((element, index) =>
                    element.elementer ? (
                        <Subpanel key={index} element={element} antallSaker={antallSaker} />
                    ) : (
                        <React.Fragment key={index}>
                            <Bold className={styles.Antall}>{element.antall}</Bold>
                            <span>{element.etikett}</span>
                            <ProgressBar value={element.antall} max={antallSaker} />
                        </React.Fragment>
                    ),
                )}
            </Accordion.Content>
        </Accordion.Item>
    );
};
