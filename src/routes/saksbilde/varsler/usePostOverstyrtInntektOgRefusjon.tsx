import { useState } from 'react';

import { FetchResult, useMutation } from '@apollo/client';
import { useFjernOppdatererToast } from '@hooks/useFjernOppdatererToast';
import {
    OverstyrInntektOgRefusjonMutationDocument,
    OverstyrInntektOgRefusjonMutationMutation,
    OverstyringArbeidsgiverInput,
} from '@io/graphql';
import {
    visningenErOppdatertToast,
    visningenErOppdatertToastKey,
    visningenOppdateresToast,
} from '@state/oppdateringToasts';
import { useSlettLokaleOverstyringer } from '@state/overstyring';
import { erNyOppgaveEvent, useHåndterNyttEvent } from '@state/serverSentEvents';
import { useAddToast, useRemoveToast } from '@state/toasts';
import { useVisningenOppdateresState } from '@state/visningenOppdateres';
import { OverstyrtInntektOgRefusjonDTO } from '@typer/overstyring';

interface PostOverstyrtInntektOgRefusjonResponse {
    isLoading: boolean;
    error: string | undefined;
    timedOut: boolean;
    setTimedOut: (nyTimedOut: boolean) => void;
    postOverstyring: (
        overstyrtInntekt: OverstyrtInntektOgRefusjonDTO,
    ) => Promise<void | FetchResult<OverstyrInntektOgRefusjonMutationMutation>>;
}

export const usePostOverstyrtInntektOgRefusjon = (): PostOverstyrtInntektOgRefusjonResponse => {
    const addToast = useAddToast();
    const removeToast = useRemoveToast();
    const resetLokaleOverstyringer = useSlettLokaleOverstyringer();
    const [visningenOppdateres, setVisningenOppdateres] = useVisningenOppdateresState();
    const [timedOut, setTimedOut] = useState(false);

    const [overstyrMutation, { loading, error }] = useMutation(OverstyrInntektOgRefusjonMutationDocument);

    useHåndterNyttEvent((event) => {
        if (erNyOppgaveEvent(event) && visningenOppdateres) {
            addToast(visningenErOppdatertToast({ callback: () => removeToast(visningenErOppdatertToastKey) }));
            setVisningenOppdateres(false);
            resetLokaleOverstyringer();
        }
    });

    useFjernOppdatererToast(visningenOppdateres, () => setTimedOut(true));

    const overstyrInntektOgRefusjon = async (
        overstyrtInntekt: OverstyrtInntektOgRefusjonDTO,
    ): Promise<void | FetchResult<OverstyrInntektOgRefusjonMutationMutation>> =>
        overstyrMutation({
            variables: {
                overstyring: {
                    aktorId: overstyrtInntekt.aktørId,
                    arbeidsgivere: overstyrtInntekt.arbeidsgivere.map(
                        (arbeidsgiver): OverstyringArbeidsgiverInput => ({
                            begrunnelse: arbeidsgiver.begrunnelse,
                            forklaring: arbeidsgiver.forklaring,
                            fraManedligInntekt: arbeidsgiver.fraMånedligInntekt,
                            manedligInntekt: arbeidsgiver.månedligInntekt,
                            organisasjonsnummer: arbeidsgiver.organisasjonsnummer,
                            fraRefusjonsopplysninger: arbeidsgiver.fraRefusjonsopplysninger.map((refusjon) => ({
                                fom: refusjon.fom,
                                tom: refusjon.tom,
                                belop: refusjon.beløp,
                            })),
                            refusjonsopplysninger: arbeidsgiver.refusjonsopplysninger.map((refusjon) => ({
                                fom: refusjon.fom,
                                tom: refusjon.tom,
                                belop: refusjon.beløp,
                            })),
                            lovhjemmel:
                                arbeidsgiver.lovhjemmel !== undefined
                                    ? {
                                          bokstav: arbeidsgiver.lovhjemmel.bokstav,
                                          ledd: arbeidsgiver.lovhjemmel.ledd,
                                          paragraf: arbeidsgiver.lovhjemmel.paragraf,
                                          lovverk: arbeidsgiver.lovhjemmel.lovverk,
                                          lovverksversjon: arbeidsgiver.lovhjemmel.lovverksversjon,
                                      }
                                    : undefined,
                            fom: arbeidsgiver.fom ?? null,
                            tom: arbeidsgiver.tom ?? null,
                        }),
                    ),
                    fodselsnummer: overstyrtInntekt.fødselsnummer,
                    skjaringstidspunkt: overstyrtInntekt.skjæringstidspunkt,
                    vedtaksperiodeId: overstyrtInntekt.vedtaksperiodeId,
                },
            },
            onCompleted: () => {
                setVisningenOppdateres(true);
                addToast(visningenOppdateresToast({}));
            },
        }).catch(() => Promise.resolve());

    return {
        postOverstyring: overstyrInntektOgRefusjon,
        isLoading: loading || visningenOppdateres,
        error: error && 'Kunne ikke overstyre inntekt og/eller refusjon. Prøv igjen senere.',
        timedOut,
        setTimedOut,
    };
};
