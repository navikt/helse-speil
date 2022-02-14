import styled from '@emotion/styled';
import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { Varsel } from '@components/Varsel';
import { Feilikon } from '@components/ikoner/Feilikon';
import { Sjekkikon } from '@components/ikoner/Sjekkikon';
import { Advarselikon } from '@components/ikoner/Advarselikon';
import { usePersoninfo, useVilkårsgrunnlaghistorikk, useVurderingForSkjæringstidspunkt } from '@state/person';

import { kategoriserteInngangsvilkår } from '../vilkår/kategoriserteInngangsvilkår';

const ListItem = styled.li`
    display: flex;
    align-items: flex-start;
    line-height: 22px;
`;

const Navn = styled(BodyShort)`
    margin-left: 1rem;
`;

const IconContainer = styled.span`
    display: flex;
    flex-shrink: 0;
    width: 16px;
    height: 22px;
    align-items: center;
    justify-content: center;
`;

interface VilkårListProps {
    periode: TidslinjeperiodeMedSykefravær;
    skjæringstidspunkt: DateString;
    vilkårsgrunnlaghistorikkId: UUID;
}

export const VilkårList = ({ periode, skjæringstidspunkt, vilkårsgrunnlaghistorikkId }: VilkårListProps) => {
    const vilkårsgrunnlag = useVilkårsgrunnlaghistorikk(skjæringstidspunkt, vilkårsgrunnlaghistorikkId);
    const personinfo = usePersoninfo();
    const alderVedSkjæringstidspunkt = periode.fom.diff(personinfo.fødselsdato, 'year');
    const vurdering = useVurderingForSkjæringstidspunkt(periode.unique, skjæringstidspunkt);

    if (!vilkårsgrunnlag) {
        return <Varsel variant="feil">Vilkår mangler</Varsel>;
    }

    const { ikkeVurderteVilkår, ikkeOppfylteVilkår, ...oppfylteVilkår } = kategoriserteInngangsvilkår(
        vilkårsgrunnlag,
        alderVedSkjæringstidspunkt,
        vurdering
    );

    return (
        <ul>
            {ikkeOppfylteVilkår?.map((vilkår, i) => (
                <ListItem key={i}>
                    <IconContainer data-tip="Ikke oppfylt">
                        <Feilikon alt="Ikke oppfylt" />
                    </IconContainer>
                    <Navn as="p">{vilkår.tittel}</Navn>
                </ListItem>
            ))}
            {ikkeVurderteVilkår?.map((vilkår, i) => (
                <ListItem key={i}>
                    <IconContainer data-tip="Til vurdering">
                        <Advarselikon alt="Til vurdering" />
                    </IconContainer>
                    <Navn as="p">{vilkår.tittel}</Navn>
                </ListItem>
            ))}
            {Object.values(oppfylteVilkår ?? {})
                .flat()
                .map((vilkår, i) => (
                    <ListItem key={i}>
                        <IconContainer data-tip="Oppfylt">
                            <Sjekkikon alt="Oppfylt" />
                        </IconContainer>
                        <Navn as="p">{vilkår.tittel}</Navn>
                    </ListItem>
                ))}
        </ul>
    );
};
