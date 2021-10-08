import styled from '@emotion/styled';
import React from 'react';

import { AgurkErrorBoundary } from '../../../components/AgurkErrorBoundary';
import { førsteVedtaksperiode, getSkjæringstidspunkt } from '../../../mapping/selectors';
import {
    useOrganisasjonsnummer,
    usePersondataSkalAnonymiseres,
    useVilkårsgrunnlaghistorikk,
} from '../../../state/person';
import { NORSK_DATOFORMAT } from '../../../utils/date';

import { BehandletSykepengegrunnlag } from './BehandletSykepengegrunnlag';
import { SykepengegrunnlagFraInfogtrygd } from './SykepengegrunnlagFraInfotrygd';
import { UbehandletSykepengegrunnlag } from './UbehandletSykepengegrunnlag';

const Container = styled.section`
    width: 100%;
    height: 100%;
    padding-top: 2rem;
    box-sizing: border-box;
    overflow-x: scroll;
`;

interface SykepengegrunnlagProps {
    vedtaksperiode: Vedtaksperiode;
    person: Person;
    vilkårsgrunnlaghistorikkId: UUID;
    skjæringstidspunkt: DateString;
}

export const Sykepengegrunnlag = ({
    vedtaksperiode,
    person,
    vilkårsgrunnlaghistorikkId,
    skjæringstidspunkt,
}: SykepengegrunnlagProps) => {
    const organisasjonsnummer = useOrganisasjonsnummer();
    const vilkårsgrunnlag = useVilkårsgrunnlaghistorikk(skjæringstidspunkt, vilkårsgrunnlaghistorikkId);
    const { periodetype, inntektsgrunnlag, behandlet } = vedtaksperiode;
    const anonymiseringEnabled = usePersondataSkalAnonymiseres();

    const arbeidsgiverinntekt = inntektsgrunnlag.inntekter.find(
        (it) => it.organisasjonsnummer === inntektsgrunnlag.organisasjonsnummer
    );

    return (
        <Container className="Sykepengegrunnlag">
            <AgurkErrorBoundary>
                {periodetype === 'førstegangsbehandling' && !behandlet ? (
                    vilkårsgrunnlag?.vilkårsgrunnlagtype === 'SPLEIS' && (
                        <UbehandletSykepengegrunnlag
                            vilkårsgrunnlag={vilkårsgrunnlag as ExternalSpleisVilkårsgrunnlag}
                            organisasjonsnummer={organisasjonsnummer}
                        />
                    )
                ) : periodetype === 'infotrygdforlengelse' ? (
                    <SykepengegrunnlagFraInfogtrygd
                        vilkårsgrunnlag={vilkårsgrunnlag as ExternalInfotrygdVilkårsgrunnlag}
                        organisasjonsnummer={organisasjonsnummer}
                    />
                ) : (
                    <BehandletSykepengegrunnlag
                        førstePeriode={førsteVedtaksperiode(vedtaksperiode, person)}
                        skjæringstidspunkt={
                            getSkjæringstidspunkt(vedtaksperiode)?.format(NORSK_DATOFORMAT) ?? 'Ukjent dato'
                        }
                        inntektsgrunnlag={inntektsgrunnlag}
                        inntektskilde={arbeidsgiverinntekt}
                        anonymiseringEnabled={anonymiseringEnabled}
                    />
                )}
            </AgurkErrorBoundary>
        </Container>
    );
};
