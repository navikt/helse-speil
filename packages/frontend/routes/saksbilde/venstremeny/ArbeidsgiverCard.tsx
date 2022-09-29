import dayjs from 'dayjs';
import React from 'react';

import { Bag } from '@navikt/ds-icons';
import { BodyShort, Tooltip } from '@navikt/ds-react';

import { Flex } from '@components/Flex';
import { Clipboard } from '@components/clipboard';
import { LoadingShimmer } from '@components/LoadingShimmer';
import { AnonymizableText } from '@components/anonymizable/AnonymizableText';
import { AnonymizableContainer } from '@components/anonymizable/AnonymizableContainer';
import { AnonymizableTextWithEllipsis } from '@components/TextWithEllipsis';
import { capitalize, somPenger } from '@utils/locale';
import { NORSK_DATOFORMAT } from '@utils/date';
import { Arbeidsforhold } from '@io/graphql';

import { CardTitle } from './CardTitle';

import styles from './ArbeidsgiverCard.module.css';
import classNames from 'classnames';

interface TitleRowProps {
    navn: string;
}

const TitleRow: React.VFC<TitleRowProps> = ({ navn }) => {
    return (
        <div className={styles.Title}>
            <Tooltip content="Arbeidsgiver">
                <Bag tabIndex={-1} title="Arbeidsgiver" />
            </Tooltip>
            <AnonymizableContainer>
                <CardTitle>{navn.toUpperCase()}</CardTitle>
            </AnonymizableContainer>
        </div>
    );
};

interface OrganisasjonsnummerRowProps {
    organisasjonsnummer: string;
}

const OrganisasjonsnummerRow: React.VFC<OrganisasjonsnummerRowProps> = ({ organisasjonsnummer }) => {
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

const ArbeidsforholdRow: React.VFC<ArbeidsforholdRowProps> = ({ arbeidsforhold }) => {
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

const MånedsbeløpRow: React.VFC<MånedsbeløpRowProps> = ({ månedsbeløp }) => {
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

const ArbeidsgiverCardView: React.FC<ArbeidsgiverCardProps> = ({
    navn,
    organisasjonsnummer,
    arbeidsforhold,
    månedsbeløp,
}) => {
    return (
        <section className={styles.ArbeidsgiverCard}>
            <TitleRow navn={navn} />
            <OrganisasjonsnummerRow organisasjonsnummer={organisasjonsnummer} />
            <ArbeidsforholdRow arbeidsforhold={arbeidsforhold} />
            {månedsbeløp && <MånedsbeløpRow månedsbeløp={månedsbeløp} />}
        </section>
    );
};

const ArbeidsgiverCardSkeleton: React.FC = () => {
    return (
        <section className={classNames(styles.Skeleton, styles.ArbeidsgiverCard)}>
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

export const ArbeidsgiverCard = {
    Beregnet: ArbeidsgiverCardView,
    Uberegnet: ArbeidsgiverCardView,
    Ghost: ArbeidsgiverCardView,
    Skeleton: ArbeidsgiverCardSkeleton,
};
