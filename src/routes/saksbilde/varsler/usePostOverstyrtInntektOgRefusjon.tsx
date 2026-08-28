import { useFjernOppdatererToast } from '@hooks/useFjernOppdatererToast';
import { usePostOverstyrInntektOgRefusjon } from '@io/rest/generated/overstyringer/overstyringer';
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
    postOverstyring: (overstyrtInntekt: OverstyrtInntektOgRefusjonDTO) => Promise<void>;
}

export const usePostOverstyrtInntektOgRefusjon = (): PostOverstyrtInntektOgRefusjonResponse => {
    const addToast = useAddToast();
    const removeToast = useRemoveToast();
    const resetLokaleOverstyringer = useSlettLokaleOverstyringer();
    const [visningenOppdateres, setVisningenOppdateres] = useVisningenOppdateresState();

    const { mutateAsync: overstyrInntektOgRefusjon, isPending: isLoading, error } = usePostOverstyrInntektOgRefusjon();

    useHåndterNyttEvent((event) => {
        if (erNyOppgaveEvent(event) && visningenOppdateres) {
            addToast(visningenErOppdatertToast({ callback: () => removeToast(visningenErOppdatertToastKey) }));
            setVisningenOppdateres(false);
            resetLokaleOverstyringer();
        }
    });

    useFjernOppdatererToast(visningenOppdateres);

    const postOverstyring = async (overstyrtInntekt: OverstyrtInntektOgRefusjonDTO): Promise<void> => {
        return overstyrInntektOgRefusjon({
            vedtaksperiodeId: overstyrtInntekt.vedtaksperiodeId,
            data: {
                skjæringstidspunkt: overstyrtInntekt.skjæringstidspunkt,
                arbeidsgivere: overstyrtInntekt.arbeidsgivere.map((arbeidsgiver) => ({
                    organisasjonsnummer: arbeidsgiver.organisasjonsnummer,
                    månedligInntekt: arbeidsgiver.månedligInntekt,
                    fraMånedligInntekt: arbeidsgiver.fraMånedligInntekt,
                    refusjonsopplysninger: arbeidsgiver.refusjonsopplysninger.map((refusjon) => ({
                        fom: refusjon.fom,
                        tom: refusjon.tom,
                        beløp: refusjon.beløp,
                    })),
                    fraRefusjonsopplysninger: arbeidsgiver.fraRefusjonsopplysninger.map((refusjon) => ({
                        fom: refusjon.fom,
                        tom: refusjon.tom,
                        beløp: refusjon.beløp,
                    })),
                    begrunnelse: arbeidsgiver.begrunnelse,
                    forklaring: arbeidsgiver.forklaring,
                    lovhjemmel: arbeidsgiver.lovhjemmel,
                    fom: arbeidsgiver.fom ?? null,
                    tom: arbeidsgiver.tom ?? null,
                })),
            },
        })
            .then(() => {
                setVisningenOppdateres(true);
                addToast(visningenOppdateresToast({}));
            })
            .catch(() => Promise.resolve());
    };

    return {
        postOverstyring,
        isLoading: isLoading || visningenOppdateres,
        error: error ? 'Kunne ikke overstyre inntekt og/eller refusjon. Prøv igjen senere.' : undefined,
    };
};
