import React from 'react';
import styled from '@emotion/styled';
import { NORSK_DATOFORMAT } from '../../../utils/date';
import { Arbeidsgiverinntekt, Inntektsgrunnlag, Periodetype, Person, Vedtaksperiode } from 'internal-types';
import { førsteVedtaksperiode, skjæringstidspunktForPeriode } from '../../../mapping/selectors';
import { BehandletAvInfotrygdVarsel, BehandletVarsel } from '@navikt/helse-frontend-varsel';
import { AgurkErrorBoundary } from '../../../components/AgurkErrorBoundary';
import Inntektskilderinnhold from './Inntektskilderinnhold';
import Inntektsgrunnlaginnhold from './Inntektsgrunnlaginnhold';
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
}

const SykepengegrunnlagFraInfogtrygd = ({ inntektsgrunnlag, inntekt }: SykepengegrunnlagFraInfogtrygdProps) => (
    <StyledBehandletAvInfotrygd tittel="Sykepengegrunnlag satt i Infotrygd">
        <OversiktContainer>
            <Inntektskilderinnhold inntektskilde={inntekt!} />
            <Strek />
            <SykepengegrunnlagInfotrygd inntektsgrunnlag={inntektsgrunnlag} />
        </OversiktContainer>
    </StyledBehandletAvInfotrygd>
);

interface UbehandletSykepengegrunnlagProps {
    inntektsgrunnlag: Inntektsgrunnlag;
    inntektskilde?: Arbeidsgiverinntekt;
}

const UbehandletSykepengegrunnlag = ({ inntektsgrunnlag, inntektskilde }: UbehandletSykepengegrunnlagProps) => (
    <OversiktContainer>
        <Inntektskilderinnhold inntektskilde={inntektskilde!} />
        <Strek />
        <Inntektsgrunnlaginnhold inntektsgrunnlag={inntektsgrunnlag} />
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
}: BehandletSykepengegrunnlagProps) => (
    <StyledBehandletInnhold
        tittel={`Sykepengegrunnlag satt ved skjæringstidspunkt - ${skjæringstidspunkt}`}
        saksbehandler={førstePeriode?.godkjentAv!}
        vurderingsdato={førstePeriode?.godkjenttidspunkt?.format(NORSK_DATOFORMAT)}
        automatiskBehandlet={førstePeriode.automatiskBehandlet}
    >
        <UbehandletSykepengegrunnlag inntektsgrunnlag={inntektsgrunnlag} inntektskilde={inntektskilde} />
    </StyledBehandletInnhold>
);

interface SykepengegrunnlagProps {
    vedtaksperiode: Vedtaksperiode;
    person: Person;
}

export const Sykepengegrunnlag = ({ vedtaksperiode, person }: SykepengegrunnlagProps) => {
    const { periodetype, inntektsgrunnlag, behandlet } = vedtaksperiode;

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
                    />
                ) : periodetype === Periodetype.Infotrygdforlengelse ? (
                    <SykepengegrunnlagFraInfogtrygd
                        inntektsgrunnlag={inntektsgrunnlag}
                        inntekt={arbeidsgiverinntekt!}
                    />
                ) : (
                    <BehandletSykepengegrunnlag
                        førstePeriode={førsteVedtaksperiode(vedtaksperiode, person)}
                        skjæringstidspunkt={
                            skjæringstidspunktForPeriode(vedtaksperiode)?.format(NORSK_DATOFORMAT) ?? 'Ukjent dato'
                        }
                        inntektsgrunnlag={inntektsgrunnlag}
                        inntektskilde={arbeidsgiverinntekt}
                    />
                )}
            </AgurkErrorBoundary>
        </Sykepengegrunnlagpanel>
    );
};
