import styled from '@emotion/styled';
import React from 'react';
import { ArbeidsgiverCard } from './ArbeidsgiverCard';
import { PopoverHjelpetekst } from '../../../components/PopoverHjelpetekst';
import { SortInfoikon } from '../../../components/ikoner/SortInfoikon';
import { BodyShort } from '@navikt/ds-react';
import { getMonthName, somPenger } from '../../../utils/locale';
import { sorterInntekterFraAOrdningen } from '../../../utils/inntekt';
import { css } from '@emotion/react';

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
    margin-bottom: 0.25rem;
    align-items: center;
`;
const InfobobleContainer = styled.div`
    min-height: 24px;
    margin-left: 1rem;
`;
const InntektFraAordningenContainer = styled.div<{ deaktivert: boolean }>`
    ${(props) =>
        props.deaktivert &&
        css`
            background-color: var(--nav-ghost-deaktivert-bakgrunn);
            border: 1px solid var(--nav-ghost-deaktivert-border);
            padding: 2.25rem 1rem;
            position: relative;
            margin: 14px -15px;
        `}
`;

const DeaktivertPille = styled.div`
    position: absolute;
    top: -14px;
    left: 15px;
    background-color: var(--nav-ghost-deaktivert-pille-bakgrunn);
    border: 1px solid var(--nav-ghost-deaktivert-pille-border);
    padding: 5px 10px;
    border-radius: 4px;
`;

interface VenstreMenyUtenSykefraværProps {
    organisasjonsnummer: string;
    omregnetÅrsinntekt: ExternalOmregnetÅrsinntekt | null;
    deaktivert: boolean;
}

export const VenstreMenyUtenSykefravær = ({
    organisasjonsnummer,
    omregnetÅrsinntekt,
    deaktivert,
}: VenstreMenyUtenSykefraværProps) => {
    return (
        <Container className="Venstremeny">
            <ArbeidsgiverCard organisasjonsnummer={organisasjonsnummer} />
            {omregnetÅrsinntekt && (
                <InntektFraAordningenTabell omregnetÅrsinntekt={omregnetÅrsinntekt} deaktivert={deaktivert} />
            )}
        </Container>
    );
};

const Tittel = styled(BodyShort)`
    font-weight: 600;
`;

const InntektFraAordningenTabell = ({
    omregnetÅrsinntekt,
    deaktivert,
}: {
    omregnetÅrsinntekt: ExternalOmregnetÅrsinntekt;
    deaktivert: boolean;
}) => (
    <InntektFraAordningenContainer deaktivert={deaktivert}>
        {deaktivert && <DeaktivertPille>Brukes ikke i beregningen</DeaktivertPille>}
        <Tittellinje>
            <Tittel as="p">Rapportert siste 3 måneder</Tittel>
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
    </InntektFraAordningenContainer>
);
