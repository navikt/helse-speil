import { MånedsbeløpInput } from './MånedsbeløpInput';
import classNames from 'classnames';
import dayjs from 'dayjs';
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useRecoilState } from 'recoil';

import { Alert, BodyShort, Button, ErrorSummary, Loader } from '@navikt/ds-react';

import { Bold } from '@components/Bold';
import { Endringstrekant } from '@components/Endringstrekant';
import { ErrorMessage } from '@components/ErrorMessage';
import { Flex } from '@components/Flex';
import { OverstyringTimeoutModal } from '@components/OverstyringTimeoutModal';
import { Inntektskilde, OmregnetArsinntekt } from '@io/graphql';
import type { OverstyrtInntektOgRefusjonDTO, Refusjonsopplysning } from '@io/http';
import {
    useLokaleRefusjonsopplysninger,
    useLokaltMånedsbeløp,
    usePeriodForSkjæringstidspunktForArbeidsgiver,
} from '@state/arbeidsgiver';
import { inntektOgRefusjonState, useOverstyrtInntektMetadata, usePostOverstyrtInntekt } from '@state/overstyring';
import { ISO_DATOFORMAT } from '@utils/date';
import { somPenger, toKronerOgØre } from '@utils/locale';
import { isBeregnetPeriode, isGhostPeriode } from '@utils/typeguards';

import { SlettLokaleOverstyringerModal } from '../../varsler/KalkulerEndringerVarsel';
import { BegrunnelseForOverstyring } from '../overstyring.types';
import { Begrunnelser } from './Begrunnelser';
import { ForklaringTextarea } from './ForklaringTextarea';
import { Refusjon } from './Refusjon';

import styles from './EditableInntekt.module.css';

interface EditableInntektProps {
    omregnetÅrsinntekt: OmregnetArsinntekt;
    begrunnelser: BegrunnelseForOverstyring[];
    organisasjonsnummer: string;
    skjæringstidspunkt: DateString;
    close: () => void;
    onEndre: (erEndret: boolean) => void;
}

export const EditableInntekt = ({
    omregnetÅrsinntekt,
    begrunnelser,
    organisasjonsnummer,
    skjæringstidspunkt,
    close,
    onEndre,
}: EditableInntektProps) => {
    const form = useForm({ shouldFocusError: false, mode: 'onBlur' });
    const feiloppsummeringRef = useRef<HTMLDivElement>(null);
    const metadata = useOverstyrtInntektMetadata(skjæringstidspunkt, organisasjonsnummer);
    const period = usePeriodForSkjæringstidspunktForArbeidsgiver(skjæringstidspunkt, organisasjonsnummer);
    const [harIkkeSkjemaEndringer, setHarIkkeSkjemaEndringer] = useState(false);
    const [showSlettLokaleOverstyringerModal, setShowSlettLokaleOverstyringerModal] = useState(false);
    const [lokaleInntektoverstyringer, _] = useRecoilState(inntektOgRefusjonState);
    const lokaleRefusjonsopplysninger = useLokaleRefusjonsopplysninger(organisasjonsnummer, skjæringstidspunkt);
    const lokaltMånedsbeløp = useLokaltMånedsbeløp(organisasjonsnummer, skjæringstidspunkt);

    const cancelEditing = () => {
        onEndre(false);
        close();
    };

    const { isLoading, error, postOverstyring, timedOut, setTimedOut } = usePostOverstyrtInntekt(
        cancelEditing,
        showSlettLokaleOverstyringerModal,
        setShowSlettLokaleOverstyringerModal
    );

    const harFeil = !form.formState.isValid && form.formState.isSubmitted;
    const values = form.getValues();

    // console.log(values, form.formState.errors);

    const månedsbeløp = Number.parseFloat(values.manedsbelop);
    const harEndringer = !isNaN(månedsbeløp) && månedsbeløp !== omregnetÅrsinntekt.manedsbelop;

    useEffect(() => {
        if (lokaltMånedsbeløp !== omregnetÅrsinntekt.manedsbelop) {
            onEndre(true);
        }
    }, [omregnetÅrsinntekt]);

    useEffect(() => {
        if (!isNaN(values.manedsbelop)) {
            onEndre(Number.parseFloat(values.manedsbelop) !== omregnetÅrsinntekt.manedsbelop);
        }
    }, [values, omregnetÅrsinntekt]);

    useEffect(() => {
        harFeil && feiloppsummeringRef.current?.focus();
    }, [harFeil]);

    const confirmChanges = () => {
        const { begrunnelseId, forklaring, manedsbelop, refusjonsopplysninger } = form.getValues();
        const begrunnelse = begrunnelser.find((begrunnelse) => begrunnelse.id === begrunnelseId)!!;

        const overstyrtInntektOgRefusjon: OverstyrtInntektOgRefusjonDTO = {
            fødselsnummer: metadata.fødselsnummer,
            aktørId: metadata.aktørId,
            skjæringstidspunkt: metadata.skjæringstidspunkt,
            arbeidsgivere: [
                {
                    organisasjonsnummer: metadata.organisasjonsnummer,
                    begrunnelse: begrunnelse.forklaring,
                    forklaring: forklaring,
                    månedligInntekt: isNaN(manedsbelop)
                        ? omregnetÅrsinntekt.manedsbelop
                        : Number.parseFloat(manedsbelop),
                    fraMånedligInntekt: omregnetÅrsinntekt.manedsbelop,
                    refusjonsopplysninger: refusjonsopplysninger ?? [],
                    fraRefusjonsopplysninger: metadata.fraRefusjonsopplysninger,
                    ...(begrunnelse.subsumsjon?.paragraf && {
                        subsumsjon: {
                            paragraf: begrunnelse.subsumsjon.paragraf,
                            ledd: begrunnelse.subsumsjon?.ledd,
                            bokstav: begrunnelse.subsumsjon?.bokstav,
                        },
                    }),
                },
            ],
        };
        postOverstyring(overstyrtInntektOgRefusjon, metadata.organisasjonsnummer);
    };

    const validateRefusjon = (e: FormEvent) => {
        if (isGhostPeriode(period)) {
            form.handleSubmit(confirmChanges);
            return;
        }

        const refusjonsopplysninger =
            values?.refusjonsopplysninger &&
            [...values.refusjonsopplysninger].sort(
                (a: Refusjonsopplysning, b: Refusjonsopplysning) =>
                    new Date(b.fom).getTime() - new Date(a.fom).getTime()
            );

        if (
            (omregnetÅrsinntekt.manedsbelop === Number(values?.manedsbelop) || isNaN(values?.manedsbelop)) &&
            JSON.stringify(refusjonsopplysninger) === JSON.stringify(metadata.fraRefusjonsopplysninger)
        ) {
            e.preventDefault();
            setHarIkkeSkjemaEndringer(true);
            return;
        } else {
            setHarIkkeSkjemaEndringer(false);
        }

        form.clearErrors([
            'sisteTomErFørPeriodensTom',
            'førsteFomErEtterSkjæringstidspunkt',
            'erGapIDatoer',
            'manglerRefusjonsopplysninger',
        ]);

        const sisteTomErFørPeriodensTom: boolean =
            refusjonsopplysninger?.[0]?.tom === null
                ? false
                : dayjs(refusjonsopplysninger?.[0]?.tom, ISO_DATOFORMAT).isBefore(period?.tom) ?? true;

        const førsteFomErEtterSkjæringstidspunkt: boolean =
            dayjs(refusjonsopplysninger?.[refusjonsopplysninger.length - 1]?.fom, ISO_DATOFORMAT).isAfter(
                period?.skjaeringstidspunkt
            ) ?? true;

        const erGapIDatoer: boolean = refusjonsopplysninger?.some(
            (refusjonsopplysning: Refusjonsopplysning, index: number) => {
                const isNotLast = index < refusjonsopplysninger.length - 1;
                const currentFom = dayjs(refusjonsopplysning.fom, ISO_DATOFORMAT);
                const previousTom = dayjs(refusjonsopplysninger[index + 1]?.tom ?? '1970-01-01', ISO_DATOFORMAT);
                return isNotLast && currentFom.subtract(1, 'day').diff(previousTom) !== 0;
            }
        );

        const manglerRefusjonsopplysninger: boolean = refusjonsopplysninger.length === 0;

        sisteTomErFørPeriodensTom &&
            form.setError('sisteTomErFørPeriodensTom', {
                type: 'custom',
                message: 'Siste til og med dato kan ikke være før periodens til og med dato.',
            });

        førsteFomErEtterSkjæringstidspunkt &&
            form.setError('førsteFomErEtterSkjæringstidspunkt', {
                type: 'custom',
                message: 'Tidligste fra og med dato kan ikke være etter skjæringstidspunktet.',
            });

        erGapIDatoer &&
            form.setError('erGapIDatoer', { type: 'custom', message: 'Refusjonsdatoene må være sammenhengende.' });

        manglerRefusjonsopplysninger &&
            form.setError('manglerRefusjonsopplysninger', { type: 'custom', message: 'Mangler refusjonsopplysninger' });

        if (
            !sisteTomErFørPeriodensTom &&
            !førsteFomErEtterSkjæringstidspunkt &&
            !erGapIDatoer &&
            !manglerRefusjonsopplysninger
        ) {
            form.handleSubmit(confirmChanges);
        }
    };

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(confirmChanges)}>
                <div className={styles.EditableInntekt}>
                    <div className={styles.Grid}>
                        <BodyShort>Månedsbeløp</BodyShort>
                        <Flex gap="1rem">
                            <MånedsbeløpInput
                                initialMånedsbeløp={omregnetÅrsinntekt.manedsbelop}
                                skalDeaktiveres={omregnetÅrsinntekt.kilde === 'INFOTRYGD'}
                                lokaltMånedsbeløp={lokaltMånedsbeløp}
                            />
                            <p
                                className={classNames(
                                    styles.OpprinneligMånedsbeløp,
                                    harEndringer && styles.harEndringer
                                )}
                            >
                                {toKronerOgØre(omregnetÅrsinntekt.manedsbelop)}
                            </p>
                        </Flex>
                    </div>
                    <BodyShort className={styles.Warning}>Endringen vil gjelde fra skjæringstidspunktet</BodyShort>
                    <div
                        className={classNames(
                            styles.Grid,
                            styles.OmregnetTilÅrsinntekt,
                            harEndringer && styles.harEndringer
                        )}
                    >
                        <BodyShort>
                            {omregnetÅrsinntekt?.kilde === Inntektskilde.Infotrygd
                                ? 'Sykepengegrunnlag før 6G'
                                : 'Omregnet til årsinntekt'}
                        </BodyShort>
                        <div>
                            {harEndringer && <Endringstrekant />}
                            <Bold>{somPenger(omregnetÅrsinntekt.belop)}</Bold>
                        </div>
                    </div>
                    {isBeregnetPeriode(period) && (
                        <Refusjon
                            fraRefusjonsopplysninger={metadata.fraRefusjonsopplysninger}
                            lokaleRefusjonsopplysninger={lokaleRefusjonsopplysninger}
                        ></Refusjon>
                    )}
                    <Begrunnelser begrunnelser={begrunnelser} />
                    <ForklaringTextarea />
                    {/* TODO: Fiks opp typing, fjern any */}
                    {!form.formState.isValid &&
                        form.formState.isSubmitted &&
                        Object.entries(form.formState.errors).length > 0 && (
                            <div className={styles.Feiloppsummering}>
                                <ErrorSummary ref={feiloppsummeringRef} heading="Skjemaet inneholder følgende feil:">
                                    {Object.entries(form.formState.errors)
                                        .filter(([_, error]) => error !== undefined)
                                        .map(([id, error]) => {
                                            if (id !== 'refusjonsopplysninger') {
                                                return (
                                                    <ErrorSummary.Item key={id}>
                                                        {error.message as string}
                                                    </ErrorSummary.Item>
                                                );
                                            } else {
                                                return (Object.entries(error) as any[])
                                                    ?.filter(
                                                        ([_, refusjonserror]) =>
                                                            refusjonserror !== undefined &&
                                                            (typeof refusjonserror?.fom === 'object' ||
                                                                typeof refusjonserror?.tom === 'object' ||
                                                                typeof refusjonserror?.beløp === 'object')
                                                    )
                                                    ?.map(([_, refusjonserror]) => {
                                                        return Object.entries(refusjonserror)?.map(
                                                            ([id, refusjonstypeerror]: [string, any], index) => {
                                                                if (refusjonstypeerror?.message) {
                                                                    return (
                                                                        <ErrorSummary.Item key={`${id}${index}`}>
                                                                            {refusjonstypeerror.message}
                                                                        </ErrorSummary.Item>
                                                                    );
                                                                } else return undefined;
                                                            }
                                                        );
                                                    });
                                            }
                                        })}
                                </ErrorSummary>
                            </div>
                        )}
                    {harIkkeSkjemaEndringer && (
                        <Alert variant="warning" className={styles.WarningIngenSkjemaEndringer}>
                            Du har ikke endret månedsinntekt eller refusjonsopplysninger
                        </Alert>
                    )}
                    <span className={styles.Buttons}>
                        <Button
                            className={styles.Button}
                            disabled={isLoading}
                            variant="secondary"
                            onClick={validateRefusjon}
                        >
                            Lagre
                            {isLoading && <Loader size="xsmall" />}
                        </Button>
                        <Button className={styles.Button} variant="tertiary" onClick={cancelEditing}>
                            Avbryt
                        </Button>
                    </span>
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                    {timedOut && <OverstyringTimeoutModal onRequestClose={() => setTimedOut(false)} />}
                    {showSlettLokaleOverstyringerModal && (
                        <SlettLokaleOverstyringerModal
                            onApprove={form.handleSubmit(confirmChanges)}
                            onClose={() => setShowSlettLokaleOverstyringerModal(false)}
                            heading="Er du sikker på at du vil fortsette?"
                            tekst={
                                <div>
                                    <BodyShort>
                                        Ved å trykke ja lagrer du disse nye endringene for skjæringstidspunkt:{' '}
                                        <span className={styles.Skjæringstidspunkt}>{skjæringstidspunkt}</span>,
                                    </BodyShort>
                                    <BodyShort>
                                        og vil dermed overskrive lokale overstyringer lagret på skjæringstidspunkt:{' '}
                                        <span className={styles.Skjæringstidspunkt}>
                                            {lokaleInntektoverstyringer.skjæringstidspunkt ?? ''}
                                        </span>
                                    </BodyShort>
                                </div>
                            }
                        />
                    )}
                </div>
            </form>
        </FormProvider>
    );
};
