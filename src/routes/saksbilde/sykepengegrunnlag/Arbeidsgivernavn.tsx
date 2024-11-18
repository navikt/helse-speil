import classNames from 'classnames';
import React from 'react';

import { Tooltip } from '@navikt/ds-react';

import { AnonymizableTextWithEllipsis } from '@components/anonymizable/AnonymizableText';
import { ArbeidsgiverikonMedTooltip } from '@components/ikoner/ArbeidsgiverikonMedTooltip';
import { Errorikon } from '@components/ikoner/Errorikon';

import styles from './Arbeidsgivernavn.module.css';

interface ArbeidsgivernavnProps {
    className?: string;
    arbeidsgivernavn?: string;
    organisasjonsnummer: string;
    arbeidsforholdDeaktivert?: boolean;
}

export const Arbeidsgivernavn = ({
    className,
    arbeidsgivernavn,
    organisasjonsnummer,
    arbeidsforholdDeaktivert = false,
}: ArbeidsgivernavnProps) => (
    <>
        {arbeidsforholdDeaktivert ? (
            <Tooltip content="Arbeidsforhold er deaktivert">
                <div className={classNames(styles.wrapper, className)}>
                    <Errorikon alt="Rød sirkel med kryss" />
                    <AnonymizableTextWithEllipsis className={styles.arbeidsgivernavnDeaktivert}>
                        {arbeidsgivernavn}
                    </AnonymizableTextWithEllipsis>
                </div>
            </Tooltip>
        ) : (
            <ArbeidsgiverikonMedTooltip
                className={classNames(styles.wrapper, className)}
                tooltipTekst={`${arbeidsgivernavn}  - ${organisasjonsnummer}`}
            >
                <AnonymizableTextWithEllipsis className={styles.arbeidsgivernavn}>
                    {arbeidsgivernavn}
                </AnonymizableTextWithEllipsis>
            </ArbeidsgiverikonMedTooltip>
        )}
    </>
);
