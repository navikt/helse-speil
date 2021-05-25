import styled from '@emotion/styled';
import { Arbeidsgiverinntekt, Inntektsgrunnlag, Periodetype, Person, Vedtaksperiode } from 'internal-types';
import React from 'react';

import { BehandletAvInfotrygdVarsel, BehandletVarsel } from '@navikt/helse-frontend-varsel';

import { AgurkErrorBoundary } from '../../../components/AgurkErrorBoundary';
import { førsteVedtaksperiode, skjæringstidspunktForPeriode } from '../../../mapping/selectors';
import { useSkalAnonymiserePerson } from '../../../state/person';
import { NORSK_DATOFORMAT } from '../../../utils/date';

import Inntektsgrunnlaginnhold from './Inntektsgrunnlaginnhold';
import Inntektskilderinnhold from './Inntektskilderinnhold';
import SykepengegrunnlagInfotrygd from './SykepengegrunnlagInfotrygd';

const StyledBehandletInnhold = styled(BehandletVarsel)`
    margin: 2rem 2rem;
    width: max-content;

    > p:nth-of-type(2) {
        margin-bottom: 1rem;
    }
`;

const StyledBehandletAvInfotrygd = styled(BehandletAvInfotrygdVarsel)`
    margin: 2rem 2rem;
    width: max-content;
`;

const Sykepengegrunnlagpanel = styled.div`
    max-width: 1265px;
    width: max-content;
    margin-top: 2rem;
`;

const OversiktContainer = styled.div`
    display: flex;
    align-content: space-between;
`;

const Strek = styled.span`
    border-right: 1px solid var(--navds-color-border);
    height: inherit;
    display: inline-block;
    margin-left: 5rem;
    margin-right: 2rem;
`;

interface SykepengegrunnlagFraInfogtrygdProps {
    inntektsgrunnlag: Inntektsgrunnlag;
    inntekt: Arbeidsgiverinntekt;
    anonymiseringEnabled: boolean;
}

const SykepengegrunnlagFraInfogtrygd = ({
    inntektsgrunnlag,
    inntekt,
    anonymiseringEnabled,
}: SykepengegrunnlagFraInfogtrygdProps) => (
    <StyledBehandletAvInfotrygd tittel="Sykepengegrunnlag satt i Infotrygd">
        <OversiktContainer>
            <Inntektskilderinnhold inntektskilde={inntekt!} anonymiseringEnabled={anonymiseringEnabled} />
            <Strek />
            <SykepengegrunnlagInfotrygd inntektsgrunnlag={inntektsgrunnlag} />
        </OversiktContainer>
    </StyledBehandletAvInfotrygd>
);

interface UbehandletSykepengegrunnlagProps {
    inntektsgrunnlag: Inntektsgrunnlag;
    inntektskilde?: Arbeidsgiverinntekt;
    anonymiseringEnabled: boolean;
}

const UbehandletSykepengegrunnlag = ({
    inntektsgrunnlag,
    inntektskilde,
    anonymiseringEnabled,
}: UbehandletSykepengegrunnlagProps) => (
    <OversiktContainer>
        <Inntektskilderinnhold inntektskilde={inntektskilde!} anonymiseringEnabled={anonymiseringEnabled} />
        <Strek />
        <Inntektsgrunnlaginnhold inntektsgrunnlag={inntektsgrunnlag} anonymiseringEnabled={anonymiseringEnabled} />
    </OversiktContainer>
);

interface BehandletSykepengegrunnlagProps extends UbehandletSykepengegrunnlagProps {
    førstePeriode: Vedtaksperiode;
    skjæringstidspunkt: string;
}

const BehandletSykepengegrunnlag = ({
    førstePeriode,
    skjæringstidspunkt,
    inntektsgrunnlag,
    inntektskilde,
    anonymiseringEnabled,
}: BehandletSykepengegrunnlagProps) => (
    <StyledBehandletInnhold
        tittel={`Sykepengegrunnlag satt ved skjæringstidspunkt - ${skjæringstidspunkt}`}
        saksbehandler={førstePeriode?.godkjentAv!}
        vurderingsdato={førstePeriode?.godkjenttidspunkt?.format(NORSK_DATOFORMAT)}
        automatiskBehandlet={førstePeriode.automatiskBehandlet}
    >
        <UbehandletSykepengegrunnlag
            inntektsgrunnlag={inntektsgrunnlag}
            inntektskilde={inntektskilde}
            anonymiseringEnabled={anonymiseringEnabled}
        />
    </StyledBehandletInnhold>
);

interface SykepengegrunnlagProps {
    vedtaksperiode: Vedtaksperiode;
    person: Person;
}

export const Sykepengegrunnlag = ({ vedtaksperiode, person }: SykepengegrunnlagProps) => {
    const { periodetype, inntektsgrunnlag, behandlet } = vedtaksperiode;
    const anonymiseringEnabled = useSkalAnonymiserePerson();

    const arbeidsgiverinntekt = inntektsgrunnlag.inntekter.find(
        (it) => it.organisasjonsnummer === inntektsgrunnlag.organisasjonsnummer
    );

    return (
        <Sykepengegrunnlagpanel>
            <AgurkErrorBoundary>
                {periodetype === Periodetype.Førstegangsbehandling && !behandlet ? (
                    <UbehandletSykepengegrunnlag
                        inntektsgrunnlag={inntektsgrunnlag}
                        inntektskilde={arbeidsgiverinntekt}
                        anonymiseringEnabled={anonymiseringEnabled}
                    />
                ) : periodetype === Periodetype.Infotrygdforlengelse ? (
                    <SykepengegrunnlagFraInfogtrygd
                        inntektsgrunnlag={inntektsgrunnlag}
                        inntekt={arbeidsgiverinntekt!}
                        anonymiseringEnabled={anonymiseringEnabled}
                    />
                ) : (
                    <BehandletSykepengegrunnlag
                        førstePeriode={førsteVedtaksperiode(vedtaksperiode, person)}
                        skjæringstidspunkt={
                            skjæringstidspunktForPeriode(vedtaksperiode)?.format(NORSK_DATOFORMAT) ?? 'Ukjent dato'
                        }
                        inntektsgrunnlag={inntektsgrunnlag}
                        inntektskilde={arbeidsgiverinntekt}
                        anonymiseringEnabled={anonymiseringEnabled}
                    />
                )}
            </AgurkErrorBoundary>
        </Sykepengegrunnlagpanel>
    );
};
