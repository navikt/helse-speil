import classNames from 'classnames';
import React, { ReactElement, useState } from 'react';

import { Accordion, BodyShort, CopyButton, HStack, Tooltip } from '@navikt/ds-react';

import { Arbeidsgivernavn, erSelvstendigNæringsdrivende } from '@components/Arbeidsgivernavn';
import { LoadingShimmer } from '@components/LoadingShimmer';
import { AnonymizableText, AnonymizableTextWithEllipsis } from '@components/anonymizable/AnonymizableText';
import { Arbeidsgiverikon } from '@components/ikoner/Arbeidsgiverikon';
import { SelvstendigNæringsdrivendeIkon } from '@components/ikoner/SelvstendigNæringsdrivendeIkon';
import { Arbeidsforhold } from '@io/graphql';
import { useIsAnonymous } from '@state/anonymization';
import { somNorskDato } from '@utils/date';
import { capitalizeName, somPenger } from '@utils/locale';

import styles from './ArbeidsgiverRow.module.scss';

interface ArbeidsforholdRowProps {
    arbeidsforhold: Array<Arbeidsforhold>;
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
            <div className={styles.iconContainer}>
                {erSelvstendigNæringsdrivende(organisasjonsnummer) ? (
                    <SelvstendigNæringsdrivendeIkon />
                ) : (
                    <Arbeidsgiverikon />
                )}
            </div>
            <Arbeidsgivernavn identifikator={organisasjonsnummer} navn={navn} maxWidth="300px" showCopyButton />
            {!erSelvstendigNæringsdrivende(organisasjonsnummer) && (
                <>
                    <div />
                    <HStack>
                        <AnonymizableText>{organisasjonsnummer}</AnonymizableText>
                        <Tooltip content="Kopier organisasjonsnummer">
                            <CopyButton copyText={organisasjonsnummer} size="xsmall" />
                        </Tooltip>
                    </HStack>
                </>
            )}
            <div />
            <Accordion>
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
