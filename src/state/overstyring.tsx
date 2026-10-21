import { useAtom, useAtomValue } from 'jotai';
import { atomWithReset, useResetAtom } from 'jotai/utils';

import {
    ApiArbeidsgiver,
    ApiArbeidsgiverrefusjon,
    ApiHendelse,
    ApiKildetype,
    ApiRefusjonselement,
    ApiSaksbildePerson,
} from '@io/rest/generated/spesialist.schemas';
import { dedupliserteInntektsmeldingHendelser } from '@state/inntektsforhold/arbeidsgiver';
import {
    OverstyrtInntektOgRefusjonArbeidsgiver,
    OverstyrtInntektOgRefusjonDTO,
    Refusjonsopplysning,
} from '@typer/overstyring';
import { DateString } from '@typer/shared';
import { isPerson } from '@utils/typeguards';

export const useInntektOgRefusjon = () => useAtomValue(inntektOgRefusjonState);

export const useSlettLokaleOverstyringer = () => useResetAtom(inntektOgRefusjonState);

export const useLokaleInntektOverstyringer = (
    person: ApiSaksbildePerson,
    showSlettLokaleOverstyringerModal: boolean,
    setShowSlettLokaleOverstyringerModal: (data: boolean) => void,
) => {
    if (!isPerson(person)) {
        throw Error('Mangler persondata.');
    }

    const [lokaleInntektoverstyringer, setLokaleInntektoverstyringer] = useAtom(inntektOgRefusjonState);

    return (overstyrtInntekt: OverstyrtInntektOgRefusjonDTO, organisasjonsnummer?: string) => {
        const overstyrtArbeidsgiver = (overstyrtInntekt as OverstyrtInntektOgRefusjonDTO).arbeidsgivere[0];
        if (
            (lokaleInntektoverstyringer.skjæringstidspunkt &&
                overstyrtInntekt.skjæringstidspunkt !== lokaleInntektoverstyringer.skjæringstidspunkt &&
                !showSlettLokaleOverstyringerModal &&
                lokaleInntektoverstyringer.aktørId === person.aktorId) ||
            overstyrtArbeidsgiver == undefined
        ) {
            setShowSlettLokaleOverstyringerModal(true);
            return;
        }

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
                            (it) => it.organisasjonsnummer === organisasjonsnummer,
                        ).length === 0
                      ? [...arbeidsgivereLagretPåSkjæringstidspunkt, overstyrtArbeidsgiverRetyped]
                      : [
                            ...arbeidsgivereLagretPåSkjæringstidspunkt.filter(
                                (it) => it.organisasjonsnummer !== organisasjonsnummer,
                            ),
                            overstyrtArbeidsgiverRetyped,
                        ],
        });
    };
};

type OverstyrtInntektMetadata = {
    aktørId: string;
    fødselsnummer: string;
    organisasjonsnummer: string;
    skjæringstidspunkt: DateString;
    fraRefusjonsopplysninger: Refusjonsopplysning[];
};

export const mapOgSorterRefusjoner = (
    inntektsmeldinger: ApiHendelse[],
    refusjonselementer: ApiRefusjonselement[],
): Refusjonsopplysning[] => {
    if (refusjonselementer.length === 0) return [];

    const hendelseIderForInntektsmelding: string[] = inntektsmeldinger.map((im) => im.id);
    return [...refusjonselementer]
        .sort((a: ApiRefusjonselement, b: ApiRefusjonselement) => new Date(b.fom).getTime() - new Date(a.fom).getTime())
        .map((it) => ({
            fom: it.fom,
            tom: it.tom,
            beløp: it.belop,
            kilde: hendelseIderForInntektsmelding.includes(it.meldingsreferanseId)
                ? ApiKildetype.INNTEKTSMELDING
                : ApiKildetype.SAKSBEHANDLER,
        }));
};
export const lagOverstyrtInntektMetadata = (
    person: ApiSaksbildePerson,
    arbeidsgiver: ApiArbeidsgiver,
    skjæringstidspunkt: DateString,
    vilkårsgrunnlagId?: string | null,
): OverstyrtInntektMetadata => {
    const vilkårsgrunnlagRefusjonsopplysninger: ApiArbeidsgiverrefusjon | undefined = person.vilkarsgrunnlagV2
        .find((it) => it.id === vilkårsgrunnlagId)
        ?.arbeidsgiverrefusjoner.find(
            (arbeidsgiverrefusjon) => arbeidsgiverrefusjon.arbeidsgiver === arbeidsgiver.organisasjonsnummer,
        );

    const inntektsmeldinghendelser = dedupliserteInntektsmeldingHendelser(arbeidsgiver);
    const refusjonsopplysninger = mapOgSorterRefusjoner(
        inntektsmeldinghendelser,
        vilkårsgrunnlagRefusjonsopplysninger?.refusjonsopplysninger ?? [],
    );

    return {
        aktørId: person.aktorId,
        fødselsnummer: person.fodselsnummer,
        organisasjonsnummer: arbeidsgiver.organisasjonsnummer,
        skjæringstidspunkt: skjæringstidspunkt,
        fraRefusjonsopplysninger: refusjonsopplysninger,
    };
};

export type OverstyrtInntektOgRefusjon = {
    aktørId: string | null;
    fødselsnummer: string | null;
    skjæringstidspunkt: string | null;
    arbeidsgivere: OverstyrtInntektOgRefusjonArbeidsgiver[] | [];
};

const inntektOgRefusjonState = atomWithReset<OverstyrtInntektOgRefusjon>({
    aktørId: null,
    fødselsnummer: null,
    skjæringstidspunkt: null,
    arbeidsgivere: [],
});
