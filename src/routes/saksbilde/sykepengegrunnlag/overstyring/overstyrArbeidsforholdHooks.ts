import { useState } from 'react';

import { useMutation } from '@apollo/client';
import { useFjernOppdatererToast } from '@hooks/useFjernOppdatererToast';
import {
    ArbeidsforholdOverstyringHandlingInput,
    OverstyrArbeidsforholdMutationDocument,
    OverstyringArbeidsforholdInput,
    PersonFragment,
} from '@io/graphql';
import { finnAlleInntektsforhold } from '@state/inntektsforhold/inntektsforhold';
import {
    visningenErOppdatertToast,
    visningenErOppdatertToastKey,
    visningenOppdateresToast,
} from '@state/oppdateringToasts';
import { useActivePeriodWithPerson } from '@state/periode';
import { useHåndterNyttEvent } from '@state/serverSentEvents';
import { useAddToast, useRemoveToast } from '@state/toasts';
import { useVisningenOppdateresState } from '@state/visningenOppdateres';
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

export const usePostOverstyrtArbeidsforhold = (aktørId: string, onVisningOppdatert?: () => void) => {
    const addToast = useAddToast();
    const removeToast = useRemoveToast();

    const [visningenOppdateres, setVisningenOppdateres] = useVisningenOppdateresState();
    const [timedOut, setTimedOut] = useState(false);

    const [overstyrMutation, { error, loading }] = useMutation(OverstyrArbeidsforholdMutationDocument);

    useHåndterNyttEvent((event) => {
        if (visningenOppdateres && event.event === 'NY_SAKSBEHANDLEROPPGAVE') {
            addToast(visningenErOppdatertToast({ callback: () => removeToast(visningenErOppdatertToastKey) }));
            setVisningenOppdateres(false);
            if (onVisningOppdatert) onVisningOppdatert();
        }
    });

    useFjernOppdatererToast(visningenOppdateres, () => setTimedOut(true));

    return {
        isLoading: loading || visningenOppdateres,
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
                        setVisningenOppdateres(true);
                        addToast(visningenOppdateresToast({}));
                    }
                },
            });
        },
    };
};
