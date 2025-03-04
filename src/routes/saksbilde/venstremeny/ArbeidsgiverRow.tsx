import classNames from 'classnames';
import React, { ReactElement, useState } from 'react';

import { Accordion, BodyShort, CopyButton, HStack, Tooltip } from '@navikt/ds-react';

import { LoadingShimmer } from '@components/LoadingShimmer';
import { AnonymizableContainer } from '@components/anonymizable/AnonymizableContainer';
import { AnonymizableText, AnonymizableTextWithEllipsis } from '@components/anonymizable/AnonymizableText';
import { ArbeidsgiverikonMedTooltip } from '@components/ikoner/ArbeidsgiverikonMedTooltip';
import { Arbeidsforhold } from '@io/graphql';
import { useIsAnonymous } from '@state/anonymization';
import { somNorskDato } from '@utils/date';
import { capitalize, capitalizeArbeidsgiver, somPenger } from '@utils/locale';

import styles from './ArbeidsgiverRow.module.scss';

interface OrganisasjonsnummerRowProps {
    organisasjonsnummer: string;
}

const OrganisasjonsnummerRow = ({ organisasjonsnummer }: OrganisasjonsnummerRowProps): ReactElement => (
    <HStack>
        <AnonymizableText>{organisasjonsnummer}</AnonymizableText>
        <Tooltip content="Kopier organisasjonsnummer">
            <CopyButton copyText={organisasjonsnummer} size="xsmall" />
        </Tooltip>
    </HStack>
);

interface ArbeidsforholdRowProps {
    arbeidsforhold: Array<Arbeidsforhold>;
    erAnonymisert: boolean;
}

const ArbeidsforholdRow = ({ arbeidsforhold, erAnonymisert }: ArbeidsforholdRowProps): ReactElement => {
    return (
        <>
            {arbeidsforhold.map((arbeidsforhold, i) => {
                const stillingstittel = capitalize(arbeidsforhold.stillingstittel);
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

const MånedsbeløpRow = ({ månedsbeløp }: MånedsbeløpRowProps): ReactElement => {
    return (
        <HStack justify="space-between" align="center">
            <BodyShort>Månedsbeløp:</BodyShort>
            {somPenger(månedsbeløp)}
        </HStack>
    );
};

interface ArbeidsgiverCardProps {
    navn: string;
    organisasjonsnummer: string;
    arbeidsforhold: Array<Arbeidsforhold>;
    månedsbeløp?: number;
}

const ArbeidsgiverRowView = ({
    navn,
    organisasjonsnummer,
    arbeidsforhold,
    månedsbeløp,
}: ArbeidsgiverCardProps): ReactElement => {
    const [open, setOpen] = useState(false);
    const erAnonymisert = useIsAnonymous();

    return (
        <>
            <ArbeidsgiverikonMedTooltip className={styles.iconContainer} />
            <Accordion>
                <Accordion.Item open={open} className={styles.arbeidsgiverRow}>
                    <Accordion.Header
                        className={classNames(styles.header, erAnonymisert && styles.anonymisert)}
                        onClick={() => setOpen((prevState) => !prevState)}
                    >
                        <AnonymizableContainer>
                            <BodyShort>{capitalizeArbeidsgiver(navn)}</BodyShort>
                        </AnonymizableContainer>
                    </Accordion.Header>
                    <Accordion.Content className={styles.content}>
                        <OrganisasjonsnummerRow organisasjonsnummer={organisasjonsnummer} />
                        <ArbeidsforholdRow arbeidsforhold={arbeidsforhold} erAnonymisert={erAnonymisert} />
                    </Accordion.Content>
                    {månedsbeløp !== undefined && <MånedsbeløpRow månedsbeløp={månedsbeløp} />}
                </Accordion.Item>
            </Accordion>
        </>
    );
};

const ArbeidsgiverCardSkeleton = (): ReactElement => {
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
    Tilkommen: ArbeidsgiverRowView,
    Skeleton: ArbeidsgiverCardSkeleton,
};
