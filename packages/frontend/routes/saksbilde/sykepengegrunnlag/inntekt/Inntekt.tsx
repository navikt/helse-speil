import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React, { Dispatch, SetStateAction, useState } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { EditButton } from '../../../../components/EditButton';
import { Flex, FlexColumn } from '../../../../components/Flex';
import { Kilde } from '../../../../components/Kilde';
import { PopoverHjelpetekst } from '../../../../components/PopoverHjelpetekst';
import { SortInfoikon } from '../../../../components/ikoner/SortInfoikon';
import {
    useErAktivPeriodeISisteSkjæringstidspunkt,
    useErTidslinjeperiodeISisteGenerasjon,
    useHarKunEnFagsystemIdPåArbeidsgiverIAktivPeriode,
} from '../../../../hooks/revurdering';
import {
    useEndringerForPeriode,
    useUtbetalingForSkjæringstidspunkt,
    useVilkårsgrunnlaghistorikk,
} from '../../../../state/person';
import { useAktivPeriode } from '../../../../state/tidslinje';
import { getKildeType, kilde } from '../../../../utils/inntektskilde';

import { overstyrInntektEnabled } from '../../../../featureToggles';
import { EndringsloggInntektButton } from '../../utbetaling/utbetalingstabell/EndringsloggInntektButton';
import { EditableInntekt } from './EditableInntekt';
import { ReadOnlyInntekt } from './ReadOnlyInntekt';

const Container = styled(FlexColumn)<{ editing: boolean }>`
    box-sizing: border-box;
    margin-bottom: 2rem;

    ${(props) =>
        props.editing &&
        css`
            background-color: var(--speil-background-secondary);
            border-left: 4px solid var(--navds-color-action-default);
            padding: 0.5rem 1rem;
        `};
`;

const Header = styled.div<{ isEditing: boolean }>`
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
    justify-content: flex-start;
    width: 100%;

    > div > * {
        margin-right: 1rem;
    }

    ${(props) =>
        props.isEditing &&
        css`
            justify-content: space-between;
        `}
`;

const Tittel = styled(BodyShort)`
    display: flex;
    align-items: center;
    font-size: 18px;
    font-weight: 600;
    color: var(--navds-color-text-primary);
`;

const useIkkeUtbetaltVedSkjæringstidspunkt = (): boolean | undefined => {
    const periode = useAktivPeriode();
    const utbetaling = useUtbetalingForSkjæringstidspunkt(periode.unique, periode.skjæringstidspunkt!);
    return utbetaling?.status === 'IKKE_UTBETALT' && utbetaling?.type === 'UTBETALING';
};

const useInntektskilde = (): Inntektskilde => useAktivPeriode().inntektskilde;

interface InntektProps {
    omregnetÅrsinntekt: ExternalOmregnetÅrsinntekt | null;
    organisasjonsnummer: string;
}

interface RedigerInntektProps {
    setEditing: Dispatch<SetStateAction<boolean>>;
    editing: boolean;
}

const RedigerInntekt = ({ setEditing, editing }: RedigerInntektProps) => {
    const ikkeUtbetaltVedSkjæringstidspunkt = useIkkeUtbetaltVedSkjæringstidspunkt();
    const harKunEnArbeidsgiver = useInntektskilde() === 'EN_ARBEIDSGIVER';
    const erAktivPeriodeISisteSkjæringstidspunkt = useErAktivPeriodeISisteSkjæringstidspunkt();
    const erTidslinjeperiodeISisteGenerasjon = useErTidslinjeperiodeISisteGenerasjon();
    const aktivPeriode = useAktivPeriode();
    const erSpleisVilkårsgrunnlagtype =
        useVilkårsgrunnlaghistorikk(aktivPeriode.skjæringstidspunkt!, aktivPeriode.vilkårsgrunnlaghistorikkId!)
            ?.vilkårsgrunnlagtype === 'SPLEIS';
    const erIkkePingPong = useHarKunEnFagsystemIdPåArbeidsgiverIAktivPeriode();

    return harKunEnArbeidsgiver &&
        erAktivPeriodeISisteSkjæringstidspunkt &&
        erSpleisVilkårsgrunnlagtype &&
        erIkkePingPong ? (
        <EditButton
            isOpen={editing}
            openText="Avbryt"
            closedText={ikkeUtbetaltVedSkjæringstidspunkt ? 'Endre' : 'Revurder'}
            onOpen={() => setEditing(true)}
            onClose={() => setEditing(false)}
            style={{ justifySelf: 'flex-end' }}
        />
    ) : erTidslinjeperiodeISisteGenerasjon ? (
        <PopoverHjelpetekst ikon={<SortInfoikon />}>
            <p>
                {!erAktivPeriodeISisteSkjæringstidspunkt
                    ? 'Kan ikke endre inntekt, det er foreløpig ikke støtte for endringer i saker i tidligere skjæringstidspunkt'
                    : !harKunEnArbeidsgiver
                    ? 'Kan ikke endre inntekt, det er foreløpig ikke støtte for saker med flere arbeidsgivere'
                    : 'Kan ikke endre inntekt, det er foreløpig ikke støtte for endringer i saker som har vært delvis behandlet i Infotrygd'}
            </p>
        </PopoverHjelpetekst>
    ) : (
        <></>
    );
};

export const Inntekt = ({ omregnetÅrsinntekt, organisasjonsnummer }: InntektProps) => {
    const [editing, setEditing] = useState(false);
    const [endret, setEndret] = useState(false);

    const endringer = useEndringerForPeriode(organisasjonsnummer);

    return (
        <Container editing={editing}>
            <Header isEditing={editing}>
                <Flex alignItems="center">
                    <Tittel as="h1">Beregnet månedsinntekt</Tittel>
                    {endret || omregnetÅrsinntekt?.kilde === 'Saksbehandler' ? (
                        <EndringsloggInntektButton
                            endringer={endringer.filter((it) => it.type === 'Inntekt') as ExternalInntektoverstyring[]}
                        />
                    ) : (
                        <Kilde type={getKildeType(omregnetÅrsinntekt?.kilde)}>{kilde(omregnetÅrsinntekt?.kilde)}</Kilde>
                    )}
                </Flex>
                {overstyrInntektEnabled && <RedigerInntekt setEditing={setEditing} editing={editing} />}
            </Header>
            {editing ? (
                <EditableInntekt
                    omregnetÅrsinntekt={omregnetÅrsinntekt!}
                    close={() => setEditing(false)}
                    onEndre={setEndret}
                />
            ) : (
                <ReadOnlyInntekt omregnetÅrsinntekt={omregnetÅrsinntekt} />
            )}
        </Container>
    );
};
