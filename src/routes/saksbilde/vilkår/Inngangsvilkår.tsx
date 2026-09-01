import dayjs from 'dayjs';
import { useParams } from 'next/navigation';
import React, { ReactElement } from 'react';

import { Alert } from '@navikt/ds-react';

import { ErrorBoundary } from '@components/ErrorBoundary';
import { useIsReadOnlyOppgave } from '@hooks/useIsReadOnlyOppgave';
import {
    BeregnetPeriodeFragment,
    PersonFragment,
    VilkarsgrunnlagInfotrygdV2,
    VilkarsgrunnlagSpleisV2,
    Vurdering,
} from '@io/graphql';
import { useGetPerson } from '@io/rest/generated/personer/personer';
import { OppfylteVilkår } from '@saksbilde/vilkår/vilkårsgrupper/OppfylteVilkår';
import { useAktivtInntektsforhold } from '@state/inntektsforhold/inntektsforhold';
import { useNyOpptjeningVisning } from '@state/toggles';
import { getRequiredVilkårsgrunnlag } from '@state/utils';
import { DateString } from '@typer/shared';
import { Vilkårdata } from '@typer/vilkår';
import { isSelvstendigNaering } from '@utils/typeguards';

import { kategoriserteInngangsvilkår } from './kategoriserteInngangsvilkår';
import { Opptjening } from './opptjening/Opptjening';
import { IkkeOppfylteVilkår } from './vilkårsgrupper/IkkeOppfylteVilkår';
import { IkkeVurderteVilkår } from './vilkårsgrupper/IkkeVurderteVilkår';
import { VurdertIInfotrygd } from './vilkårsgrupper/VurdertIInfotrygd';
import { VurdertISpleis } from './vilkårsgrupper/VurdertISpleis';

import styles from './Inngangsvilkår.module.css';

const harVilkår = (vilkår?: Vilkårdata[]): vilkår is Vilkårdata[] =>
    vilkår !== undefined && vilkår !== null && vilkår.length > 0;

interface InngangsvilkårWithContentProps {
    erSelvstendigNæring: boolean;
    periodeFom: DateString;
    vilkårsgrunnlag: VilkarsgrunnlagSpleisV2 | VilkarsgrunnlagInfotrygdV2;
    fødselsdato: DateString;
    vurdering?: Vurdering | null;
    opptjening?: ReactElement | null;
}

export const InngangsvilkårWithContent = ({
    erSelvstendigNæring,
    periodeFom,
    vilkårsgrunnlag,
    fødselsdato,
    vurdering,
    opptjening,
}: InngangsvilkårWithContentProps) => {
    const alderVedSkjæringstidspunkt = dayjs(vilkårsgrunnlag.skjaeringstidspunkt).diff(fødselsdato, 'year');

    const { oppfylteVilkår, ikkeVurderteVilkår, ikkeOppfylteVilkår, vilkårVurdertIInfotrygd, vilkårVurdertISpleis } =
        kategoriserteInngangsvilkår(
            erSelvstendigNæring,
            vilkårsgrunnlag,
            alderVedSkjæringstidspunkt,
            vurdering,
            opptjening != null,
        );

    const harBehandledeVilkår =
        harVilkår(ikkeVurderteVilkår) || harVilkår(ikkeOppfylteVilkår) || harVilkår(oppfylteVilkår);

    const harAlleredeVurderteVilkår = harVilkår(vilkårVurdertISpleis) || harVilkår(vilkårVurdertIInfotrygd);

    return (
        <div className={styles.Inngangsvilkår}>
            {opptjening}
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

const InngangsvilkårContainer = ({ person, periode }: InngangsvilkårContainerProps): ReactElement | null => {
    const inntektsforhold = useAktivtInntektsforhold(person);
    const nyOpptjeningVisning = useNyOpptjeningVisning();
    const readOnly = useIsReadOnlyOppgave(person);
    const { personPseudoId } = useParams<{ personPseudoId: string }>();
    const { data: apiPerson } = useGetPerson(personPseudoId);
    const vilkårsgrunnlag = getRequiredVilkårsgrunnlag(person, periode.vilkarsgrunnlagId);
    const opptjeningsvurderingId = vilkårsgrunnlag.opptjeningsvurderingId;

    if (!apiPerson) {
        return null;
    }

    return (
        <InngangsvilkårWithContent
            erSelvstendigNæring={isSelvstendigNaering(inntektsforhold)}
            vurdering={periode.utbetaling.vurdering}
            periodeFom={periode.fom}
            vilkårsgrunnlag={vilkårsgrunnlag}
            fødselsdato={apiPerson.fødselsdato}
            opptjening={
                nyOpptjeningVisning ? (
                    <Opptjening
                        personPseudoId={personPseudoId}
                        opptjeningsvurderingId={opptjeningsvurderingId}
                        readOnly={readOnly}
                    />
                ) : null
            }
        />
    );
};

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
