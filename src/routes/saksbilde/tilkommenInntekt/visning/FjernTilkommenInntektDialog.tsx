import React, { ReactElement } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { BodyLong, Button, Dialog, ErrorMessage, Textarea, VStack } from '@navikt/ds-react';

import { FjernTilkommenInntektSkjema, fjernTilkommenInntektSkjema } from '@/form-schemas/fjernTilkommenInntektSkjema';
import { zodResolver } from '@hookform/resolvers/zod';
import { ApiTilkommenInntekt } from '@io/rest/generated/spesialist.schemas';
import { usePatchTilkommenInntekt } from '@io/rest/generated/tilkomne-inntekter/tilkomne-inntekter';
import { useTilkommenInntektMedOrganisasjonsnummer } from '@state/tilkommenInntekt';
import { somNorskDato } from '@utils/date';

interface FjernTilkommenInntektDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    tilkommenInntekt: ApiTilkommenInntekt;
    personPseudoId?: string;
}

export function FjernTilkommenInntektDialog({
    open,
    onOpenChange,
    tilkommenInntekt,
    personPseudoId,
}: FjernTilkommenInntektDialogProps): ReactElement {
    const { mutateAsync, error: mutationError } = usePatchTilkommenInntekt();
    const { tilkommenInntektRefetch } = useTilkommenInntektMedOrganisasjonsnummer(
        tilkommenInntekt.tilkommenInntektId,
        personPseudoId,
    );

    const form = useForm<FjernTilkommenInntektSkjema>({
        resolver: zodResolver(fjernTilkommenInntektSkjema),
        defaultValues: {
            begrunnelse: '',
        },
    });

    async function onSubmit(values: FjernTilkommenInntektSkjema) {
        await mutateAsync(
            {
                tilkommenInntektId: tilkommenInntekt.tilkommenInntektId,
                data: {
                    endringer: {
                        fjernet: {
                            fra: false,
                            til: true,
                        },
                    },
                    notatTilBeslutter: values.begrunnelse,
                },
            },
            {
                onSuccess: () => tilkommenInntektRefetch().then(() => onOpenChange(false)),
            },
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange} aria-label="Fjern periode">
            <Dialog.Popup>
                <Dialog.Header>
                    <Dialog.Title>Fjern periode</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>
                    <VStack gap="space-16">
                        <BodyLong>
                            Vil du fjerne perioden {somNorskDato(tilkommenInntekt.periode.fom)} –{' '}
                            {somNorskDato(tilkommenInntekt.periode.tom)}?
                        </BodyLong>
                        <form onSubmit={form.handleSubmit(onSubmit)} id="fjern-tilkommen-inntekt-form">
                            <Controller
                                control={form.control}
                                name="begrunnelse"
                                render={({ field, fieldState }) => (
                                    <Textarea
                                        {...field}
                                        error={fieldState.error?.message}
                                        label="Begrunn hvorfor perioden fjernes"
                                        description="Teksten blir ikke vist til den sykmeldte, med mindre hen ber om innsyn."
                                    />
                                )}
                            />
                        </form>
                        {mutationError && (
                            <ErrorMessage showIcon>
                                Klarte ikke fjerne perioden. Prøv igjen senere, eller kontakt en coach.
                            </ErrorMessage>
                        )}
                    </VStack>
                </Dialog.Body>
                <Dialog.Footer>
                    <Dialog.CloseTrigger>
                        <Button type="button" variant="secondary" disabled={form.formState.isSubmitting}>
                            Nei
                        </Button>
                    </Dialog.CloseTrigger>
                    <Button type="submit" form="fjern-tilkommen-inntekt-form" loading={form.formState.isSubmitting}>
                        Ja
                    </Button>
                </Dialog.Footer>
            </Dialog.Popup>
        </Dialog>
    );
}
