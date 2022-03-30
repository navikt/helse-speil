import React, { Dispatch, SetStateAction, useState } from 'react';

import { EditButton } from '@components/EditButton';
import { Flex } from '@components/Flex';
import { Kilde } from '@components/Kilde';
import { PopoverHjelpetekst } from '@components/PopoverHjelpetekst';
import { SortInfoikon } from '@components/ikoner/SortInfoikon';
import {
    useActivePeriodHasLatestSkjæringstidspunkt,
    useActiveGenerationIsLast,
    useHarKunEnFagsystemIdPåArbeidsgiverIAktivPeriode,
} from '@hooks/revurdering';
import { useVilkårsgrunnlaghistorikk } from '@state/person';
import { useAktivPeriode } from '@state/tidslinje';
import { kildeForkortelse } from '@utils/inntektskilde';

import { EndringsloggInntektEllerArbeidsforholdButton } from '../../utbetaling/utbetalingstabell/EndringsloggInntektEllerArbeidsforholdButton';
import { EditableInntekt } from './EditableInntekt';
import { ReadOnlyInntekt } from './ReadOnlyInntekt';
import { OverstyrArbeidsforholdUtenSykdom } from '../OverstyrArbeidsforholdUtenSykdom';

import { overstyrInntektEnabled } from '@utils/featureToggles';
import { Bold } from '@components/Bold';
import { Inntektskilde as GraphQLInntektskilde, OmregnetArsinntekt } from '@io/graphql';
import { useEndringerForPeriode, useUtbetalingForSkjæringstidspunkt } from '@state/arbeidsgiverState';
import { ErrorBoundary } from '@components/ErrorBoundary';

import styles from './Inntekt.module.css';
import classNames from 'classnames';

const useInntektskilde = (): Inntektskilde => useAktivPeriode().inntektskilde;

interface RedigerInntektProps {
    setEditing: Dispatch<SetStateAction<boolean>>;
    editing: boolean;
    erRevurdering: boolean;
}

const RedigerInntekt = ({ setEditing, editing, erRevurdering }: RedigerInntektProps) => {
    const harKunEnArbeidsgiver = useInntektskilde() === 'EN_ARBEIDSGIVER';
    const erAktivPeriodeISisteSkjæringstidspunkt = useActivePeriodHasLatestSkjæringstidspunkt();
    const erTidslinjeperiodeISisteGenerasjon = useActiveGenerationIsLast();
    const aktivPeriode = useAktivPeriode();
    const erSpleisVilkårsgrunnlagtype =
        useVilkårsgrunnlaghistorikk(
            (aktivPeriode as TidslinjeperiodeMedSykefravær)?.skjæringstidspunkt,
            (aktivPeriode as TidslinjeperiodeMedSykefravær)?.vilkårsgrunnlaghistorikkId,
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
            closedText={erRevurdering ? 'Revurder' : 'Endre'}
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

interface InntektProps {
    omregnetÅrsinntekt?: OmregnetArsinntekt | null;
    organisasjonsnummer: string;
    organisasjonsnummerPeriodeTilGodkjenning: string | undefined;
    skjæringstidspunkt: string;
    arbeidsforholdKanOverstyres: boolean;
    arbeidsforholdErDeaktivert: boolean;
}

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
    const erRevurdering = useUtbetalingForSkjæringstidspunkt(skjæringstidspunkt)?.status === 'Utbetalt';

    const { inntektsendringer, arbeidsforholdendringer } = useEndringerForPeriode(organisasjonsnummer);
    return (
        <div
            className={classNames(
                styles.Inntekt,
                editing && styles.editing,
                arbeidsforholdErDeaktivert && styles.deaktivert,
            )}
        >
            {arbeidsforholdErDeaktivert && <div className={styles.Deaktivertpille}>Brukes ikke i beregningen</div>}
            <div className={classNames(styles.Header, editing && styles.editing)}>
                <Flex alignItems="center">
                    <Bold>Beregnet månedsinntekt</Bold>
                    {endret || omregnetÅrsinntekt?.kilde === GraphQLInntektskilde.Saksbehandler ? (
                        <EndringsloggInntektEllerArbeidsforholdButton
                            inntektsendringer={inntektsendringer}
                            arbeidsforholdendringer={arbeidsforholdendringer}
                        />
                    ) : (
                        <Kilde type={omregnetÅrsinntekt?.kilde}>{kildeForkortelse(omregnetÅrsinntekt?.kilde)}</Kilde>
                    )}
                </Flex>
                {overstyrInntektEnabled && (
                    <RedigerInntekt setEditing={setEditing} editing={editing} erRevurdering={erRevurdering} />
                )}
            </div>
            <div className={styles.InntektContainer}>
                {editing ? (
                    <EditableInntekt
                        omregnetÅrsinntekt={omregnetÅrsinntekt!}
                        close={() => setEditing(false)}
                        onEndre={setEndret}
                    />
                ) : (
                    <ReadOnlyInntekt omregnetÅrsinntekt={omregnetÅrsinntekt} />
                )}
            </div>
            {arbeidsforholdKanOverstyres && (
                <OverstyrArbeidsforholdUtenSykdom
                    organisasjonsnummerAktivPeriode={organisasjonsnummer}
                    organisasjonsnummerPeriodeTilGodkjenning={organisasjonsnummerPeriodeTilGodkjenning!}
                    skjæringstidspunkt={skjæringstidspunkt}
                    arbeidsforholdErDeaktivert={arbeidsforholdErDeaktivert}
                />
            )}
        </div>
    );
};

const InntektContainer = () => {
    return null;
};

const InntektError = () => {
    return <div />;
};

export const InntektNew = () => {
    return (
        <ErrorBoundary fallback={<InntektError />}>
            <InntektContainer />
        </ErrorBoundary>
    );
};
