import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { UseFormReturn, useForm, useWatch } from 'react-hook-form';

import { TilkommenInntektSchema, lagTilkommenInntektSchema } from '@/form-schemas';
import { useOrganisasjonQuery } from '@external/sparkel-aareg/useOrganisasjonQuery';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePostTilkomneInntekter } from '@io/rest/generated/tilkomne-inntekter/tilkomne-inntekter';
import {
    beregnInntektPerDag,
    erGyldigFomForSykefraværstilfelle,
    erGyldigTomForSykefraværstilfelle,
    tilPerioderPerOrganisasjonsnummer,
    utledSykefraværstilfelleperioder,
} from '@saksbilde/tilkommenInntekt/tilkommenInntektUtils';
import { useSistValgtePeriode } from '@state/periode';
import { useFetchPersonQuery } from '@state/person';
import { useNavigerTilTilkommenInntekt } from '@state/routing';
import { tilTilkomneInntekterMedOrganisasjonsnummer, useHentTilkommenInntektQuery } from '@state/tilkommenInntekt';
import { useTilkommenInntektFormDraft } from '@state/tilkommenInntektSkjema';
import { erIPeriode, norskDatoTilIsoDato } from '@utils/date';
import { toKronerOgØre } from '@utils/locale';
import { isNumber } from '@utils/typeguards';

export interface LeggTilTilkommenInntektSkjemaState {
    person: NonNullable<ReturnType<typeof useFetchPersonQuery>['data']>['person'];
    aktivPeriode: ReturnType<typeof useSistValgtePeriode>;
    sykefraværstilfelleperioder: ReturnType<typeof utledSykefraværstilfelleperioder>;
    erGyldigFom: (fom: string) => boolean;
    erGyldigTom: (tom: string) => boolean;
    gyldigPeriode: { fom: string; tom: string } | undefined;
    inntektPerDag: number | undefined;
    isSubmitting: boolean;
    submitError: string | undefined;
    periodebeløpVisningsverdi: string;
    setPeriodebeløpVisningsverdi: (verdi: string) => void;
    handleSubmit: (values: TilkommenInntektSchema) => Promise<void>;
    onCancel: () => void;
    setDraft: ReturnType<typeof useTilkommenInntektFormDraft>['setDraft'];
    form: UseFormReturn<TilkommenInntektSchema>;
}

export const useLeggTilTilkommenInntektSkjema = (): LeggTilTilkommenInntektSkjemaState | null => {
    const { data: personData } = useFetchPersonQuery();
    const person = personData?.person ?? null;
    const aktivPeriode = useSistValgtePeriode(person);
    const navigerTilTilkommenInntekt = useNavigerTilTilkommenInntekt();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | undefined>(undefined);
    const router = useRouter();
    const { personPseudoId } = useParams<{ personPseudoId: string }>();

    const draftKey = `ny-${personPseudoId}`;
    const { draft, setDraft, clearDraft } = useTilkommenInntektFormDraft(draftKey);

    const { data: tilkommenInntektData, refetch } = useHentTilkommenInntektQuery(personPseudoId);
    const andreTilkomneInntekter =
        tilkommenInntektData !== undefined
            ? tilTilkomneInntekterMedOrganisasjonsnummer(tilkommenInntektData)
            : undefined;

    const { mutateAsync: leggTilTilkommenInntekt } = usePostTilkomneInntekter();

    const sykefraværstilfelleperioder = useMemo(
        () => (person ? utledSykefraværstilfelleperioder(person) : []),
        [person],
    );
    const eksisterendePerioder = andreTilkomneInntekter
        ? tilPerioderPerOrganisasjonsnummer(andreTilkomneInntekter)
        : new Map();

    const form = useForm({
        resolver: zodResolver(
            lagTilkommenInntektSchema(sykefraværstilfelleperioder, eksisterendePerioder, () => organisasjonEksisterer),
        ),
        reValidateMode: 'onBlur',
        defaultValues: {
            organisasjonsnummer: draft?.organisasjonsnummer ?? '',
            fom: draft?.fom ?? '',
            tom: draft?.tom ?? '',
            periodebeløp: draft?.periodebeløp ?? 0,
            notat: draft?.notat ?? '',
            ekskluderteUkedager: draft?.ekskluderteUkedager ?? [],
        },
    });

    const organisasjonsnummer = useWatch({ name: 'organisasjonsnummer', control: form.control });
    const { data: organisasjonData } = useOrganisasjonQuery(organisasjonsnummer);
    const organisasjonEksisterer = organisasjonData?.navn != undefined;

    const fom = useWatch({ name: 'fom', control: form.control });
    const tom = useWatch({ name: 'tom', control: form.control });

    const erGyldigFom = useCallback(
        (fom: string) => erGyldigFomForSykefraværstilfelle(fom, tom, sykefraværstilfelleperioder),
        [tom, sykefraværstilfelleperioder],
    );

    const erGyldigTom = useCallback(
        (tom: string) => erGyldigTomForSykefraværstilfelle(tom, fom, sykefraværstilfelleperioder),
        [fom, sykefraværstilfelleperioder],
    );

    const [periodebeløpVisningsverdi, setPeriodebeløpVisningsverdi] = useState(toKronerOgØre(draft?.periodebeløp ?? 0));
    const periodebeløp = useWatch({ name: 'periodebeløp', control: form.control });
    const ekskluderteUkedager = useWatch({ name: 'ekskluderteUkedager', control: form.control });

    const gyldigPeriode = useMemo(
        () =>
            erGyldigFom(fom) && erGyldigTom(tom)
                ? { fom: norskDatoTilIsoDato(fom), tom: norskDatoTilIsoDato(tom) }
                : undefined,

        [erGyldigFom, erGyldigTom, fom, tom],
    );

    const inntektPerDag =
        gyldigPeriode !== undefined
            ? beregnInntektPerDag(isNumber(periodebeløp) ? periodebeløp : 0, gyldigPeriode, ekskluderteUkedager)
            : undefined;

    const { setValue } = form;
    useEffect(() => {
        if (gyldigPeriode !== undefined) {
            if (ekskluderteUkedager.some((dag) => !erIPeriode(dag, gyldigPeriode))) {
                setValue(
                    'ekskluderteUkedager',
                    ekskluderteUkedager.filter((dag) => erIPeriode(dag, gyldigPeriode)),
                );
            }
        }
    }, [gyldigPeriode, ekskluderteUkedager, setValue]);

    if (!person || andreTilkomneInntekter === undefined) return null;

    const handleSubmit = async (values: TilkommenInntektSchema) => {
        setIsSubmitting(true);
        setSubmitError(undefined);
        try {
            const data = await leggTilTilkommenInntekt({
                data: {
                    fodselsnummer: person.fodselsnummer,
                    notatTilBeslutter: values.notat,
                    verdier: {
                        periode: { fom: norskDatoTilIsoDato(values.fom), tom: norskDatoTilIsoDato(values.tom) },
                        organisasjonsnummer: values.organisasjonsnummer,
                        periodebelop: values.periodebeløp.toString(),
                        ekskluderteUkedager: values.ekskluderteUkedager,
                    },
                },
            });
            clearDraft();
            setIsSubmitting(false);
            try {
                await refetch();
            } catch {
                // Naviger likevel om refetch feiler; detaljsiden henter data på nytt.
            }
            navigerTilTilkommenInntekt(data.tilkommenInntektId);
        } catch {
            setSubmitError('Klarte ikke lagre ny tilkommen inntekt. Prøv igjen senere, eller kontakt en coach.');
            setIsSubmitting(false);
        }
    };

    const onCancel = () => {
        clearDraft();
        router.back();
    };

    return {
        person,
        aktivPeriode,
        sykefraværstilfelleperioder,
        erGyldigFom,
        erGyldigTom,
        gyldigPeriode,
        inntektPerDag,
        isSubmitting,
        submitError,
        periodebeløpVisningsverdi,
        setPeriodebeløpVisningsverdi,
        handleSubmit,
        onCancel,
        setDraft,
        form,
    };
};
