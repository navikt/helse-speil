import styles from './ArbeidsgiverRow.module.scss';
import classNames from 'classnames';
import dayjs from 'dayjs';
import React, { useState } from 'react';

import { Accordion, BodyShort, Tooltip } from '@navikt/ds-react';

import { LoadingShimmer } from '@components/LoadingShimmer';
import { AnonymizableTextWithEllipsis } from '@components/TextWithEllipsis';
import { AnonymizableContainer } from '@components/anonymizable/AnonymizableContainer';
import { AnonymizableText } from '@components/anonymizable/AnonymizableText';
import { Clipboard } from '@components/clipboard';
import { ArbeidsgiverikonMedTooltip } from '@components/ikoner/ArbeidsgiverikonMedTooltip';
import { Arbeidsforhold } from '@io/graphql';
import { NORSK_DATOFORMAT } from '@utils/date';
import { capitalize, somPenger } from '@utils/locale';

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
                            <div className={styles.arbeidsforhold}>
                                <AnonymizableTextWithEllipsis>
                                    {`${capitalize(stillingstittel)}`}
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

interface MånedsbeløpRowProps {
    månedsbeløp: number;
}

const MånedsbeløpRow: React.FC<MånedsbeløpRowProps> = ({ månedsbeløp }) => {
    return (
        <div className={styles.månedsbeløp}>
            <BodyShort>Månedsbeløp:</BodyShort>
            {somPenger(månedsbeløp)}
        </div>
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
            <ArbeidsgiverikonMedTooltip className={styles.iconContainer} />
            <Accordion>
                <Accordion.Item open={open} className={styles.arbeidsgiverRow}>
                    <Accordion.Header className={styles.header} onClick={() => setOpen((prevState) => !prevState)}>
                        <AnonymizableContainer>
                            <BodyShort>{navn.charAt(0).toUpperCase() + navn.slice(1).toLowerCase()}</BodyShort>
                        </AnonymizableContainer>
                    </Accordion.Header>
                    <Accordion.Content className={styles.content}>
                        <OrganisasjonsnummerRow organisasjonsnummer={organisasjonsnummer} />
                        <ArbeidsforholdRow arbeidsforhold={arbeidsforhold} />
                    </Accordion.Content>
                    {månedsbeløp !== undefined && <MånedsbeløpRow månedsbeløp={månedsbeløp} />}
                </Accordion.Item>
            </Accordion>
        </>
    );
};

const ArbeidsgiverCardSkeleton: React.FC = () => {
    return (
        <section className={classNames(styles.skeleton, styles.arbeidsgiverRow)}>
            <div className={styles.arbeidsgiver}>
                <LoadingShimmer style={{ width: 20 }} />
                <LoadingShimmer />
            </div>
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
