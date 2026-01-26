import classNames from 'classnames';
import React, { ReactElement, useState } from 'react';

import { Accordion, BodyShort, CopyButton, HStack, Tooltip } from '@navikt/ds-react';

import { Inntektsforholdnavn } from '@components/Inntektsforholdnavn';
import { AnonymizableText, AnonymizableTextWithEllipsis } from '@components/anonymizable/AnonymizableText';
import { Arbeidsgiverikon } from '@components/ikoner/Arbeidsgiverikon';
import { Arbeidsforhold } from '@io/graphql';
import { useIsAnonymous } from '@state/anonymization';
import { Inntektsforhold, tilReferanse } from '@state/inntektsforhold/inntektsforhold';
import { somNorskDato } from '@utils/date';
import { capitalizeName } from '@utils/locale';
import { isArbeidsgiver } from '@utils/typeguards';

import styles from './ArbeidsgiverRow.module.scss';

interface ArbeidsforholdRowProps {
    arbeidsforhold: Arbeidsforhold[];
    erAnonymisert: boolean;
}

const ArbeidsforholdRow = ({ arbeidsforhold, erAnonymisert }: ArbeidsforholdRowProps): ReactElement => {
    return (
        <>
            {arbeidsforhold.map((arbeidsforhold, i) => {
                const stillingstittel = capitalizeName(arbeidsforhold.stillingstittel);
                const fom = somNorskDato(arbeidsforhold.startdato);
                const tom = arbeidsforhold.sluttdato && somNorskDato(arbeidsforhold.sluttdato);

                return (
                    <React.Fragment key={i}>
                        <Tooltip
                            content={
                                !erAnonymisert
                                    ? `${stillingstittel}, ${arbeidsforhold.stillingsprosent} %`
                                    : 'Stillingstittel, stillingsprosent'
                            }
                        >
                            <div className={styles.arbeidsforhold}>
                                <AnonymizableTextWithEllipsis>
                                    {`${capitalizeName(stillingstittel)}`}
                                </AnonymizableTextWithEllipsis>
                                <AnonymizableText>{`, ${arbeidsforhold.stillingsprosent} %`}</AnonymizableText>
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
    const [open, setOpen] = useState(false);
    const erAnonymisert = useIsAnonymous();

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
                        <AnonymizableText>{inntektsforhold.organisasjonsnummer}</AnonymizableText>
                        <Tooltip content="Kopier organisasjonsnummer">
                            <CopyButton copyText={inntektsforhold.organisasjonsnummer} size="xsmall" />
                        </Tooltip>
                    </HStack>
                    <div />
                    <Accordion indent={false}>
                        <Accordion.Item open={open} className={styles.arbeidsgiverRow}>
                            <Accordion.Header
                                className={classNames(styles.header, erAnonymisert && styles.anonymisert)}
                                onClick={() => setOpen((prevState) => !prevState)}
                            >
                                Arbeidsforhold
                            </Accordion.Header>
                            <Accordion.Content className={styles.content}>
                                <ArbeidsforholdRow arbeidsforhold={arbeidsforhold} erAnonymisert={erAnonymisert} />
                            </Accordion.Content>
                        </Accordion.Item>
                    </Accordion>
                </>
            )}
        </>
    );
};
