import dayjs from 'dayjs';
import React from 'react';

import { Bag } from '@navikt/ds-icons';
import { BodyShort } from '@navikt/ds-react';

import { Flex } from '../../../components/Flex';
import { Clipboard } from '../../../components/clipboard';
import {
    useArbeidsforholdRender,
    useArbeidsgivernavnRender,
    useOrganisasjonsnummerRender,
} from '../../../state/person';
import { NORSK_DATOFORMAT } from '../../../utils/date';
import { capitalize, somPenger } from '../../../utils/locale';

import { CardTitle } from './CardTitle';
import styled from '@emotion/styled';

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
    const arbeidsgivernavn = useArbeidsgivernavnRender(organisasjonsnummer);
    const orgnummer = useOrganisasjonsnummerRender(organisasjonsnummer);
    const arbeidsforhold = useArbeidsforholdRender(organisasjonsnummer);

    return (
        <section>
            <ArbeidsgiverContainer>
                <Bag data-tip="Arbeidsgiver" title="Arbeidsgiver" />
                <CardTitle>{arbeidsgivernavn.toUpperCase()}</CardTitle>
            </ArbeidsgiverContainer>
            <Clipboard
                preserveWhitespace={false}
                copyMessage="Organisasjonsnummer er kopiert"
                dataTip="Kopier organisasjonsnummer"
            >
                <BodyShort>{orgnummer}</BodyShort>
            </Clipboard>
            {arbeidsforhold.map(({ stillingstittel, stillingsprosent, startdato, sluttdato }, i) => (
                <React.Fragment key={i}>
                    <BodyShort>{`${capitalize(stillingstittel)}, ${stillingsprosent} %`}</BodyShort>
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
