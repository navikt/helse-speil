import styled from '@emotion/styled';
import React from 'react';

import { Bag } from '@navikt/ds-icons';
import { BodyShort } from '@navikt/ds-react';

import { FlexColumn } from '../../../components/Flex';
import { Kilde } from '../../../components/Kilde';
import { TekstMedEllipsis } from '../../../components/TekstMedEllipsis';
import { Tooltip } from '../../../components/Tooltip';
import { Clipboard } from '../../../components/clipboard';
import {
    useArbeidsforholdRender,
    useArbeidsgiverbransjerRender,
    useArbeidsgivernavnRender,
    useOrganisasjonsnummerRender,
} from '../../../state/person';

import { Arbeidsforhold } from '../Arbeidsforhold';
import { Inntekt } from './inntekt/Inntekt';
import { kanOverstyreArbeidsforholdUtenSykdom } from '../../../featureToggles';
import { OverstyrArbeidsforholdUtenSykdom } from './OverstyrArbeidsforholdUtenSykdom';

const Container = styled(FlexColumn)`
    padding-right: 2rem;
`;

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
    inntekt: ExternalArbeidsgiverinntekt;
}

export const Inntektskilderinnhold = ({ inntekt }: InntektskilderinnholdProps) => {
    const arbeidsgivernavn = useArbeidsgivernavnRender(inntekt.organisasjonsnummer);
    const organisasjonsnummer = useOrganisasjonsnummerRender(inntekt.organisasjonsnummer);
    const bransjer = useArbeidsgiverbransjerRender(inntekt.organisasjonsnummer);
    const arbeidsforhold = useArbeidsforholdRender(inntekt.organisasjonsnummer);

    // TODO: denne vises nå alltid lokalt/ i dev, må sjekk om arbeidsforholdet er ghost
    //  må også sjekke at det er en periode til godkjenning
    const skalViseOverstyringAvArbeidsforhold = kanOverstyreArbeidsforholdUtenSykdom;

    return (
        <Container>
            <Header>
                <Bag width={20} height={20} />
                <Navn data-tip="Arbeidsgivernavn">
                    <TekstMedEllipsis>{arbeidsgivernavn}</TekstMedEllipsis>
                </Navn>
                <Organisasjonsnummer>
                    (
                    <Clipboard copyMessage="Organisasjonsnummer er kopiert" dataTip="Kopier organisasjonsnummer">
                        {organisasjonsnummer}
                    </Clipboard>
                    )
                </Organisasjonsnummer>
                <Kilde type="Ainntekt">AA</Kilde>
            </Header>
            <Bransjer as="p">
                {`BRANSJE${bransjer.length > 1 ? 'R' : ''}: `}
                {bransjer.join(', ')}
            </Bransjer>
            <ArbeidsforholdTabell className="ArbeidsforholdTabell">
                {arbeidsforhold.map((it, i) => (
                    <Arbeidsforhold
                        key={i}
                        startdato={it.startdato}
                        sluttdato={it.sluttdato}
                        stillingsprosent={it.stillingsprosent}
                        stillingstittel={it.stillingstittel}
                    />
                ))}
            </ArbeidsforholdTabell>
            <Inntekt
                omregnetÅrsinntekt={inntekt.omregnetÅrsinntekt}
                organisasjonsnummer={inntekt.organisasjonsnummer}
            />
            <Tooltip effect="solid" />
            {skalViseOverstyringAvArbeidsforhold && (
                <OverstyrArbeidsforholdUtenSykdom organisasjonsnummer={organisasjonsnummer} />
            )}
        </Container>
    );
};
