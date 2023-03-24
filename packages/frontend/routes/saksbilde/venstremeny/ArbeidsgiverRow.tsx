import classNames from 'classnames';
import dayjs from 'dayjs';
import React, { useState } from 'react';

import { Accordion, BodyShort, Tooltip } from '@navikt/ds-react';

import { Flex } from '@components/Flex';
import { LoadingShimmer } from '@components/LoadingShimmer';
import { AnonymizableTextWithEllipsis } from '@components/TextWithEllipsis';
import { AnonymizableContainer } from '@components/anonymizable/AnonymizableContainer';
import { AnonymizableText } from '@components/anonymizable/AnonymizableText';
import { Clipboard } from '@components/clipboard';
import { ArbeidsgiverikonMedTooltip } from '@components/ikoner/ArbeidsgiverikonMedTooltip';
import { Arbeidsforhold } from '@io/graphql';
import { NORSK_DATOFORMAT } from '@utils/date';
import { capitalize, somPenger } from '@utils/locale';

import styles from './ArbeidsgiverRow.module.css';

interface OrganisasjonsnummerRowProps {
    organisasjonsnummer: string;
}

const OrganisasjonsnummerRow: React.FC<OrganisasjonsnummerRowProps> = ({ organisasjonsnummer }) => {
    return (
        <Clipboard
            preserveWhitespace={false}
            copyMessage="Organisasjonsnummer er kopiert"
            tooltip={{ content: 'Kopier organisasjonsnummer' }}
        >
            <AnonymizableText>{organisasjonsnummer}</AnonymizableText>
        </Clipboard>
    );
};

interface ArbeidsforholdRowProps {
    arbeidsforhold: Array<Arbeidsforhold>;
}

const ArbeidsforholdRow: React.FC<ArbeidsforholdRowProps> = ({ arbeidsforhold }) => {
    return (
        <>
            {arbeidsforhold.map((arbeidsforhold, i) => {
                const stillingstittel = capitalize(arbeidsforhold.stillingstittel);
                const fom = dayjs(arbeidsforhold.startdato).format(NORSK_DATOFORMAT);
                const tom = arbeidsforhold.sluttdato && dayjs(arbeidsforhold.sluttdato).format(NORSK_DATOFORMAT);

                return (
                    <React.Fragment key={i}>
                        <Tooltip content={`${stillingstittel}, ${arbeidsforhold.stillingsprosent} %`}>
                            <div className={styles.Arbeidsforhold}>
                                <AnonymizableTextWithEllipsis>
                                    {`${capitalize(stillingstittel)}`}
                                </AnonymizableTextWithEllipsis>
                                <AnonymizableText>{`, ${arbeidsforhold.stillingsprosent} %`}</AnonymizableText>
                            </div>
                        </Tooltip>
                        <BodyShort>
                            {fom}
                            {tom && ' - ' && tom}
                        </BodyShort>
                    </React.Fragment>
                );
            })}
        </>
    );
};

interface MånedsbeløpRowProps {
    månedsbeløp: number;
}

const MånedsbeløpRow: React.FC<MånedsbeløpRowProps> = ({ månedsbeløp }) => {
    return (
        <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
            <BodyShort>Månedsbeløp:</BodyShort>
            {somPenger(månedsbeløp)}
        </Flex>
    );
};

interface ArbeidsgiverCardProps {
    navn: string;
    organisasjonsnummer: string;
    arbeidsforhold: Array<Arbeidsforhold>;
    månedsbeløp?: number;
}

const ArbeidsgiverRowView: React.FC<ArbeidsgiverCardProps> = ({
    navn,
    organisasjonsnummer,
    arbeidsforhold,
    månedsbeløp,
}) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <ArbeidsgiverikonMedTooltip className={styles.IconContainer} />
            <Accordion.Item open={open} className={styles.ArbeidsgiverRow}>
                <Accordion.Header className={styles.Header} onClick={() => setOpen((prevState) => !prevState)}>
                    <AnonymizableContainer>
                        <BodyShort>{navn.charAt(0).toUpperCase() + navn.slice(1).toLowerCase()}</BodyShort>
                    </AnonymizableContainer>
                </Accordion.Header>
                <Accordion.Content className={styles.Content}>
                    <OrganisasjonsnummerRow organisasjonsnummer={organisasjonsnummer} />
                    <ArbeidsforholdRow arbeidsforhold={arbeidsforhold} />
                </Accordion.Content>
                {månedsbeløp && <MånedsbeløpRow månedsbeløp={månedsbeløp} />}
            </Accordion.Item>
        </>
    );
};

const ArbeidsgiverCardSkeleton: React.FC = () => {
    return (
        <section className={classNames(styles.Skeleton, styles.ArbeidsgiverRow)}>
            <Flex gap="12px">
                <LoadingShimmer style={{ width: 20 }} />
                <LoadingShimmer />
            </Flex>
            <LoadingShimmer />
            <LoadingShimmer />
            <LoadingShimmer />
            <LoadingShimmer />
        </section>
    );
};

export const ArbeidsgiverRow = {
    Beregnet: ArbeidsgiverRowView,
    Uberegnet: ArbeidsgiverRowView,
    Ghost: ArbeidsgiverRowView,
    Skeleton: ArbeidsgiverCardSkeleton,
};
