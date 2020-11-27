import React from 'react';
import styled from '@emotion/styled';
import { Feilikon } from '../../../components/ikoner/Feilikon';
import { Sjekkikon } from '../../../components/ikoner/Sjekkikon';
import { Normaltekst } from 'nav-frontend-typografi';
import { Advarselikon } from '../../../components/ikoner/Advarselikon';
import { tilKategoriserteVilkår } from '../Vilkår/tilKategoriserteVilkår';
import { Vedtaksperiode } from 'internal-types';
import { Varsel, Varseltype } from '@navikt/helse-frontend-varsel';

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

export const Vilkårsliste = ({ vedtaksperiode }: { vedtaksperiode: Vedtaksperiode }) => {
    const { ikkeVurderteVilkår, ikkeOppfylteVilkår, ...oppfylteVilkår } = tilKategoriserteVilkår(vedtaksperiode);

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
