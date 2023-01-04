import { MånedsbeløpInput } from './MånedsbeløpInput';
import classNames from 'classnames';
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { BodyShort, Button, ErrorSummary, Loader } from '@navikt/ds-react';

import { Bold } from '@components/Bold';
import { Endringstrekant } from '@components/Endringstrekant';
import { ErrorMessage } from '@components/ErrorMessage';
import { Flex, FlexColumn } from '@components/Flex';
import { OverstyringTimeoutModal } from '@components/OverstyringTimeoutModal';
import { Arbeidsgiverrefusjon, Inntektskilde, OmregnetArsinntekt } from '@io/graphql';
import type { OverstyrtInntektDTO, Refusjonsopplysning } from '@io/http';
import { postAbonnerPåAktør, postOverstyrtInntekt } from '@io/http';
import { useCurrentArbeidsgiver } from '@state/arbeidsgiver';
import {
    kalkulererFerdigToastKey,
    kalkulererToast,
    kalkulererToastKey,
    kalkuleringFerdigToast,
} from '@state/kalkuleringstoasts';
import { useOpptegnelser, useSetOpptegnelserPollingRate } from '@state/opptegnelser';
import { useActivePeriod } from '@state/periode';
import { useCurrentPerson } from '@state/person';
import { useAddToast, useRemoveToast } from '@state/toasts';
import { ISO_DATOFORMAT } from '@utils/date';
import { kanOverstyreRefusjonsopplysninger } from '@utils/featureToggles';
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

const useOverstyrtInntektMetadata = (): OverstyrtInntektMetadata => {
    const person = useCurrentPerson();
    const period = useActivePeriod();
    const arbeidsgiver = useCurrentArbeidsgiver();

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
        postOverstyring: (overstyrtInntekt: OverstyrtInntektDTO) => {
            setIsLoading(true);
            postOverstyrtInntekt(overstyrtInntekt)
                .then(() => {
                    setCalculating(true);
                    addToast(kalkulererToast({}));
                    postAbonnerPåAktør(person.aktorId).then(() => setPollingRate(1000));
                })
                .catch((error) => {
                    switch (error.statusCode) {
                        default: {
                            setError('Kunne ikke overstyre inntekt. Prøv igjen senere.');
                        }
                    }
                    setIsLoading(false);
                });
        },
    };
};

interface EditableInntektProps {
    omregnetÅrsinntekt: OmregnetArsinntekt;
    begrunnelser: BegrunnelseForOverstyring[];
    close: () => void;
    onEndre: (erEndret: boolean) => void;
}

export const EditableInntekt = ({ omregnetÅrsinntekt, begrunnelser, close, onEndre }: EditableInntektProps) => {
    const form = useForm({ shouldFocusError: false, mode: 'onBlur' });
    const feiloppsummeringRef = useRef<HTMLDivElement>(null);
    const metadata = useOverstyrtInntektMetadata();
    const period = useActivePeriod();

    const cancelEditing = () => {
        onEndre(false);
        close();
    };

    const { isLoading, error, postOverstyring, timedOut, setTimedOut } = usePostOverstyrtInntekt(cancelEditing);

    const harFeil = !form.formState.isValid && form.formState.isSubmitted;
    const values = form.getValues();

    console.log(values, form.formState.errors);

    const månedsbeløp = Number.parseFloat(values.manedsbelop);
    const harEndringer = !isNaN(månedsbeløp) && månedsbeløp !== omregnetÅrsinntekt.manedsbelop;

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
        const overstyrtInntekt: OverstyrtInntektDTO = {
            ...metadata,
            begrunnelse: begrunnelse.forklaring,
            forklaring,
            månedligInntekt: Number.parseFloat(manedsbelop),
            fraMånedligInntekt: omregnetÅrsinntekt.manedsbelop,
            ...(begrunnelse.subsumsjon?.paragraf && {
                subsumsjon: {
                    paragraf: begrunnelse.subsumsjon.paragraf,
                    ledd: begrunnelse.subsumsjon.ledd,
                    bokstav: begrunnelse.subsumsjon.bokstav,
                },
            }),
            refusjonsopplysninger: refusjonsopplysninger?.reverse() ?? undefined,
        };
        postOverstyring(overstyrtInntekt);
    };

    const hasDateGapRefusjon = () => {
        if (!kanOverstyreRefusjonsopplysninger) {
            form.handleSubmit(confirmChanges);
            return;
        }

        form.clearErrors(['sisteTomErFørPeriodensTom', 'førsteFomErEtterSkjæringstidspunkt', 'erGapIDatoer']);

        const refusjonsopplysninger =
            values?.refusjonsopplysninger &&
            [...values.refusjonsopplysninger]?.sort(
                (a: Refusjonsopplysning, b: Refusjonsopplysning) =>
                    new Date(b.fom).getTime() - new Date(a.fom).getTime()
            );

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

        if (!sisteTomErFørPeriodensTom && !førsteFomErEtterSkjæringstidspunkt && !erGapIDatoer) {
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
                            <FlexColumn>
                                <MånedsbeløpInput initialMånedsbeløp={omregnetÅrsinntekt.manedsbelop} />
                            </FlexColumn>
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
                    {kanOverstyreRefusjonsopplysninger && (
                        <Refusjon fraRefusjonsopplysninger={metadata.fraRefusjonsopplysninger}></Refusjon>
                    )}
                    <Begrunnelser begrunnelser={begrunnelser} />
                    <ForklaringTextarea />
                    {/* TODO: Fiks opp typing, fjern any */}
                    {!form.formState.isValid && form.formState.isSubmitted && (
                        <div className={styles.Feiloppsummering}>
                            <ErrorSummary ref={feiloppsummeringRef} heading="Skjemaet inneholder følgende feil:">
                                {Object.entries(form.formState.errors).map(([id, error]) => {
                                    if (error === undefined) return;
                                    if (id !== 'refusjonsopplysninger') {
                                        return (
                                            <ErrorSummary.Item key={id}>{error.message as string}</ErrorSummary.Item>
                                        );
                                    } else {
                                        return (
                                            (Object.entries(error) as any[])?.map(([_, refusjonserror]) => {
                                                return refusjonserror !== undefined
                                                    ? Object.entries(refusjonserror)?.map(
                                                          ([id, refusjonstypeerror]: [string, any], index) => {
                                                              if (refusjonstypeerror?.message) {
                                                                  return (
                                                                      <ErrorSummary.Item key={`${id}${index}`}>
                                                                          {refusjonstypeerror.message}
                                                                      </ErrorSummary.Item>
                                                                  );
                                                              } else return null;
                                                          }
                                                      )
                                                    : undefined ?? undefined;
                                            }) ?? undefined
                                        );
                                    }
                                })}
                            </ErrorSummary>
                        </div>
                    )}
                    <span className={styles.Buttons}>
                        <Button
                            className={styles.Button}
                            disabled={isLoading}
                            variant="secondary"
                            onClick={hasDateGapRefusjon}
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
