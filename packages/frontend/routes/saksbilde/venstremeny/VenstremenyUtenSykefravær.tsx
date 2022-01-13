import styled from '@emotion/styled';
import React from 'react';
import { ArbeidsgiverCard } from './ArbeidsgiverCard';
import { PopoverHjelpetekst } from '../../../components/PopoverHjelpetekst';
import { SortInfoikon } from '../../../components/ikoner/SortInfoikon';
import { BodyShort } from '@navikt/ds-react';
import { getMonthName, somPenger } from '../../../utils/locale';
import { sorterInntekterFraAOrdningen } from '../../../utils/inntekt';
import { CardTitle } from './CardTitle';

const Container = styled.section`
    grid-area: venstremeny;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    box-sizing: border-box;
    min-width: var(--speil-venstremeny-width);
    padding: 2rem 1.5rem;
    border-right: 1px solid var(--navds-color-border);
`;

const Tabell = styled.div`
    display: grid;
    grid-template-columns: 140px auto;
    grid-column-gap: 1rem;
    grid-row-gap: 0.25rem;
`;

const Verdi = styled(BodyShort)`
    text-align: right;
`;

const Bold = styled(BodyShort)`
    font-weight: 600;
`;

styled(Bold)`
    text-align: right;
`;

const Tittellinje = styled.div`
    display: flex;
    margin-bottom: 1.25rem;
    align-items: center;
`;
const InfobobleContainer = styled.div`
    min-height: 24px;
    margin-left: 1rem;
`;

interface VenstreMenyUtenSykefraværProps {
    organisasjonsnummer: string;
    omregnetÅrsinntekt: ExternalOmregnetÅrsinntekt | null;
}

export const VenstreMenyUtenSykefravær = ({
    organisasjonsnummer,
    omregnetÅrsinntekt,
}: VenstreMenyUtenSykefraværProps) => {
    return (
        <Container className="Venstremeny">
            <ArbeidsgiverCard organisasjonsnummer={organisasjonsnummer} />
            {omregnetÅrsinntekt && <InntektFraAordningenTabell omregnetÅrsinntekt={omregnetÅrsinntekt} />}
        </Container>
    );
};

const InntektFraAordningenTabell = ({ omregnetÅrsinntekt }: { omregnetÅrsinntekt: ExternalOmregnetÅrsinntekt }) => (
    <div>
        <Tittellinje>
            <CardTitle>RAPPORTERT SISTE 3 MÅNEDER</CardTitle>
            <InfobobleContainer>
                <PopoverHjelpetekst ikon={<SortInfoikon />}>
                    <p>
                        Ved manglende inntektsmelding legges 3 siste måneders innrapporterte inntekter fra A-ordningen
                        til grunn
                    </p>
                </PopoverHjelpetekst>
            </InfobobleContainer>
        </Tittellinje>
        <Tabell>
            {sorterInntekterFraAOrdningen(omregnetÅrsinntekt.inntekterFraAOrdningen)?.map((inntekt, i) => (
                <React.Fragment key={i}>
                    <BodyShort as="p"> {getMonthName(inntekt.måned)}</BodyShort>
                    <Verdi as="p">{somPenger(inntekt.sum)}</Verdi>
                </React.Fragment>
            ))}
        </Tabell>
    </div>
);
