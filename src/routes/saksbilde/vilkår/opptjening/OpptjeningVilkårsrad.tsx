import React, { ReactElement, ReactNode, useState } from 'react';

import { BodyShort, Box, Button, HStack, Spacer, Tag, VStack } from '@navikt/ds-react';

import { ManueltVurderbarVilkårskode, vilkårskodeLabels } from '@/form-schemas/overstyrVilkårsvurderingSkjema';
import { Kryssikon } from '@components/ikoner/Kryssikon';
import { Sjekkikon } from '@components/ikoner/Sjekkikon';
import { Utropstegnikon } from '@components/ikoner/Utropstegnikon';
import {
    ApiUtfall,
    ApiVilkårsvurdering,
    ApiVurderingsgrunnlag,
    ApiVurderingsgrunnlagArbeidsforhold,
    ApiVurderingskilde,
    ApiVurderingskildeSaksbehandler,
} from '@io/rest/generated/vilkarsproving.schemas';
import { getFormattedDatetimeString, somNorskDato } from '@utils/date';

import { VurderOpptjeningsvilkårSkjema } from './VurderOpptjeningsvilkårSkjema';

const erSaksbehandlerkilde = (kilde: ApiVurderingskilde): kilde is ApiVurderingskildeSaksbehandler => 'ident' in kilde;

const grunnlagFraKilde = (kilde: ApiVurderingskilde): ApiVurderingsgrunnlag | undefined =>
    'grunnlag' in kilde ? kilde.grunnlag : undefined;

const erArbeidsforholdgrunnlag = (grunnlag: ApiVurderingsgrunnlag): grunnlag is ApiVurderingsgrunnlagArbeidsforhold =>
    'arbeidsforhold' in grunnlag;

const utfallstekst = (utfall?: ApiUtfall): string => {
    switch (utfall) {
        case ApiUtfall.OPPFYLT:
            return 'Oppfylt';
        case ApiUtfall.IKKE_OPPFYLT:
            return 'Ikke oppfylt';
        default:
            return 'Ikke vurdert';
    }
};

interface UtfallsikonProps {
    utfall?: ApiUtfall;
}

export const Utfallsikon = ({ utfall }: UtfallsikonProps): ReactElement => {
    switch (utfall) {
        case ApiUtfall.OPPFYLT:
            return <Sjekkikon alt="Oppfylt" />;
        case ApiUtfall.IKKE_OPPFYLT:
            return <Kryssikon alt="Ikke oppfylt" />;
        default:
            return <Utropstegnikon alt="Ikke vurdert" />;
    }
};

interface DetaljradProps {
    label: string;
    children: ReactNode;
}

const Detaljrad = ({ label, children }: DetaljradProps): ReactElement => (
    <>
        <BodyShort as="dt" size="small" textColor="subtle">
            {label}
        </BodyShort>
        <BodyShort as="dd" size="small">
            {children}
        </BodyShort>
    </>
);

interface VurderingsdetaljerProps {
    vurdering: ApiVilkårsvurdering;
}

const Vurderingsdetaljer = ({ vurdering }: VurderingsdetaljerProps): ReactElement => {
    const grunnlag = grunnlagFraKilde(vurdering.kilde);
    const arbeidsforholdgrunnlag = grunnlag && erArbeidsforholdgrunnlag(grunnlag) ? grunnlag : undefined;

    return (
        <dl className="m-0 grid w-fit grid-cols-[auto_auto] gap-x-6 gap-y-1">
            {arbeidsforholdgrunnlag?.opptjeningsperiode && (
                <Detaljrad label="Opptjening fra">
                    {somNorskDato(arbeidsforholdgrunnlag.opptjeningsperiode.fom) ?? 'ukjent'}
                </Detaljrad>
            )}
            {arbeidsforholdgrunnlag && (
                <Detaljrad label="Antall dager (>28)">{`${arbeidsforholdgrunnlag.opptjeningsdager}`}</Detaljrad>
            )}
            {erSaksbehandlerkilde(vurdering.kilde) ? (
                <>
                    <Detaljrad label="Vurdert av">{vurdering.kilde.ident}</Detaljrad>
                    <Detaljrad label="Begrunnelse">{vurdering.kilde.fritekstbegrunnelse}</Detaljrad>
                </>
            ) : (
                <Detaljrad label="Vurdert">Automatisk</Detaljrad>
            )}
            {vurdering.vurdertTidspunkt && (
                <Detaljrad label="Vurdert tidspunkt">
                    {getFormattedDatetimeString(vurdering.vurdertTidspunkt)}
                </Detaljrad>
            )}
        </dl>
    );
};

interface OpptjeningVilkårsradProps {
    personPseudoId: string;
    skjæringstidspunkt: string;
    vilkårskode: ManueltVurderbarVilkårskode;
    vurdering?: ApiVilkårsvurdering;
    erAvgjørende: boolean;
    readOnly: boolean;
    onOverstyrt: (opptjeningsvurderingId: string) => void;
}

export const OpptjeningVilkårsrad = ({
    personPseudoId,
    skjæringstidspunkt,
    vilkårskode,
    vurdering,
    erAvgjørende,
    readOnly,
    onOverstyrt,
}: OpptjeningVilkårsradProps): ReactElement => {
    const [viserSkjema, setViserSkjema] = useState(false);
    const vilkårsnavn = vilkårskodeLabels[vilkårskode];

    return (
        <Box as="li" borderWidth="1" borderColor="neutral-subtle" borderRadius="8" padding="space-16">
            <VStack gap="space-12" data-testid={`opptjeningsvilkår-${vilkårskode}`}>
                <HStack gap="space-8" align="center">
                    <span className="flex w-6 items-center justify-center">
                        <Utfallsikon utfall={vurdering?.utfall} />
                    </span>
                    <BodyShort weight="semibold">{vilkårsnavn}</BodyShort>
                    <BodyShort textColor="subtle">{utfallstekst(vurdering?.utfall)}</BodyShort>
                    {erAvgjørende && (
                        <Tag size="xsmall" variant="info">
                            Avgjørende
                        </Tag>
                    )}
                    <Spacer />
                    {!readOnly && !viserSkjema && (
                        <Button size="small" variant="secondary" onClick={() => setViserSkjema(true)}>
                            {vurdering ? `Endre vurdering av ${vilkårsnavn}` : `Vurder ${vilkårsnavn}`}
                        </Button>
                    )}
                </HStack>
                {vurdering && <Vurderingsdetaljer vurdering={vurdering} />}
                {viserSkjema && (
                    <VurderOpptjeningsvilkårSkjema
                        personPseudoId={personPseudoId}
                        skjæringstidspunkt={skjæringstidspunkt}
                        vilkårskode={vilkårskode}
                        vilkårsnavn={vilkårsnavn}
                        onOverstyrt={(opptjeningsvurderingId) => {
                            setViserSkjema(false);
                            onOverstyrt(opptjeningsvurderingId);
                        }}
                        onAvbryt={() => setViserSkjema(false)}
                    />
                )}
            </VStack>
        </Box>
    );
};
