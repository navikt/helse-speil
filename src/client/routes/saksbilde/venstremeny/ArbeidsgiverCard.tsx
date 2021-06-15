import { Arbeidsforhold } from 'internal-types';
import React from 'react';

import { Normaltekst } from 'nav-frontend-typografi';

import { Flex } from '../../../components/Flex';
import { Clipboard } from '../../../components/clipboard';
import { NORSK_DATOFORMAT } from '../../../utils/date';
import { capitalize, somPenger } from '../../../utils/locale';

import { getAnonymArbeidsgiverForOrgnr } from '../../../agurkdata';
import { Card } from './Card';
import { CardTitle } from './CardTitle';

interface ArbeidsgiverCardProps {
    arbeidsgivernavn: string;
    organisasjonsnummer: string;
    arbeidsforhold: Arbeidsforhold[];
    anonymiseringEnabled?: boolean;
    månedsbeløp?: number;
}

export const ArbeidsgiverCard = ({
    arbeidsgivernavn,
    organisasjonsnummer,
    arbeidsforhold,
    månedsbeløp,
    anonymiseringEnabled = false,
}: ArbeidsgiverCardProps) => (
    <Card>
        <CardTitle>
            {anonymiseringEnabled
                ? getAnonymArbeidsgiverForOrgnr(organisasjonsnummer).navn.toUpperCase()
                : arbeidsgivernavn.toUpperCase()}
        </CardTitle>
        <Clipboard preserveWhitespace={false} copyMessage="Organisasjonsnummer er kopiert">
            <Normaltekst>
                {anonymiseringEnabled ? getAnonymArbeidsgiverForOrgnr(organisasjonsnummer).orgnr : organisasjonsnummer}
            </Normaltekst>
        </Clipboard>
        {arbeidsforhold.map((e, i) => (
            <React.Fragment key={i}>
                <Normaltekst>{`${
                    anonymiseringEnabled ? 'Agurkifisert stillingstittel' : capitalize(e.stillingstittel)
                }, ${e.stillingsprosent} %`}</Normaltekst>
                <Normaltekst>
                    {e.startdato.format(NORSK_DATOFORMAT)}
                    {e.sluttdato && ' - ' && e.sluttdato.format(NORSK_DATOFORMAT)}
                </Normaltekst>
            </React.Fragment>
        ))}
        <Flex flexDirection={'row'} justifyContent={'space-between'}>
            <Normaltekst>Månedsbeløp:</Normaltekst>
            {somPenger(månedsbeløp)}
        </Flex>
    </Card>
);
