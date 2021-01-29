import React from 'react';
import styled from '@emotion/styled';
import { Sykepengegrunnlaginnhold } from './Sykepengegrunnlaginnhold';
import { NORSK_DATOFORMAT } from '../../../utils/date';
import {
    Inntektsgrunnlag,
    Inntektskilde,
    Periodetype,
    Person,
    Sykepengegrunnlag as Sykepengegrunnlagtype,
    Vedtaksperiode,
} from 'internal-types';
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
    årsinntektFraInntektsmelding: number;
    inntektskilder: Inntektskilde[];
}

const SykepengegrunnlagFraInfogtrygd = ({
    årsinntektFraInntektsmelding,
    inntektskilder,
}: SykepengegrunnlagFraInfogtrygdProps) => (
    <StyledBehandletAvInfotrygd tittel="Sykepengegrunnlag satt i Infotrygd">
        <OversiktContainer>
            <Inntektskilderinnhold inntektskilder={inntektskilder} />
            <Strek />
            <SykepengegrunnlagInfotrygd årsinntektFraInntektsmelding={årsinntektFraInntektsmelding} />
        </OversiktContainer>
    </StyledBehandletAvInfotrygd>
);

interface UbehandletSykepengegrunnlagProps {
    inntektskilder: Inntektskilde[];
    sykepengegrunnlag: Sykepengegrunnlagtype;
    inntektsgrunnlag?: Inntektsgrunnlag;
}

const UbehandletSykepengegrunnlag = ({
    inntektsgrunnlag,
    inntektskilder,
    sykepengegrunnlag,
}: UbehandletSykepengegrunnlagProps) => (
    <OversiktContainer>
        <Inntektskilderinnhold inntektskilder={inntektskilder} />
        <Strek />
        {inntektsgrunnlag ? (
            <Inntektsgrunnlaginnhold inntektsgrunnlag={inntektsgrunnlag} />
        ) : (
            <Sykepengegrunnlaginnhold sykepengegrunnlag={sykepengegrunnlag} />
        )}
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
    inntektskilder,
    sykepengegrunnlag,
}: BehandletSykepengegrunnlagProps) => (
    <StyledBehandletInnhold
        tittel={`Sykepengegrunnlag satt ved skjæringstidspunkt - ${skjæringstidspunkt}`}
        saksbehandler={førstePeriode?.godkjentAv!}
        vurderingsdato={førstePeriode?.godkjenttidspunkt?.format(NORSK_DATOFORMAT)}
        automatiskBehandlet={førstePeriode.automatiskBehandlet}
    >
        <UbehandletSykepengegrunnlag
            inntektsgrunnlag={inntektsgrunnlag}
            inntektskilder={inntektskilder}
            sykepengegrunnlag={sykepengegrunnlag}
        />
    </StyledBehandletInnhold>
);

interface SykepengegrunnlagProps {
    vedtaksperiode: Vedtaksperiode;
    person: Person;
}

export const Sykepengegrunnlag = ({ vedtaksperiode, person }: SykepengegrunnlagProps) => {
    const { periodetype, inntektsgrunnlag, inntektskilder, sykepengegrunnlag, behandlet } = vedtaksperiode;

    return (
        <Sykepengegrunnlagpanel>
            <AgurkErrorBoundary>
                {periodetype === Periodetype.Førstegangsbehandling && !behandlet ? (
                    <UbehandletSykepengegrunnlag
                        inntektsgrunnlag={inntektsgrunnlag}
                        inntektskilder={inntektskilder}
                        sykepengegrunnlag={sykepengegrunnlag}
                    />
                ) : periodetype === Periodetype.Infotrygdforlengelse ? (
                    <SykepengegrunnlagFraInfogtrygd
                        årsinntektFraInntektsmelding={sykepengegrunnlag.årsinntektFraInntektsmelding!}
                        inntektskilder={vedtaksperiode.inntektskilder}
                    />
                ) : (
                    <BehandletSykepengegrunnlag
                        førstePeriode={førsteVedtaksperiode(vedtaksperiode, person)}
                        skjæringstidspunkt={
                            skjæringstidspunktForPeriode(vedtaksperiode)?.format(NORSK_DATOFORMAT) ?? 'Ukjent dato'
                        }
                        inntektskilder={inntektskilder}
                        inntektsgrunnlag={inntektsgrunnlag}
                        sykepengegrunnlag={sykepengegrunnlag}
                    />
                )}
            </AgurkErrorBoundary>
        </Sykepengegrunnlagpanel>
    );
};
