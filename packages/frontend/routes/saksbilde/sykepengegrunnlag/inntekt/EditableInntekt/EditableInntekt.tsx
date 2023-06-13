import { Månedsbeløp } from './Månedsbeløp';
import { OmregnetÅrsinntekt } from './OmregnetÅrsinntekt';
import dayjs from 'dayjs';
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useRecoilState } from 'recoil';

import { Alert, BodyShort, Button, Loader } from '@navikt/ds-react';

import { ErrorMessage } from '@components/ErrorMessage';
import { ForklaringTextarea } from '@components/ForklaringTextarea';
import { OverstyringTimeoutModal } from '@components/OverstyringTimeoutModal';
import { OmregnetArsinntekt } from '@io/graphql';
import type { OverstyrtInntektOgRefusjonDTO, Refusjonsopplysning } from '@io/http';
import {
    useArbeidsgiver,
    useLokaleRefusjonsopplysninger,
    useLokaltMånedsbeløp,
    usePeriodForSkjæringstidspunktForArbeidsgiver,
} from '@state/arbeidsgiver';
import { inntektOgRefusjonState, useOverstyrtInntektMetadata, usePostOverstyrtInntekt } from '@state/overstyring';
import { ISO_DATOFORMAT, NORSK_DATOFORMAT } from '@utils/date';
import { isBeregnetPeriode, isGhostPeriode } from '@utils/typeguards';

import { getFørstePeriodeForSkjæringstidspunkt } from '../../../historikk/mapping';
import { BegrunnelseForOverstyring } from '../../overstyring/overstyring.types';
import { Begrunnelser } from '../Begrunnelser';
import { Refusjon } from '../Refusjon';
import { EditableInntektSlettLokaleOverstyringerModal } from './EditableInntektSlettLokaleOverstyringerModal';
import { Feiloppsummering } from './Feiloppsummering';

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
    const arbeidsgiver = useArbeidsgiver(organisasjonsnummer);
    const period = usePeriodForSkjæringstidspunktForArbeidsgiver(skjæringstidspunkt, organisasjonsnummer);
    const [harIkkeSkjemaEndringer, setHarIkkeSkjemaEndringer] = useState(false);
    const [showSlettLokaleOverstyringerModal, setShowSlettLokaleOverstyringerModal] = useState(false);
    const [lokaleInntektoverstyringer, _] = useRecoilState(inntektOgRefusjonState);
    const lokaleRefusjonsopplysninger = useLokaleRefusjonsopplysninger(organisasjonsnummer, skjæringstidspunkt);
    const lokaltMånedsbeløp = useLokaltMånedsbeløp(organisasjonsnummer, skjæringstidspunkt);
    const førstePeriodeForSkjæringstidspunkt = getFørstePeriodeForSkjæringstidspunkt(skjæringstidspunkt, arbeidsgiver);

    const cancelEditing = () => {
        onEndre(false);
        close();
    };

    const { isLoading, error, postOverstyring, timedOut, setTimedOut } = usePostOverstyrtInntekt(
        cancelEditing,
        showSlettLokaleOverstyringerModal,
        setShowSlettLokaleOverstyringerModal,
    );

    const harFeil = !form.formState.isValid && form.formState.isSubmitted;
    const values = form.getValues();

    const månedsbeløp = Number.parseFloat(values.manedsbelop);
    const omregnetÅrsinntektMånedsbeløpRounded =
        Math.round((omregnetÅrsinntekt.manedsbelop + Number.EPSILON) * 100) / 100;
    const harEndringer = !isNaN(månedsbeløp) && månedsbeløp !== omregnetÅrsinntektMånedsbeløpRounded;

    useEffect(() => {
        if (lokaltMånedsbeløp !== omregnetÅrsinntektMånedsbeløpRounded) {
            onEndre(true);
        }
    }, [omregnetÅrsinntekt]);

    useEffect(() => {
        if (!isNaN(values.manedsbelop)) {
            onEndre(Number.parseFloat(values.manedsbelop) !== omregnetÅrsinntektMånedsbeløpRounded);
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
                    new Date(b.fom).getTime() - new Date(a.fom).getTime(),
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
            'førsteFomErEtterFørstePeriodesFom',
            'erGapIDatoer',
            'manglerRefusjonsopplysninger',
        ]);

        const sisteTomErFørPeriodensTom: boolean =
            refusjonsopplysninger?.[0]?.tom === null
                ? false
                : dayjs(refusjonsopplysninger?.[0]?.tom, ISO_DATOFORMAT).isBefore(period?.tom) ?? true;

        const førsteFomErEtterFørstePeriodesFom: boolean = dayjs(
            refusjonsopplysninger?.[refusjonsopplysninger.length - 1]?.fom,
            ISO_DATOFORMAT,
        ).isAfter(førstePeriodeForSkjæringstidspunkt?.fom);

        const erGapIDatoer: boolean = refusjonsopplysninger?.some(
            (refusjonsopplysning: Refusjonsopplysning, index: number) => {
                const isNotLast = index < refusjonsopplysninger.length - 1;
                const currentFom = dayjs(refusjonsopplysning.fom, ISO_DATOFORMAT);
                const previousTom = dayjs(refusjonsopplysninger[index + 1]?.tom ?? '1970-01-01', ISO_DATOFORMAT);
                return isNotLast && currentFom.subtract(1, 'day').diff(previousTom) !== 0;
            },
        );

        const manglerRefusjonsopplysninger: boolean = refusjonsopplysninger.length === 0;

        sisteTomErFørPeriodensTom &&
            form.setError('sisteTomErFørPeriodensTom', {
                type: 'custom',
                message: 'Siste til og med dato kan ikke være før periodens til og med dato.',
            });

        førsteFomErEtterFørstePeriodesFom &&
            form.setError('førsteFomErEtterFørstePeriodesFom', {
                type: 'custom',
                message: `Tidligste fra og med dato for refusjon må være lik eller før ${dayjs(
                    førstePeriodeForSkjæringstidspunkt?.fom,
                    ISO_DATOFORMAT,
                ).format(NORSK_DATOFORMAT)}`,
            });

        erGapIDatoer &&
            form.setError('erGapIDatoer', { type: 'custom', message: 'Refusjonsdatoene må være sammenhengende.' });

        manglerRefusjonsopplysninger &&
            form.setError('manglerRefusjonsopplysninger', { type: 'custom', message: 'Mangler refusjonsopplysninger' });

        if (
            !sisteTomErFørPeriodensTom &&
            !førsteFomErEtterFørstePeriodesFom &&
            !erGapIDatoer &&
            !manglerRefusjonsopplysninger
        ) {
            form.handleSubmit(confirmChanges);
        }
    };

    const visFeilOppsummering =
        !form.formState.isValid && form.formState.isSubmitted && Object.entries(form.formState.errors).length > 0;

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(confirmChanges)}>
                <div className={styles.EditableInntekt}>
                    <Månedsbeløp
                        månedsbeløp={omregnetÅrsinntekt.manedsbelop}
                        kilde={omregnetÅrsinntekt.kilde}
                        lokaltMånedsbeløp={lokaltMånedsbeløp}
                        harEndringer={harEndringer}
                    />
                    <BodyShort className={styles.Warning}>Endringen vil gjelde fra skjæringstidspunktet</BodyShort>
                    <OmregnetÅrsinntekt
                        beløp={omregnetÅrsinntekt.belop}
                        kilde={omregnetÅrsinntekt.kilde}
                        harEndringer={harEndringer}
                    />
                    {isBeregnetPeriode(period) && (
                        <Refusjon
                            fraRefusjonsopplysninger={metadata.fraRefusjonsopplysninger}
                            lokaleRefusjonsopplysninger={lokaleRefusjonsopplysninger}
                        />
                    )}
                    <Begrunnelser begrunnelser={begrunnelser} />
                    <ForklaringTextarea
                        description={`Begrunn hvorfor det er gjort endringer i inntekt og/eller refusjon.\nEks. «Ny inntektsmelding kommet inn 18.10.2021»\nBlir ikke forevist den sykmeldte, med mindre den sykmeldte ber om innsyn.`}
                    />
                    {visFeilOppsummering && (
                        <Feiloppsummering feiloppsummeringRef={feiloppsummeringRef} errors={form.formState.errors} />
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
                        <EditableInntektSlettLokaleOverstyringerModal
                            onApprove={form.handleSubmit(confirmChanges)}
                            onClose={() => setShowSlettLokaleOverstyringerModal(false)}
                            overstyrtSkjæringstidspunkt={lokaleInntektoverstyringer.skjæringstidspunkt}
                            skjæringstidspunkt={skjæringstidspunkt}
                        />
                    )}
                </div>
            </form>
        </FormProvider>
    );
};
