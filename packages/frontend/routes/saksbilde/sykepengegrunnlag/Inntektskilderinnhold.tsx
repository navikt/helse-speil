import React from 'react';

import { Kilde } from '@components/Kilde';
import { Clipboard } from '@components/clipboard';
import { AnonymizableText } from '@components/anonymizable/AnonymizableText';
import { AnonymizableContainer } from '@components/anonymizable/AnonymizableContainer';
import { AnonymizableTextWithEllipsis } from '@components/TextWithEllipsis';
import type { Arbeidsforhold, Arbeidsgiverinntekt, Refusjon } from '@io/graphql';

import { ArbeidsforholdView } from '../ArbeidsforholdView';
import { Refusjonsoversikt } from './refusjon/Refusjonsoversikt';
import { Inntekt } from './inntekt/Inntekt';

import styles from './Inntektskilderinnhold.module.css';
import { Tooltip } from '@navikt/ds-react';

interface InntektskilderinnholdProps {
    inntekt: Arbeidsgiverinntekt;
    arbeidsgivernavn: string;
    bransjer: string[];
    arbeidsforhold: Arbeidsforhold[];
    skjæringstidspunkt: DateString;
    refusjon?: Maybe<Refusjon>;
}

export const Inntektskilderinnhold = ({
    inntekt,
    arbeidsgivernavn,
    bransjer,
    arbeidsforhold,
    skjæringstidspunkt,
    refusjon,
}: InntektskilderinnholdProps) => {
    return (
        <div className={styles.Inntektskilderinnhold}>
            <div className={styles.Header}>
                <Tooltip content="Arbeidsgivernavn">
                    <div className={styles.Arbeidsgivernavn}>
                        <AnonymizableTextWithEllipsis>{arbeidsgivernavn}</AnonymizableTextWithEllipsis>
                    </div>
                </Tooltip>
                <div className={styles.Organisasjonsnummer}>
                    (
                    <Clipboard
                        copyMessage="Organisasjonsnummer er kopiert"
                        tooltip={{ content: 'Kopier organisasjonsnummer' }}
                    >
                        <AnonymizableContainer>{inntekt.arbeidsgiver}</AnonymizableContainer>
                    </Clipboard>
                    )
                </div>
                <Kilde type="AINNTEKT">AA</Kilde>
            </div>
            <AnonymizableText className={styles.Bransjer}>
                {`BRANSJE${bransjer.length > 1 ? 'R' : ''}: `}
                {bransjer.join(', ')}
            </AnonymizableText>
            <div className={styles.Arbeidsforholdtabell}>
                {arbeidsforhold.map((it, i) => (
                    <ArbeidsforholdView
                        key={i}
                        startdato={it.startdato}
                        sluttdato={it.sluttdato}
                        stillingsprosent={it.stillingsprosent}
                        stillingstittel={it.stillingstittel}
                    />
                ))}
            </div>
            <Inntekt inntekt={inntekt} />
            {refusjon && <Refusjonsoversikt refusjon={refusjon} />}
        </div>
    );
};
