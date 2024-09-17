import { atom, useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';

import { Arbeidsgiverrefusjon, Hendelse, Kildetype, Maybe, PersonFragment, Refusjonselement } from '@io/graphql';
import { useVilkårsgrunnlag } from '@saksbilde/sykepengegrunnlag/useVilkårsgrunnlag';
import {
    useArbeidsgiver,
    useInntektsmeldinghendelser,
    usePeriodForSkjæringstidspunktForArbeidsgiver,
} from '@state/arbeidsgiver';
import { useActivePeriod } from '@state/periode';
import {
    OverstyrtInntektOgRefusjonArbeidsgiver,
    OverstyrtInntektOgRefusjonDTO,
    Refusjonsopplysning,
} from '@typer/overstyring';
import { DateString } from '@typer/shared';
import { isArbeidsgiver, isBeregnetPeriode, isGhostPeriode, isPerson, isUberegnetPeriode } from '@utils/typeguards';

export const useInntektOgRefusjon = () => useRecoilValue(inntektOgRefusjonState);

export const useSlettLokaleOverstyringer = () => useResetRecoilState(inntektOgRefusjonState);

export const useLokaletInntektOverstyringer = (
    person: PersonFragment,
    showSlettLokaleOverstyringerModal: boolean,
    setShowSlettLokaleOverstyringerModal: (data: boolean) => void,
) => {
    if (!isPerson(person)) {
        throw Error('Mangler persondata.');
    }

    const [lokaleInntektoverstyringer, setLokaleInntektoverstyringer] = useRecoilState(inntektOgRefusjonState);

    return (overstyrtInntekt: OverstyrtInntektOgRefusjonDTO, organisasjonsnummer?: string) => {
        if (
            lokaleInntektoverstyringer.skjæringstidspunkt &&
            overstyrtInntekt.skjæringstidspunkt !== lokaleInntektoverstyringer.skjæringstidspunkt &&
            !showSlettLokaleOverstyringerModal &&
            lokaleInntektoverstyringer.aktørId === person.aktorId
        ) {
            setShowSlettLokaleOverstyringerModal(true);
            return;
        }

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
    refusjonselementer?: Refusjonselement[],
): Refusjonsopplysning[] => {
    if (!refusjonselementer) return [];

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
    skjæringstidspunkt: DateString,
    organisasjonsnummer: string,
): OverstyrtInntektMetadata => {
    const period = usePeriodForSkjæringstidspunktForArbeidsgiver(person, skjæringstidspunkt, organisasjonsnummer);
    const activePeriod = useActivePeriod(person);
    const arbeidsgiver = useArbeidsgiver(person, organisasjonsnummer);
    const inntektsmeldinghendelser = useInntektsmeldinghendelser(arbeidsgiver);
    const vilkårsgrunnlagAktivPeriode = useVilkårsgrunnlag(person, activePeriod);
    const uberegnetAGfinnesIVilkårsgrunnlaget = vilkårsgrunnlagAktivPeriode?.arbeidsgiverrefusjoner.find(
        (it) => it.arbeidsgiver === arbeidsgiver?.organisasjonsnummer,
    );

    if (
        !isPerson(person) ||
        !isArbeidsgiver(arbeidsgiver) ||
        !(
            isBeregnetPeriode(period) ||
            isGhostPeriode(period) ||
            (isUberegnetPeriode(period) && uberegnetAGfinnesIVilkårsgrunnlaget)
        )
    ) {
        throw Error('Mangler data for å kunne overstyre inntekt.');
    }

    const vilkårsgrunnlagRefusjonsopplysninger: Arbeidsgiverrefusjon = person.vilkarsgrunnlag
        .filter((it) =>
            !isUberegnetPeriode(period)
                ? it.id === period?.vilkarsgrunnlagId
                : it.id === vilkårsgrunnlagAktivPeriode?.id,
        )[0]
        .arbeidsgiverrefusjoner.filter(
            (arbeidsgiverrefusjon) => arbeidsgiverrefusjon.arbeidsgiver === arbeidsgiver.organisasjonsnummer,
        )[0];

    const refusjonsopplysninger = mapOgSorterRefusjoner(
        inntektsmeldinghendelser,
        vilkårsgrunnlagRefusjonsopplysninger?.refusjonsopplysninger,
    );

    return {
        aktørId: person.aktorId,
        fødselsnummer: person.fodselsnummer,
        organisasjonsnummer: arbeidsgiver.organisasjonsnummer,
        skjæringstidspunkt: period.skjaeringstidspunkt,
        fraRefusjonsopplysninger: refusjonsopplysninger,
    };
};

type OverstyrtInntektOgRefusjon = {
    aktørId: Maybe<string>;
    fødselsnummer: Maybe<string>;
    skjæringstidspunkt: Maybe<string>;
    arbeidsgivere: OverstyrtInntektOgRefusjonArbeidsgiver[] | [];
};

const inntektOgRefusjonState = atom<OverstyrtInntektOgRefusjon>({
    key: 'inntektOgRefusjonState',
    default: {
        aktørId: null,
        fødselsnummer: null,
        skjæringstidspunkt: null,
        arbeidsgivere: [],
    },
});
