import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React, { Dispatch, SetStateAction, useState } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { EditButton } from '@components/EditButton';
import { Flex, FlexColumn } from '@components/Flex';
import { Kilde } from '@components/Kilde';
import { PopoverHjelpetekst } from '@components/PopoverHjelpetekst';
import { SortInfoikon } from '@components/ikoner/SortInfoikon';
import {
    useActivePeriodHasLatestSkjæringstidspunkt,
    useActiveGenerationIsLast,
    useHarKunEnFagsystemIdPåArbeidsgiverIAktivPeriode,
} from '@hooks/revurdering';
import { useEndringerForPeriode, useUtbetalingForSkjæringstidspunkt, useVilkårsgrunnlaghistorikk } from '@state/person';
import { useAktivPeriode } from '@state/tidslinje';
import { getKildeType, kilde } from '@utils/inntektskilde';

import { EndringsloggInntektEllerArbeidsforholdButton } from '../../utbetaling/utbetalingstabell/EndringsloggInntektEllerArbeidsforholdButton';
import { EditableInntekt } from './EditableInntekt';
import { ReadOnlyInntekt } from './ReadOnlyInntekt';
import { OverstyrArbeidsforholdUtenSykdom } from '../OverstyrArbeidsforholdUtenSykdom';

import { overstyrInntektEnabled } from '@utils/featureToggles';
import { Bold } from '@components/Bold';

const Container = styled(FlexColumn)<{ editing: boolean; inntektDeaktivert: boolean }>`
    box-sizing: border-box;
    margin-bottom: 24px;

    ${(props) =>
        props.editing &&
        css`
            background-color: var(--speil-background-secondary);
            border-left: 4px solid var(--navds-color-action-default);
            padding: 0.5rem 1rem;
        `};

    ${(props) =>
        props.inntektDeaktivert &&
        css`
            background-color: var(--nav-ghost-deaktivert-bakgrunn);
            border: 1px solid var(--nav-ghost-deaktivert-border);
            padding: 30px;
            margin: 0 -31px;
            position: relative;
        `}
`;

const Header = styled.div<{ isEditing: boolean }>`
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
    justify-content: space-between;
    width: 100%;

    > div > * {
        margin-right: 0.5rem;
    }

    ${(props) =>
        props.isEditing &&
        css`
            justify-content: space-between;
        `}
`;

const DeaktivertPille = styled.div`
    position: absolute;
    top: -14px;
    left: 15px;
    background-color: var(--nav-ghost-deaktivert-pille-bakgrunn);
    border: 1px solid var(--nav-ghost-deaktivert-pille-border);
    padding: 5px 10px;
    border-radius: 4px;
`;

const InntektContainer = styled.div`
    margin-bottom: 1.5rem;
`;
export const useIkkeUtbetaltVedSkjæringstidspunkt = (): boolean | undefined => {
    const periode = useAktivPeriode();
    const unique =
        periode.tilstand === 'utenSykefravær' ? undefined : (periode as TidslinjeperiodeMedSykefravær).unique;

    const utbetaling = useUtbetalingForSkjæringstidspunkt(unique, periode.skjæringstidspunkt!);
    return utbetaling?.status === 'IKKE_UTBETALT' && utbetaling?.type === 'UTBETALING';
};

const useInntektskilde = (): Inntektskilde => useAktivPeriode().inntektskilde;

interface InntektProps {
    omregnetÅrsinntekt: ExternalOmregnetÅrsinntekt | null;
    organisasjonsnummer: string;
    organisasjonsnummerPeriodeTilGodkjenning: string | undefined;
    skjæringstidspunkt: string;
    arbeidsforholdKanOverstyres: boolean;
    arbeidsforholdErDeaktivert: boolean;
}

interface RedigerInntektProps {
    setEditing: Dispatch<SetStateAction<boolean>>;
    editing: boolean;
}

const RedigerInntekt = ({ setEditing, editing }: RedigerInntektProps) => {
    const ikkeUtbetaltVedSkjæringstidspunkt = useIkkeUtbetaltVedSkjæringstidspunkt();
    const harKunEnArbeidsgiver = useInntektskilde() === 'EN_ARBEIDSGIVER';
    const erAktivPeriodeISisteSkjæringstidspunkt = useActivePeriodHasLatestSkjæringstidspunkt();
    const erTidslinjeperiodeISisteGenerasjon = useActiveGenerationIsLast();
    const aktivPeriode = useAktivPeriode();
    const erSpleisVilkårsgrunnlagtype =
        useVilkårsgrunnlaghistorikk(
            (aktivPeriode as TidslinjeperiodeMedSykefravær)?.skjæringstidspunkt,
            (aktivPeriode as TidslinjeperiodeMedSykefravær)?.vilkårsgrunnlaghistorikkId
        )?.vilkårsgrunnlagtype === 'SPLEIS';
    const erIkkePingPong = useHarKunEnFagsystemIdPåArbeidsgiverIAktivPeriode();

    if (aktivPeriode.tilstand === 'utenSykefravær') {
        return <></>;
    }

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

export const Inntekt = ({
    omregnetÅrsinntekt,
    organisasjonsnummer,
    organisasjonsnummerPeriodeTilGodkjenning,
    skjæringstidspunkt,
    arbeidsforholdErDeaktivert,
    arbeidsforholdKanOverstyres,
}: InntektProps) => {
    const [editing, setEditing] = useState(false);
    const [endret, setEndret] = useState(false);

    const { inntektsendringer, arbeidsforholdendringer } = useEndringerForPeriode(organisasjonsnummer);
    return (
        <Container editing={editing} inntektDeaktivert={arbeidsforholdErDeaktivert}>
            {arbeidsforholdErDeaktivert && <DeaktivertPille>Brukes ikke i beregningen</DeaktivertPille>}
            <Header isEditing={editing}>
                <Flex alignItems="center">
                    <Bold>Beregnet månedsinntekt</Bold>
                    {endret || omregnetÅrsinntekt?.kilde === 'Saksbehandler' ? (
                        <EndringsloggInntektEllerArbeidsforholdButton
                            inntektsendringer={inntektsendringer}
                            arbeidsforholdendringer={arbeidsforholdendringer}
                        />
                    ) : (
                        <Kilde type={getKildeType(omregnetÅrsinntekt?.kilde)}>{kilde(omregnetÅrsinntekt?.kilde)}</Kilde>
                    )}
                </Flex>
                {overstyrInntektEnabled && <RedigerInntekt setEditing={setEditing} editing={editing} />}
            </Header>
            <InntektContainer>
                {editing ? (
                    <EditableInntekt
                        omregnetÅrsinntekt={omregnetÅrsinntekt!}
                        close={() => setEditing(false)}
                        onEndre={setEndret}
                    />
                ) : (
                    <ReadOnlyInntekt omregnetÅrsinntekt={omregnetÅrsinntekt} />
                )}
            </InntektContainer>
            {arbeidsforholdKanOverstyres && (
                <OverstyrArbeidsforholdUtenSykdom
                    organisasjonsnummerAktivPeriode={organisasjonsnummer}
                    organisasjonsnummerPeriodeTilGodkjenning={organisasjonsnummerPeriodeTilGodkjenning!}
                    skjæringstidspunkt={skjæringstidspunkt}
                    arbeidsforholdErDeaktivert={arbeidsforholdErDeaktivert}
                />
            )}
        </Container>
    );
};
