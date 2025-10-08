import { useAtom, useAtomValue } from 'jotai';
import { atomWithReset, useResetAtom } from 'jotai/utils';

import {
    Arbeidsgiver,
    Arbeidsgiverrefusjon,
    Hendelse,
    Kildetype,
    Maybe,
    PersonFragment,
    Refusjonselement,
} from '@io/graphql';
import { useVilkårsgrunnlag } from '@saksbilde/sykepengegrunnlag/useVilkårsgrunnlag';
import { useActivePeriod } from '@state/periode';
import { dedupliserteInntektsmeldingHendelser } from '@state/selectors/arbeidsgiver';
import {
    OverstyrtInntektOgRefusjonArbeidsgiver,
    OverstyrtInntektOgRefusjonDTO,
    Refusjonsopplysning,
} from '@typer/overstyring';
import { ActivePeriod, DateString } from '@typer/shared';
import { isBeregnetPeriode, isGhostPeriode, isPerson, isUberegnetPeriode } from '@utils/typeguards';

export const useInntektOgRefusjon = () => useAtomValue(inntektOgRefusjonState);

export const useSlettLokaleOverstyringer = () => useResetAtom(inntektOgRefusjonState);

export const useLokaleInntektOverstyringer = (
    person: PersonFragment,
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
    inntektsmeldinger: Hendelse[],
    refusjonselementer: Refusjonselement[],
): Refusjonsopplysning[] => {
    if (refusjonselementer.length === 0) return [];

    const hendelseIderForInntektsmelding: string[] = inntektsmeldinger.map((im) => im.id);
    return [...refusjonselementer]
        .sort((a: Refusjonselement, b: Refusjonselement) => new Date(b.fom).getTime() - new Date(a.fom).getTime())
        .map((it) => ({
            fom: it.fom,
            tom: it.tom,
            beløp: it.belop,
            kilde: hendelseIderForInntektsmelding.includes(it.meldingsreferanseId)
                ? Kildetype.Inntektsmelding
                : Kildetype.Saksbehandler,
        }));
};
export const useOverstyrtInntektMetadata = (
    person: PersonFragment,
    arbeidsgiver: Arbeidsgiver,
    period: Maybe<ActivePeriod>,
): OverstyrtInntektMetadata => {
    const activePeriod = useActivePeriod(person);
    const vilkårsgrunnlagAktivPeriode = useVilkårsgrunnlag(person, activePeriod);
    const uberegnetAGfinnesIVilkårsgrunnlaget = vilkårsgrunnlagAktivPeriode?.inntekter.find(
        (it) => it.arbeidsgiver === arbeidsgiver.organisasjonsnummer,
    );
    if (
        !isBeregnetPeriode(period) &&
        !isGhostPeriode(period) &&
        !(isUberegnetPeriode(period) && uberegnetAGfinnesIVilkårsgrunnlaget)
    ) {
        throw Error('Mangler data for å kunne overstyre inntekt.');
    }
    const vilkårsgrunnlagRefusjonsopplysninger: Arbeidsgiverrefusjon | undefined = person.vilkarsgrunnlagV2
        .filter((it) =>
            !isUberegnetPeriode(period)
                ? it.id === period?.vilkarsgrunnlagId
                : it.id === vilkårsgrunnlagAktivPeriode?.id,
        )[0]
        ?.arbeidsgiverrefusjoner.filter(
            (arbeidsgiverrefusjon) => arbeidsgiverrefusjon.arbeidsgiver === arbeidsgiver.organisasjonsnummer,
        )[0];

    const inntektsmeldinghendelser = dedupliserteInntektsmeldingHendelser(arbeidsgiver);
    const refusjonsopplysninger = mapOgSorterRefusjoner(
        inntektsmeldinghendelser,
        vilkårsgrunnlagRefusjonsopplysninger?.refusjonsopplysninger ?? [],
    );

    return {
        aktørId: person.aktorId,
        fødselsnummer: person.fodselsnummer,
        organisasjonsnummer: arbeidsgiver.organisasjonsnummer,
        skjæringstidspunkt: period.skjaeringstidspunkt,
        fraRefusjonsopplysninger: refusjonsopplysninger,
    };
};

export type OverstyrtInntektOgRefusjon = {
    aktørId: Maybe<string>;
    fødselsnummer: Maybe<string>;
    skjæringstidspunkt: Maybe<string>;
    arbeidsgivere: OverstyrtInntektOgRefusjonArbeidsgiver[] | [];
};

const inntektOgRefusjonState = atomWithReset<OverstyrtInntektOgRefusjon>({
    aktørId: null,
    fødselsnummer: null,
    skjæringstidspunkt: null,
    arbeidsgivere: [],
});
