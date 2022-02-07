import styled from '@emotion/styled';
import React from 'react';

import { Bag } from '@navikt/ds-icons';

import { FlexColumn } from '../../../components/Flex';
import { Kilde } from '../../../components/Kilde';
import { AnonymizableTextWithEllipsis } from '../../../components/TextWithEllipsis';
import { Tooltip } from '../../../components/Tooltip';
import { Clipboard } from '../../../components/clipboard';
import { useArbeidsgiverbransjer, useArbeidsgivernavn } from '../../../state/person';

import { Arbeidsforhold } from '../Arbeidsforhold';
import { Inntekt } from './inntekt/Inntekt';
import { defaultOverstyrToggles } from '../../../featureToggles';
import { useAktivPeriode, useMaybePeriodeTilGodkjenning } from '../../../state/tidslinje';
import { AnonymizableText } from '../../../components/anonymizable/AnonymizableText';
import { AnonymizableContainer } from '../../../components/anonymizable/AnonymizableContainer';
import { useArbeidsforhold, useHarDeaktiverArbeidsforholdFor } from '../../../modell/arbeidsgiver';

const Container = styled(FlexColumn)`
    padding-right: 2rem;
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    gap: 1rem;
`;

const Bransjer = styled(AnonymizableText)`
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
    const arbeidsgivernavn = useArbeidsgivernavn(inntekt.organisasjonsnummer);
    const bransjer = useArbeidsgiverbransjer(inntekt.organisasjonsnummer);
    const arbeidsforhold = useArbeidsforhold(inntekt.organisasjonsnummer);

    const aktivPeriode = useAktivPeriode();
    const harDeaktivertArbeidsforhold = useHarDeaktiverArbeidsforholdFor(
        inntekt.organisasjonsnummer,
        aktivPeriode.skjæringstidspunkt!
    );

    const skjæringstidspunkt = aktivPeriode.skjæringstidspunkt!;
    const periodeTilGodkjenning = useMaybePeriodeTilGodkjenning(skjæringstidspunkt);
    const organisasjonsnummerPeriodeTilGodkjenning = periodeTilGodkjenning
        ? periodeTilGodkjenning.organisasjonsnummer
        : undefined;

    const arbeidsforholdKanOverstyres =
        defaultOverstyrToggles.overstyrArbeidsforholdUtenSykefraværEnabled &&
        aktivPeriode.organisasjonsnummer === inntekt.organisasjonsnummer &&
        aktivPeriode.tilstand === 'utenSykefravær' &&
        periodeTilGodkjenning !== undefined;

    return (
        <Container>
            <Header>
                <Bag width={20} height={20} />
                <Navn data-tip="Arbeidsgivernavn">
                    <AnonymizableTextWithEllipsis>{arbeidsgivernavn}</AnonymizableTextWithEllipsis>
                </Navn>
                <Organisasjonsnummer>
                    (
                    <Clipboard copyMessage="Organisasjonsnummer er kopiert" dataTip="Kopier organisasjonsnummer">
                        <AnonymizableContainer>{inntekt.organisasjonsnummer}</AnonymizableContainer>
                    </Clipboard>
                    )
                </Organisasjonsnummer>
                <Kilde type="Ainntekt">AA</Kilde>
            </Header>
            <Bransjer>
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
                organisasjonsnummerPeriodeTilGodkjenning={organisasjonsnummerPeriodeTilGodkjenning}
                skjæringstidspunkt={skjæringstidspunkt}
                arbeidsforholdErDeaktivert={harDeaktivertArbeidsforhold}
                arbeidsforholdKanOverstyres={arbeidsforholdKanOverstyres}
            />
            <Tooltip effect="solid" />
        </Container>
    );
};
