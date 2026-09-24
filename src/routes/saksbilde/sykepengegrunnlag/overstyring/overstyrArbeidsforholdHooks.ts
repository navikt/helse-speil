import { useFjernOppdatererToast } from '@hooks/useFjernOppdatererToast';
import { PersonFragment } from '@io/graphql';
import { usePostOverstyrArbeidsforhold } from '@io/rest/generated/overstyringer/overstyringer';
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
import { OverstyrtArbeidsforholdDTO, ÅrsakForOverstyring } from '@typer/overstyring';
import { finnFørsteVedtaksperiodeIdPåSkjæringstidspunkt } from '@utils/sykefraværstilfelle';

type OverstyrtArbeidsforholdGetter = (
    organisasjonsnummerGhost: string,
    skjæringstidspunkt: string,
    arbeidsforholdSkalDeaktiveres: boolean,
    begrunnelse: string,
    årsak: ÅrsakForOverstyring,
    paragraf?: string,
    ledd?: string,
    bokstav?: string,
) => OverstyrtArbeidsforholdDTO;

export const useGetOverstyrtArbeidsforhold = (person: PersonFragment): OverstyrtArbeidsforholdGetter => {
    const valgtVedtaksperiode = useActivePeriodWithPerson(person);

    return (organisasjonsnummerGhost, skjæringstidspunkt, arbeidsforholdSkalDeaktiveres, begrunnelse, årsak) => ({
        fødselsnummer: person?.fodselsnummer,
        aktørId: person?.aktorId,
        skjæringstidspunkt: skjæringstidspunkt,
        overstyrteArbeidsforhold: [
            {
                orgnummer: organisasjonsnummerGhost,
                deaktivert: arbeidsforholdSkalDeaktiveres,
                forklaring: begrunnelse,
                begrunnelse: årsak.forklaring,
                lovhjemmel: årsak.lovhjemmel,
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

    const { mutateAsync: overstyrArbeidsforhold, error, isPending: isLoading } = usePostOverstyrArbeidsforhold();

    useHåndterNyttEvent((event) => {
        if (visningenOppdateres && event.event === 'NY_SAKSBEHANDLEROPPGAVE') {
            addToast(visningenErOppdatertToast({ callback: () => removeToast(visningenErOppdatertToastKey) }));
            setVisningenOppdateres(false);
            if (onVisningOppdatert) onVisningOppdatert();
        }
    });

    useFjernOppdatererToast(visningenOppdateres);

    return {
        isLoading: isLoading || visningenOppdateres,
        error: error && 'Kunne ikke overstyre arbeidsforhold. Prøv igjen senere.',
        postOverstyring: (overstyrtArbeidsforhold: OverstyrtArbeidsforholdDTO) => {
            void overstyrArbeidsforhold({
                vedtaksperiodeId: overstyrtArbeidsforhold.vedtaksperiodeId,
                data: {
                    skjæringstidspunkt: overstyrtArbeidsforhold.skjæringstidspunkt,
                    overstyrteArbeidsforhold: overstyrtArbeidsforhold.overstyrteArbeidsforhold.map(
                        (arbeidsforhold) => ({
                            organisasjonsnummer: arbeidsforhold.orgnummer,
                            deaktivert: arbeidsforhold.deaktivert,
                            begrunnelse: arbeidsforhold.begrunnelse,
                            forklaring: arbeidsforhold.forklaring,
                            lovhjemmel: arbeidsforhold.lovhjemmel,
                        }),
                    ),
                },
            }).then(() => {
                if (aktørId) {
                    setVisningenOppdateres(true);
                    addToast(visningenOppdateresToast({}));
                }
            });
        },
    };
};
