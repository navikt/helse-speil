import { Sjekkikon } from '../../../components/ikoner/Sjekkikon';
import { Feilikon } from '../../../components/ikoner/Feilikon';
import { Advarselikon } from '../../../components/ikoner/Advarselikon';
import styled from '@emotion/styled';
import { Normaltekst } from 'nav-frontend-typografi';
import React from 'react';
import { Basisvilkår, Risikovurdering, Vedtaksperiode } from 'internal-types';
import dayjs, { Dayjs } from 'dayjs';

const VilkRoversikt = styled.div`
    display: flex;
    align-items: flex-start;
    margin-bottom: 0.75rem;
`;

const Vilkårnavn = styled(Normaltekst)`
    margin-left: 1rem;
`;

const Vilkårikon = styled.span`
    display: flex;
    flex-shrink: 0;
    width: 20px;
    height: 24px;
    align-items: center;
    justify-content: center;
`;

export enum Vurdering {
    IkkeVurdert,
    IkkeOppfylt,
    Oppfylt,
}

const vurderingsikon = (vurdering: Vurdering) => {
    switch (vurdering) {
        case Vurdering.Oppfylt:
            return <Sjekkikon />;
        case Vurdering.IkkeOppfylt:
            return <Feilikon />;
        case Vurdering.IkkeVurdert:
            return <Advarselikon />;
    }
};

export interface VurdertVilkår {
    vurdering: Vurdering;
    navn: string;
}

export const arbeidsuførhet = (risikovurdering?: Risikovurdering): Basisvilkår => ({
    oppfylt:
        risikovurdering === undefined || risikovurdering.ufullstendig
            ? undefined
            : risikovurdering.arbeidsuførhetvurdering.length === 0,
});

export const institusjonsopphold = (godkjenttidspunkt?: Dayjs): Basisvilkår => ({
    oppfylt: godkjenttidspunkt?.isAfter(dayjs('10-04-2020')) || undefined, // Ble lagt på sjekk i spleis 30/09/20
});

export const vurdering = (vilkår?: Basisvilkår): Vurdering => {
    if (vilkår === undefined || vilkår.oppfylt === undefined) {
        return Vurdering.IkkeVurdert;
    }
    return vilkår.oppfylt ? Vurdering.Oppfylt : Vurdering.IkkeOppfylt;
};

const vilkårsliste = (vedtaksperiode: Vedtaksperiode): VurdertVilkår[] =>
    vedtaksperiode.vilkår
        ? [
              {
                  navn: 'Arbeidsuførhet, aktivitetsplikt og medvirkning',
                  vurdering: vurdering(arbeidsuførhet(vedtaksperiode.risikovurdering)),
              },
              {
                  navn: 'Lovvalg og medlemsskap',
                  vurdering: vurdering(vedtaksperiode.vilkår.medlemskap),
              },
              {
                  navn: 'Under 70 år',
                  vurdering: vurdering(vedtaksperiode.vilkår.alder),
              },
              {
                  navn: 'Dager igjen',
                  vurdering: vurdering(vedtaksperiode.vilkår.dagerIgjen),
              },
              {
                  navn: 'Søknadsfrist',
                  vurdering: vurdering(vedtaksperiode.vilkår.søknadsfrist),
              },
              {
                  navn: 'Opptjeningstid',
                  vurdering: vurdering(vedtaksperiode.vilkår.opptjening),
              },
              {
                  navn: 'Krav til minste sykepengegrunnlag',
                  vurdering: vurdering(vedtaksperiode.vilkår.sykepengegrunnlag),
              },
              {
                  navn: 'Ingen institusjonsopphold',
                  vurdering: vurdering(institusjonsopphold(vedtaksperiode.godkjenttidspunkt)),
              },
          ].sort((a: VurdertVilkår, b: VurdertVilkår) => a.vurdering - b.vurdering)
        : [];

interface VurdertVilkårProps {
    vilkår: VurdertVilkår;
}

const VurdertVilkår = ({ vilkår }: VurdertVilkårProps) => (
    <VilkRoversikt>
        <Vilkårikon>{vurderingsikon(vilkår.vurdering)}</Vilkårikon>
        <Vilkårnavn>{vilkår.navn}</Vilkårnavn>
    </VilkRoversikt>
);

export const Vilkårsliste = ({ vedtaksperiode }: { vedtaksperiode: Vedtaksperiode }) => (
    <ul>
        {vilkårsliste(vedtaksperiode).map((v, i) => (
            <li key={i}>
                <VurdertVilkår vilkår={v} />
            </li>
        ))}
    </ul>
);
