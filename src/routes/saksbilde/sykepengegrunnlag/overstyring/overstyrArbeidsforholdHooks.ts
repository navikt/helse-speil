import { useMutation } from '@apollo/client';
import { useFjernOppdatererToast } from '@hooks/useFjernOppdatererToast';
import {
    ArbeidsforholdOverstyringHandlingInput,
    OverstyrArbeidsforholdMutationDocument,
    OverstyringArbeidsforholdInput,
    PersonFragment,
} from '@io/graphql';
import { usePostOverstyrArbeidsforhold as usePostOverstyrArbeidsforholdRest } from '@io/rest/generated/overstyringer/overstyringer';
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
import { skalBrukeRestOverstyring } from '@utils/featureToggles';
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

    const [overstyrMutation, { error, loading }] = useMutation(OverstyrArbeidsforholdMutationDocument);
    // TODO: Fjern GraphQL-varianten (og skalBrukeRestOverstyring-bryteren) når REST er rullet ut i prod
    const {
        mutateAsync: overstyrArbeidsforholdRest,
        error: restError,
        isPending: restIsLoading,
    } = usePostOverstyrArbeidsforholdRest();

    useHåndterNyttEvent((event) => {
        if (visningenOppdateres && event.event === 'NY_SAKSBEHANDLEROPPGAVE') {
            addToast(visningenErOppdatertToast({ callback: () => removeToast(visningenErOppdatertToastKey) }));
            setVisningenOppdateres(false);
            if (onVisningOppdatert) onVisningOppdatert();
        }
    });

    useFjernOppdatererToast(visningenOppdateres);

    return {
        isLoading: (skalBrukeRestOverstyring() ? restIsLoading : loading) || visningenOppdateres,
        error:
            (skalBrukeRestOverstyring() ? restError : error) &&
            'Kunne ikke overstyre arbeidsforhold. Prøv igjen senere.',
        postOverstyring: (overstyrtArbeidsforhold: OverstyrtArbeidsforholdDTO) => {
            if (!skalBrukeRestOverstyring()) {
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
                return;
            }

            void overstyrArbeidsforholdRest({
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
