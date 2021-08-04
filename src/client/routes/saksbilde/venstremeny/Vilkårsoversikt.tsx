import styled from '@emotion/styled';
import { Vedtaksperiode } from 'internal-types';
import React from 'react';

import { Normaltekst } from 'nav-frontend-typografi';

import { Varsel, Varseltype } from '@navikt/helse-frontend-varsel';

import { Advarselikon } from '../../../components/ikoner/Advarselikon';
import { Feilikon } from '../../../components/ikoner/Feilikon';
import { Sjekkikon } from '../../../components/ikoner/Sjekkikon';

import { kategoriserteInngangsvilkår } from '../vilkår/tilKategoriserteVilkår';

const Vilkåroversikt = styled.li`
    display: flex;
    align-items: flex-start;
    line-height: 22px;
`;

const Vilkårnavn = styled(Normaltekst)`
    margin-left: 1rem;
`;

const Vilkårikon = styled.span`
    display: flex;
    flex-shrink: 0;
    width: 16px;
    height: 22px;
    align-items: center;
    justify-content: center;
`;

const vurderingsikon = (vurdering?: boolean) =>
    vurdering === undefined ? <Advarselikon /> : vurdering ? <Sjekkikon /> : <Feilikon />;

interface VurdertVilkårProps {
    tittel: string;
    oppfylt?: boolean;
}

const VurdertVilkår = ({ tittel, oppfylt }: VurdertVilkårProps) => (
    <Vilkåroversikt>
        <Vilkårikon>{vurderingsikon(oppfylt)}</Vilkårikon>
        <Vilkårnavn>{tittel}</Vilkårnavn>
    </Vilkåroversikt>
);

interface VilkårslisteProps {
    vedtaksperiode: Vedtaksperiode;
}

export const Vilkårsoversikt = ({ vedtaksperiode }: VilkårslisteProps) => {
    const { ikkeVurderteVilkår, ikkeOppfylteVilkår, ...oppfylteVilkår } = kategoriserteInngangsvilkår(vedtaksperiode);

    if (!ikkeVurderteVilkår && !ikkeOppfylteVilkår && !oppfylteVilkår) {
        return <Varsel type={Varseltype.Feil}>Vilkår mangler</Varsel>;
    }

    return (
        <ul>
            {ikkeOppfylteVilkår?.map((vilkår, i) => (
                <VurdertVilkår key={i} tittel={vilkår.tittel} oppfylt={false} />
            ))}
            {ikkeVurderteVilkår?.map((vilkår, i) => (
                <VurdertVilkår key={i} tittel={vilkår.tittel} />
            ))}
            {Object.values(oppfylteVilkår ?? {})
                .flat()
                .map((vilkår, i) => (
                    <VurdertVilkår key={i} tittel={vilkår.tittel} oppfylt />
                ))}
        </ul>
    );
};
