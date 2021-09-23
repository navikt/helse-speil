import styled from '@emotion/styled';
import React from 'react';

import { Bag } from '@navikt/ds-icons';
import { BodyShort } from '@navikt/ds-react';

import { FlexColumn } from '../../../components/Flex';
import { Kilde } from '../../../components/Kilde';
import { TekstMedEllipsis } from '../../../components/TekstMedEllipsis';
import { Tooltip } from '../../../components/Tooltip';
import { Clipboard } from '../../../components/clipboard';

import { getAnonymArbeidsgiverForOrgnr } from '../../../agurkdata';
import { Arbeidsforhold } from '../Arbeidsforhold';
import { Inntekt } from './inntekt/Inntekt';

const Header = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    gap: 1rem;
`;

const Bransjer = styled(BodyShort)`
    font-size: 14px;
    margin-bottom: 0.5rem;
    color: var(--navds-color-text-disabled);
`;

const Navn = styled.div`
    display: flex;
    white-space: nowrap;
    max-width: 300px;
    font-size: 18px;
    font-weight: 600;
`;

const Organisasjonsnummer = styled.div`
    display: flex;
    align-items: center;
    font-size: 18px;
    font-weight: 600;
`;

const Tabell = styled.div`
    display: grid;
    grid-template-columns: 200px auto;
    grid-column-gap: 1rem;
    grid-row-gap: 0.5rem;
    margin: 0.5rem 0 4rem;
`;

const ArbeidsforholdTabell = styled(Tabell)`
    margin-top: 0;
    margin-bottom: 2rem;
`;

interface InntektskilderinnholdProps {
    inntektskilde: Arbeidsgiverinntekt;
    anonymiseringEnabled: boolean;
}

export const Inntektskilderinnhold = ({ inntektskilde, anonymiseringEnabled }: InntektskilderinnholdProps) => (
    <FlexColumn>
        <Header>
            <Bag width={20} height={20} />
            <Navn data-tip="Arbeidsgivernavn">
                <TekstMedEllipsis>
                    {anonymiseringEnabled
                        ? getAnonymArbeidsgiverForOrgnr(inntektskilde.organisasjonsnummer).navn
                        : inntektskilde.arbeidsgivernavn}
                </TekstMedEllipsis>
            </Navn>
            <Organisasjonsnummer>
                (
                <Clipboard copyMessage="Organisasjonsnummer er kopiert" dataTip="Kopier organisasjonsnummer">
                    {anonymiseringEnabled
                        ? getAnonymArbeidsgiverForOrgnr(inntektskilde.organisasjonsnummer).orgnr
                        : inntektskilde.organisasjonsnummer}
                </Clipboard>
                )
            </Organisasjonsnummer>
            <Kilde type="Ainntekt">AA</Kilde>
        </Header>
        <Bransjer as="p">
            {`BRANSJE${inntektskilde.bransjer.length > 1 ? 'R' : ''}: `}
            {anonymiseringEnabled ? 'Agurkifisert bransje' : inntektskilde.bransjer.join(', ')}
        </Bransjer>
        <ArbeidsforholdTabell>
            {inntektskilde.arbeidsforhold?.[0] && (
                <Arbeidsforhold anonymiseringEnabled={anonymiseringEnabled} {...inntektskilde.arbeidsforhold[0]} />
            )}
        </ArbeidsforholdTabell>
        <Inntekt omregnetÅrsinntekt={inntektskilde.omregnetÅrsinntekt} />
        <Tooltip effect="solid" />
    </FlexColumn>
);
