import { useState } from 'react';

import { useMutation } from '@apollo/client';
import { useFjernKalkulerToast } from '@hooks/useFjernKalkulererToast';
import {
    ArbeidsforholdOverstyringHandlingInput,
    OverstyrArbeidsforholdMutationDocument,
    OverstyringArbeidsforholdInput,
    PersonFragment,
} from '@io/graphql';
import { useCalculatingState } from '@state/calculating';
import { kalkulererFerdigToastKey, kalkulererToast, kalkuleringFerdigToast } from '@state/kalkuleringstoasts';
import { useHåndterOpptegnelser, useSetOpptegnelserPollingRate } from '@state/opptegnelser';
import { useActivePeriodWithPerson } from '@state/periode';
import { finnAlleInntektsforhold } from '@state/selectors/arbeidsgiver';
import { useAddToast, useRemoveToast } from '@state/toasts';
import { BegrunnelseForOverstyring, OverstyrtArbeidsforholdDTO } from '@typer/overstyring';
import { finnFørsteVedtaksperiodeIdPåSkjæringstidspunkt } from '@utils/sykefraværstilfelle';

type OverstyrtArbeidsforholdGetter = (
    organisasjonsnummerGhost: string,
    skjæringstidspunkt: string,
    arbeidsforholdSkalDeaktiveres: boolean,
    forklaring: string,
    begrunnelse: BegrunnelseForOverstyring,
    paragraf?: string,
    ledd?: string,
    bokstav?: string,
) => OverstyrtArbeidsforholdDTO;

export const useGetOverstyrtArbeidsforhold = (person: PersonFragment): OverstyrtArbeidsforholdGetter => {
    const valgtVedtaksperiode = useActivePeriodWithPerson(person);

    return (organisasjonsnummerGhost, skjæringstidspunkt, arbeidsforholdSkalDeaktiveres, forklaring, begrunnelse) => ({
        fødselsnummer: person?.fodselsnummer,
        aktørId: person?.aktorId,
        skjæringstidspunkt: skjæringstidspunkt,
        overstyrteArbeidsforhold: [
            {
                orgnummer: organisasjonsnummerGhost,
                deaktivert: arbeidsforholdSkalDeaktiveres,
                forklaring: forklaring,
                begrunnelse: begrunnelse.forklaring,
                lovhjemmel: begrunnelse.lovhjemmel,
            },
        ],
        vedtaksperiodeId: finnFørsteVedtaksperiodeIdPåSkjæringstidspunkt(
            finnAlleInntektsforhold(person),
            valgtVedtaksperiode!,
        ),
    });
};

export const usePostOverstyrtArbeidsforhold = (aktørId: string, onFerdigKalkulert?: () => void) => {
    const addToast = useAddToast();
    const removeToast = useRemoveToast();
    const setPollingRate = useSetOpptegnelserPollingRate();

    const [calculating, setCalculating] = useCalculatingState();
    const [timedOut, setTimedOut] = useState(false);

    const [overstyrMutation, { error, loading }] = useMutation(OverstyrArbeidsforholdMutationDocument);

    useHåndterOpptegnelser((opptegnelse) => {
        if (calculating && opptegnelse.type === 'NY_SAKSBEHANDLEROPPGAVE') {
            addToast(kalkuleringFerdigToast({ callback: () => removeToast(kalkulererFerdigToastKey) }));
            setCalculating(false);
            if (onFerdigKalkulert) onFerdigKalkulert();
        }
    });

    useFjernKalkulerToast(calculating, () => setTimedOut(true));

    return {
        isLoading: loading || calculating,
        error: error && 'Kunne ikke overstyre arbeidsforhold. Prøv igjen senere.',
        timedOut,
        setTimedOut,
        postOverstyring: (overstyrtArbeidsforhold: OverstyrtArbeidsforholdDTO) => {
            const overstyring: ArbeidsforholdOverstyringHandlingInput = {
                aktorId: overstyrtArbeidsforhold.aktørId,
                overstyrteArbeidsforhold: overstyrtArbeidsforhold.overstyrteArbeidsforhold.map(
                    (arbeidsforhold): OverstyringArbeidsforholdInput => ({
                        begrunnelse: arbeidsforhold.begrunnelse,
                        deaktivert: arbeidsforhold.deaktivert,
                        forklaring: arbeidsforhold.forklaring,
                        orgnummer: arbeidsforhold.orgnummer,
                        lovhjemmel: arbeidsforhold.lovhjemmel,
                    }),
                ),
                fodselsnummer: overstyrtArbeidsforhold.fødselsnummer,
                skjaringstidspunkt: overstyrtArbeidsforhold.skjæringstidspunkt,
                vedtaksperiodeId: overstyrtArbeidsforhold.vedtaksperiodeId,
            };

            void overstyrMutation({
                variables: { overstyring: overstyring },
                onCompleted: () => {
                    if (aktørId) {
                        setCalculating(true);
                        addToast(kalkulererToast({}));
                        setPollingRate(1000);
                    }
                },
            });
        },
    };
};
