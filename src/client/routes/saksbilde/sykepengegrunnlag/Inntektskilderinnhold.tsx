import styled from '@emotion/styled';
import { Arbeidsgiverinntekt, Kildetype } from 'internal-types';
import React from 'react';

import { Undertekst, Undertittel } from 'nav-frontend-typografi';

import { Flex, FlexColumn } from '../../../components/Flex';
import { Kilde } from '../../../components/Kilde';
import { TekstMedEllipsis } from '../../../components/TekstMedEllipsis';
import { Tooltip } from '../../../components/Tooltip';
import { Clipboard } from '../../../components/clipboard';
import { Arbeidsgiverikon } from '../../../components/ikoner/Arbeidsgiverikon';

import { getAnonymArbeidsgiverForOrgnr } from '../../../agurkdata';
import { Arbeidsforhold } from '../Arbeidsforhold';
import { Inntekt } from './inntekt/Inntekt';

const Arbeidsgivertittel = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 1rem;

    > *:not(:last-child) {
        margin-right: 1rem;
    }
`;

const Bransjer = styled(Undertekst)`
    margin-bottom: 0.5rem;
    color: var(--navds-color-text-disabled);
`;

const Tittel = styled(Undertittel)`
    display: flex;
    align-items: center;
    font-size: 18px;
    color: var(--navds-color-text-primary);

    ${({ maxwidth }: { maxwidth?: string }) => maxwidth && `max-width: ${maxwidth};`}
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

const Inntektskilderinnhold = ({ inntektskilde, anonymiseringEnabled }: InntektskilderinnholdProps) => {
    const { arbeidsgivernavn, organisasjonsnummer, arbeidsforhold, bransjer, omregnetÅrsinntekt } = inntektskilde;

    return (
        <FlexColumn>
            <Arbeidsgivertittel>
                <Arbeidsgiverikon />
                <Tittel maxwidth="500px">
                    <TekstMedEllipsis data-tip="Arbeidsgivernavn">
                        {anonymiseringEnabled
                            ? getAnonymArbeidsgiverForOrgnr(organisasjonsnummer).navn
                            : arbeidsgivernavn}
                    </TekstMedEllipsis>
                    <Flex style={{ margin: '0 4px' }}>
                        (
                        <Clipboard copyMessage="Organisasjonsnummer er kopiert" dataTip="Kopier organisasjonsnummer">
                            {anonymiseringEnabled
                                ? getAnonymArbeidsgiverForOrgnr(organisasjonsnummer).orgnr
                                : organisasjonsnummer}
                        </Clipboard>
                        )
                    </Flex>
                </Tittel>
                <Kilde type={Kildetype.Ainntekt}>AA</Kilde>
            </Arbeidsgivertittel>
            <Bransjer>
                {`BRANSJE${bransjer.length > 1 ? 'R' : ''}: `}
                {anonymiseringEnabled ? 'Agurkifisert bransje' : bransjer.join(', ')}
            </Bransjer>
            <ArbeidsforholdTabell>
                {arbeidsforhold?.[0] && (
                    <Arbeidsforhold anonymiseringEnabled={anonymiseringEnabled} {...arbeidsforhold[0]} />
                )}
            </ArbeidsforholdTabell>
            <Inntekt omregnetÅrsinntekt={omregnetÅrsinntekt} />
            <Tooltip effect="solid" />
        </FlexColumn>
    );
};

export default Inntektskilderinnhold;
