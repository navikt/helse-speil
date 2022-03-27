import dayjs from 'dayjs';
import React from 'react';

import { Bag } from '@navikt/ds-icons';
import { BodyShort } from '@navikt/ds-react';

import { Flex } from '@components/Flex';
import { Tooltip } from '@components/Tooltip';
import { Clipboard } from '@components/clipboard';
import { AnonymizableText } from '@components/anonymizable/AnonymizableText';
import { AnonymizableContainer } from '@components/anonymizable/AnonymizableContainer';
import { AnonymizableTextWithEllipsis } from '@components/TextWithEllipsis';
import { capitalize, somPenger } from '@utils/locale';
import { NORSK_DATOFORMAT } from '@utils/date';
import { Arbeidsforhold } from '@io/graphql';

import { CardTitle } from './CardTitle';

import styles from './ArbeidsgiverCard.module.css';

interface TitleRowProps {
    navn: string;
}

const TitleRow: React.VFC<TitleRowProps> = ({ navn }) => {
    return (
        <div className={styles.Title}>
            <Bag tabIndex={-1} data-tip="Arbeidsgiver" title="Arbeidsgiver" />
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
            dataTip="Kopier organisasjonsnummer"
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
                        <div className={styles.Arbeidsforhold}>
                            <AnonymizableTextWithEllipsis data-tip={stillingstittel}>
                                {`${capitalize(stillingstittel)}`}
                            </AnonymizableTextWithEllipsis>
                            <AnonymizableText>{`, ${arbeidsforhold.stillingsprosent} %`}</AnonymizableText>
                        </div>
                        <Tooltip effect="solid" />
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
        <Flex flexDirection="row" justifyContent="space-between">
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

export const ArbeidsgiverCard = ({ navn, organisasjonsnummer, arbeidsforhold, månedsbeløp }: ArbeidsgiverCardProps) => {
    return (
        <section>
            <TitleRow navn={navn} />
            <OrganisasjonsnummerRow organisasjonsnummer={organisasjonsnummer} />
            <ArbeidsforholdRow arbeidsforhold={arbeidsforhold} />
            {månedsbeløp && <MånedsbeløpRow månedsbeløp={månedsbeløp} />}
        </section>
    );
};
