import React, { ReactElement } from 'react';

import { Accordion, BodyShort, CopyButton, HStack, Tooltip } from '@navikt/ds-react';

import { Inntektsforholdnavn } from '@components/Inntektsforholdnavn';
import { Arbeidsgiverikon } from '@components/ikoner/Arbeidsgiverikon';
import { Arbeidsforhold } from '@io/graphql';
import { Inntektsforhold, tilReferanse } from '@state/inntektsforhold/inntektsforhold';
import { somNorskDato } from '@utils/date';
import { capitalizeName } from '@utils/locale';
import { isArbeidsgiver } from '@utils/typeguards';

import styles from './ArbeidsgiverRow.module.scss';

interface ArbeidsforholdRowProps {
    arbeidsforhold: Arbeidsforhold[];
}

const ArbeidsforholdRow = ({ arbeidsforhold }: ArbeidsforholdRowProps): ReactElement => {
    return (
        <>
            {arbeidsforhold.map((arbeidsforhold, i) => {
                const stillingstittel = capitalizeName(arbeidsforhold.stillingstittel);
                const fom = somNorskDato(arbeidsforhold.startdato);
                const tom = arbeidsforhold.sluttdato && somNorskDato(arbeidsforhold.sluttdato);

                return (
                    <React.Fragment key={i}>
                        <Tooltip content={`${stillingstittel}, ${arbeidsforhold.stillingsprosent} %`}>
                            <div className={styles.arbeidsforhold} data-sensitive>
                                <BodyShort truncate>{stillingstittel}</BodyShort>
                                <BodyShort>{`, ${arbeidsforhold.stillingsprosent} %`}</BodyShort>
                            </div>
                        </Tooltip>
                        <BodyShort>
                            {fom}
                            {tom && ` - ${tom}`}
                        </BodyShort>
                    </React.Fragment>
                );
            })}
        </>
    );
};

interface InntektsforholdRowProps {
    arbeidsforhold: Arbeidsforhold[];
    inntektsforhold: Inntektsforhold;
}

export const InntektsforholdRow = ({ arbeidsforhold, inntektsforhold }: InntektsforholdRowProps): ReactElement => {
    return (
        <>
            <div className={styles.iconContainer}>
                <Arbeidsgiverikon />
            </div>
            <Inntektsforholdnavn
                inntektsforholdReferanse={tilReferanse(inntektsforhold)}
                maxWidth="300px"
                showCopyButton
            />
            {isArbeidsgiver(inntektsforhold) && (
                <>
                    <div />
                    <HStack>
                        <BodyShort data-sensitive>{inntektsforhold.organisasjonsnummer}</BodyShort>
                        <Tooltip content="Kopier virksomhetsnummer">
                            <CopyButton copyText={inntektsforhold.organisasjonsnummer} size="xsmall" />
                        </Tooltip>
                    </HStack>
                    <div />
                    <Accordion indent={false}>
                        <Accordion.Item className={styles.arbeidsgiverRow}>
                            <Accordion.Header className={styles.header}>Arbeidsforhold</Accordion.Header>
                            <Accordion.Content className={styles.content}>
                                <ArbeidsforholdRow arbeidsforhold={arbeidsforhold} />
                            </Accordion.Content>
                        </Accordion.Item>
                    </Accordion>
                </>
            )}
        </>
    );
};
