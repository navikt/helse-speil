import dayjs from 'dayjs';
import React from 'react';

import { Bag } from '@navikt/ds-icons';
import { BodyShort } from '@navikt/ds-react';

import { Flex } from '../../../components/Flex';
import { Clipboard } from '../../../components/clipboard';
import { NORSK_DATOFORMAT } from '../../../utils/date';
import { useArbeidsgivernavn } from '../../../state/person';
import { capitalize, somPenger } from '../../../utils/locale';

import { CardTitle } from './CardTitle';
import styled from '@emotion/styled';
import { useArbeidsforhold } from '../../../modell/arbeidsgiver';
import { AnonymizableText } from '../../../components/anonymizable/AnonymizableText';
import { AnonymizableContainer } from '../../../components/anonymizable/AnonymizableContainer';

const ArbeidsgiverContainer = styled.div`
    display: grid;
    grid-template-columns: 1.25rem auto;
    grid-column-gap: 0.75rem;
    align-items: start;

    & > svg {
        margin-top: 0.125rem;
        justify-self: center;
    }
`;

interface ArbeidsgiverCardProps {
    organisasjonsnummer: string;
    månedsbeløp?: number;
}

export const ArbeidsgiverCard = ({ organisasjonsnummer, månedsbeløp }: ArbeidsgiverCardProps) => {
    const arbeidsgivernavn = useArbeidsgivernavn(organisasjonsnummer);
    const arbeidsforhold = useArbeidsforhold(organisasjonsnummer);

    return (
        <section>
            <ArbeidsgiverContainer>
                <Bag data-tip="Arbeidsgiver" title="Arbeidsgiver" />
                <AnonymizableContainer>
                    <CardTitle>{arbeidsgivernavn.toUpperCase()}</CardTitle>
                </AnonymizableContainer>
            </ArbeidsgiverContainer>
            <Clipboard
                preserveWhitespace={false}
                copyMessage="Organisasjonsnummer er kopiert"
                dataTip="Kopier organisasjonsnummer"
            >
                <AnonymizableText>{organisasjonsnummer}</AnonymizableText>
            </Clipboard>
            {arbeidsforhold.map(({ stillingstittel, stillingsprosent, startdato, sluttdato }, i) => (
                <React.Fragment key={i}>
                    <AnonymizableText>{`${capitalize(stillingstittel)}, ${stillingsprosent} %`}</AnonymizableText>
                    <BodyShort>
                        {dayjs(startdato).format(NORSK_DATOFORMAT)}
                        {sluttdato && ' - ' && dayjs(sluttdato).format(NORSK_DATOFORMAT)}
                    </BodyShort>
                </React.Fragment>
            ))}
            {månedsbeløp && (
                <Flex flexDirection="row" justifyContent="space-between">
                    <BodyShort>Månedsbeløp:</BodyShort>
                    {somPenger(månedsbeløp)}
                </Flex>
            )}
        </section>
    );
};
