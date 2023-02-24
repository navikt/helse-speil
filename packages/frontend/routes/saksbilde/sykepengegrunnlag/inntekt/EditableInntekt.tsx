import { MånedsbeløpInput } from './MånedsbeløpInput';
import classNames from 'classnames';
import dayjs from 'dayjs';
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { atom, useRecoilState } from 'recoil';

import { Alert, BodyShort, Button, ErrorSummary, Loader } from '@navikt/ds-react';

import { Bold } from '@components/Bold';
import { Endringstrekant } from '@components/Endringstrekant';
import { ErrorMessage } from '@components/ErrorMessage';
import { Flex } from '@components/Flex';
import { OverstyringTimeoutModal } from '@components/OverstyringTimeoutModal';
import { Arbeidsgiverrefusjon, Inntektskilde, OmregnetArsinntekt } from '@io/graphql';
import type {
    OverstyrtInntektOgRefusjonArbeidsgiver,
    OverstyrtInntektOgRefusjonDTO,
    Refusjonsopplysning,
} from '@io/http';
import { postAbonnerPåAktør, postOverstyrtInntektOgRefusjon } from '@io/http';
import {
    useArbeidsgiver,
    useLokaleRefusjonsopplysninger,
    useLokaltMånedsbeløp,
    usePeriodForSkjæringstidspunktForArbeidsgiver,
} from '@state/arbeidsgiver';
import {
    kalkulererFerdigToastKey,
    kalkulererToast,
    kalkulererToastKey,
    kalkuleringFerdigToast,
} from '@state/kalkuleringstoasts';
import { useOpptegnelser, useSetOpptegnelserPollingRate } from '@state/opptegnelser';
import { useCurrentPerson } from '@state/person';
import { useAddToast, useRemoveToast } from '@state/toasts';
import { ISO_DATOFORMAT } from '@utils/date';
import { inntektOgRefusjonSteg4 } from '@utils/featureToggles';
import { somPenger, toKronerOgØre } from '@utils/locale';
import { isArbeidsgiver, isBeregnetPeriode, isGhostPeriode, isPerson } from '@utils/typeguards';

import { BegrunnelseForOverstyring } from '../overstyring.types';
import { Begrunnelser } from './Begrunnelser';
import { ForklaringTextarea } from './ForklaringTextarea';
import { mapOgSorterRefusjoner } from './Inntekt';
import { Refusjon } from './Refusjon';

import styles from './EditableInntekt.module.css';

type OverstyrtInntektMetadata = {
    aktørId: string;
    fødselsnummer: string;
    organisasjonsnummer: string;
    skjæringstidspunkt: DateString;
    fraRefusjonsopplysninger: Refusjonsopplysning[];
};

const useOverstyrtInntektMetadata = (
    skjæringstidspunkt: DateString,
    organisasjonsnummer: string
): OverstyrtInntektMetadata => {
    const person = useCurrentPerson();
    const period = usePeriodForSkjæringstidspunktForArbeidsgiver(skjæringstidspunkt, organisasjonsnummer);
    const arbeidsgiver = useArbeidsgiver(organisasjonsnummer);

    if (!isPerson(person) || !isArbeidsgiver(arbeidsgiver) || !(isBeregnetPeriode(period) || isGhostPeriode(period))) {
        throw Error('Mangler data for å kunne overstyre inntekt.');
    }

    const vilkårsgrunnlagRefusjonsopplysninger: Arbeidsgiverrefusjon = person.vilkarsgrunnlag
        .filter((it) => it.id === period.vilkarsgrunnlagId)[0]
        .arbeidsgiverrefusjoner.filter(
            (arbeidsgiverrefusjon) => arbeidsgiverrefusjon.arbeidsgiver === arbeidsgiver.organisasjonsnummer
        )[0];

    const refusjonsopplysninger = mapOgSorterRefusjoner(
        period,
        vilkårsgrunnlagRefusjonsopplysninger?.refusjonsopplysninger
    );

    return {
        aktørId: person.aktorId,
        fødselsnummer: person.fodselsnummer,
        organisasjonsnummer: arbeidsgiver.organisasjonsnummer,
        skjæringstidspunkt: period.skjaeringstidspunkt,
        fraRefusjonsopplysninger: refusjonsopplysninger,
    };
};

const usePostOverstyrtInntekt = (onFerdigKalkulert: () => void) => {
    const person = useCurrentPerson();

    if (!isPerson(person)) {
        throw Error('Mangler persondata.');
    }

    const [lokaleInntektoverstyringer, setLokaleInntektoverstyringer] = useRecoilState(inntektOgRefusjonState);
    const addToast = useAddToast();
    const removeToast = useRemoveToast();
    const opptegnelser = useOpptegnelser();
    const setPollingRate = useSetOpptegnelserPollingRate();
    const [isLoading, setIsLoading] = useState(false);
    const [calculating, setCalculating] = useState(false);
    const [error, setError] = useState<string | null>();
    const [timedOut, setTimedOut] = useState(false);

    useEffect(() => {
        if (opptegnelser && calculating) {
            addToast(kalkuleringFerdigToast({ callback: () => removeToast(kalkulererFerdigToastKey) }));
            setIsLoading(false);
            setCalculating(false);
            onFerdigKalkulert();
        }
    }, [opptegnelser]);

    useEffect(() => {
        const timeout: NodeJS.Timeout | number | null = calculating
            ? setTimeout(() => {
                  setTimedOut(true);
              }, 15000)
            : null;
        return () => {
            !!timeout && clearTimeout(timeout);
        };
    }, [calculating]);

    useEffect(() => {
        return () => {
            calculating && removeToast(kalkulererToastKey);
        };
    }, [calculating]);

    return {
        isLoading,
        error,
        timedOut,
        setTimedOut,
        postOverstyring: (overstyrtInntekt: OverstyrtInntektOgRefusjonDTO, organisasjonsnummer?: string) => {
            setIsLoading(true);

            if (!inntektOgRefusjonSteg4) {
                postOverstyrtInntektOgRefusjon(overstyrtInntekt)
                    .then(() => {
                        setCalculating(true);
                        addToast(kalkulererToast({}));
                        postAbonnerPåAktør(person.aktorId).then(() => setPollingRate(1000));
                    })
                    .catch((error) => {
                        switch (error.statusCode) {
                            default: {
                                setError('Kunne ikke overstyre inntekt og/eller refusjon. Prøv igjen senere.');
                            }
                        }
                        setIsLoading(false);
                    });
            } else {
                const overstyrtArbeidsgiver = (overstyrtInntekt as OverstyrtInntektOgRefusjonDTO).arbeidsgivere[0];
                const overstyrtArbeidsgiverRetyped = {
                    ...overstyrtArbeidsgiver,
                    refusjonsopplysninger: [
                        ...overstyrtArbeidsgiver.refusjonsopplysninger.map((refusjonsopplysning) => {
                            return { ...refusjonsopplysning } as Refusjonsopplysning;
                        }),
                    ],
                    fraRefusjonsopplysninger: [
                        ...overstyrtArbeidsgiver.fraRefusjonsopplysninger.map((fraRefusjonsopplysning) => {
                            return { ...fraRefusjonsopplysning } as Refusjonsopplysning;
                        }),
                    ],
                };

                // @TODO: modalhåndtering for å være sikker på å overskrive lokale endringer på et annet skjæringstidspunkt dersom de finnes her

                const arbeidsgivereLagretPåSkjæringstidspunkt =
                    overstyrtInntekt.skjæringstidspunkt !== lokaleInntektoverstyringer.skjæringstidspunkt
                        ? []
                        : [...lokaleInntektoverstyringer.arbeidsgivere];

                setLokaleInntektoverstyringer({
                    ...overstyrtInntekt,
                    arbeidsgivere:
                        arbeidsgivereLagretPåSkjæringstidspunkt.length === 0
                            ? [overstyrtArbeidsgiverRetyped]
                            : arbeidsgivereLagretPåSkjæringstidspunkt.filter(
                                  (it) => it.organisasjonsnummer === organisasjonsnummer
                              ).length === 0
                            ? [...arbeidsgivereLagretPåSkjæringstidspunkt, overstyrtArbeidsgiverRetyped]
                            : [
                                  ...arbeidsgivereLagretPåSkjæringstidspunkt.filter(
                                      (it) => it.organisasjonsnummer !== organisasjonsnummer
                                  ),
                                  overstyrtArbeidsgiverRetyped,
                              ],
                });
                onFerdigKalkulert();
            }
        },
    };
};

interface EditableInntektProps {
    omregnetÅrsinntekt: OmregnetArsinntekt;
    begrunnelser: BegrunnelseForOverstyring[];
    organisasjonsnummer: string;
    skjæringstidspunkt: DateString;
    close: () => void;
    onEndre: (erEndret: boolean) => void;
}

export type OverstyrtInntektOgRefusjon = {
    aktørId: string | null;
    fødselsnummer: string | null;
    skjæringstidspunkt: string | null;
    arbeidsgivere: OverstyrtInntektOgRefusjonArbeidsgiver[] | [];
};

export const inntektOgRefusjonState = atom<OverstyrtInntektOgRefusjon>({
    key: 'inntektOgRefusjonState',
    default: {
        aktørId: null,
        fødselsnummer: null,
        skjæringstidspunkt: null,
        arbeidsgivere: [],
    },
});

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
    const lokaleRefusjonsopplysninger = useLokaleRefusjonsopplysninger(organisasjonsnummer, skjæringstidspunkt);
    const lokaltMånedsbeløp = useLokaltMånedsbeløp(organisasjonsnummer, skjæringstidspunkt);

    const cancelEditing = () => {
        onEndre(false);
        close();
    };

    const { isLoading, error, postOverstyring, timedOut, setTimedOut } = usePostOverstyrtInntekt(cancelEditing);

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
            [...values.refusjonsopplysninger]?.sort(
                (a: Refusjonsopplysning, b: Refusjonsopplysning) =>
                    new Date(b.fom).getTime() - new Date(a.fom).getTime()
            );

        if (
            (omregnetÅrsinntekt.manedsbelop.toString() === values?.manedsbelop || isNaN(values?.manedsbelop)) &&
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

        const erGapIDatoer: boolean =
            refusjonsopplysninger?.filter((refusjonsopplysning: Refusjonsopplysning, index: number) => {
                return (
                    index < refusjonsopplysninger.length - 1 &&
                    dayjs(refusjonsopplysning.fom, ISO_DATOFORMAT)
                        .subtract(1, 'day')
                        .diff(dayjs(refusjonsopplysninger[index + 1]?.tom ?? '1970-01-01', ISO_DATOFORMAT)) !== 0
                );
            }).length !== 0;

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
                            Ferdig
                            {isLoading && <Loader size="xsmall" />}
                        </Button>
                        <Button className={styles.Button} variant="tertiary" onClick={cancelEditing}>
                            Avbryt
                        </Button>
                    </span>
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                    {timedOut && <OverstyringTimeoutModal onRequestClose={() => setTimedOut(false)} />}
                </div>
            </form>
        </FormProvider>
    );
};
