import dayjs from 'dayjs';
import React, { ReactElement } from 'react';

import { Alert } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import {
    BeregnetPeriodeFragment,
    PersonFragment,
    VilkarsgrunnlagInfotrygdV2,
    VilkarsgrunnlagSpleisV2,
    Vurdering,
} from '@io/graphql';
import { getRequiredVilkårsgrunnlag } from '@state/utils';
import { DateString } from '@typer/shared';
import { Vilkårdata } from '@typer/vilkår';

import { kategoriserteInngangsvilkår } from './kategoriserteInngangsvilkår';
import { IkkeOppfylteVilkår } from './vilkårsgrupper/IkkeOppfylteVilkår';
import { IkkeVurderteVilkår } from './vilkårsgrupper/IkkeVurderteVilkår';
import { OppfylteVilkår } from './vilkårsgrupper/OppfylteVilkår';
import { VurdertIInfotrygd } from './vilkårsgrupper/VurdertIInfotrygd';
import { VurdertISpleis } from './vilkårsgrupper/VurdertISpleis';

import styles from './Inngangsvilkår.module.css';

const harVilkår = (vilkår?: Vilkårdata[]): vilkår is Vilkårdata[] =>
    vilkår !== undefined && vilkår !== null && vilkår.length > 0;

interface InngangsvilkårWithContentProps {
    periodeFom: DateString;
    vilkårsgrunnlag: VilkarsgrunnlagSpleisV2 | VilkarsgrunnlagInfotrygdV2;
    fødselsdato: DateString;
    vurdering?: Vurdering | null;
}

export const InngangsvilkårWithContent = ({
    periodeFom,
    vilkårsgrunnlag,
    fødselsdato,
    vurdering,
}: InngangsvilkårWithContentProps) => {
    const alderVedSkjæringstidspunkt = dayjs(vilkårsgrunnlag.skjaeringstidspunkt).diff(fødselsdato, 'year');

    const { oppfylteVilkår, ikkeVurderteVilkår, ikkeOppfylteVilkår, vilkårVurdertIInfotrygd, vilkårVurdertISpleis } =
        kategoriserteInngangsvilkår(vilkårsgrunnlag, alderVedSkjæringstidspunkt, vurdering);

    const harBehandledeVilkår =
        harVilkår(ikkeVurderteVilkår) || harVilkår(ikkeOppfylteVilkår) || harVilkår(oppfylteVilkår);

    const harAlleredeVurderteVilkår = harVilkår(vilkårVurdertISpleis) || harVilkår(vilkårVurdertIInfotrygd);

    return (
        <div className={styles.Inngangsvilkår}>
            {harBehandledeVilkår && (
                <div className={styles.Flex}>
                    {harVilkår(ikkeVurderteVilkår) && <IkkeVurderteVilkår vilkår={ikkeVurderteVilkår} />}
                    {harVilkår(ikkeOppfylteVilkår) && <IkkeOppfylteVilkår vilkår={ikkeOppfylteVilkår} />}
                    {harVilkår(oppfylteVilkår) && <OppfylteVilkår vilkår={oppfylteVilkår} />}
                </div>
            )}
            {harAlleredeVurderteVilkår && (
                <div className={styles.VurderteVilkår}>
                    {harVilkår(vilkårVurdertISpleis) && vurdering && (
                        <VurdertISpleis
                            vilkår={vilkårVurdertISpleis}
                            ident={vurdering.ident}
                            skjæringstidspunkt={vilkårsgrunnlag.skjaeringstidspunkt}
                            automatiskBehandlet={vurdering.automatisk}
                            erForlengelse={dayjs(periodeFom).isAfter(vilkårsgrunnlag.skjaeringstidspunkt)}
                        />
                    )}
                    {harVilkår(vilkårVurdertIInfotrygd) && <VurdertIInfotrygd vilkår={vilkårVurdertIInfotrygd} />}
                </div>
            )}
        </div>
    );
};

interface InngangsvilkårContainerProps {
    person: PersonFragment;
    periode: BeregnetPeriodeFragment;
}

const InngangsvilkårContainer = ({ person, periode }: InngangsvilkårContainerProps): ReactElement | null => (
    <InngangsvilkårWithContent
        vurdering={periode.utbetaling.vurdering}
        periodeFom={periode.fom}
        vilkårsgrunnlag={getRequiredVilkårsgrunnlag(person, periode.vilkarsgrunnlagId)}
        fødselsdato={person.personinfo.fodselsdato!}
    />
);

const InngangsvilkårError = (): ReactElement => (
    <Alert variant="error" size="small">
        Noe gikk galt. Kan ikke vise inngangsvilkår for denne perioden.
    </Alert>
);

interface InngangsvilkårProps {
    person: PersonFragment;
    periode: BeregnetPeriodeFragment;
}

export const Inngangsvilkår = ({ person, periode }: InngangsvilkårProps): ReactElement => (
    <ErrorBoundary fallback={<InngangsvilkårError />}>
        <InngangsvilkårContainer person={person} periode={periode} />
    </ErrorBoundary>
);
