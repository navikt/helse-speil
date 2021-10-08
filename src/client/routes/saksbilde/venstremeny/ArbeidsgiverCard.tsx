import dayjs from 'dayjs';
import React from 'react';

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

import { Card } from './Card';
import { CardTitle } from './CardTitle';

interface ArbeidsgiverCardProps {
    organisasjonsnummer: string;
    månedsbeløp?: number;
}

export const ArbeidsgiverCard = ({ organisasjonsnummer, månedsbeløp }: ArbeidsgiverCardProps) => {
    const arbeidsgivernavn = useArbeidsgivernavnRender(organisasjonsnummer);
    const orgnummer = useOrganisasjonsnummerRender(organisasjonsnummer);
    const arbeidsforhold = useArbeidsforholdRender(organisasjonsnummer);

    return (
        <Card>
            <CardTitle>{arbeidsgivernavn.toUpperCase()}</CardTitle>
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
            <Flex flexDirection="row" justifyContent="space-between">
                <BodyShort>Månedsbeløp:</BodyShort>
                {somPenger(månedsbeløp)}
            </Flex>
        </Card>
    );
};
