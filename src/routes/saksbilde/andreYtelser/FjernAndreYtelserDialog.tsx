import React, { ReactElement } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { BodyLong, Button, Dialog, ErrorMessage, Textarea, VStack } from '@navikt/ds-react';

import { FjernAndreYtelserSkjema, fjernAndreYtelserSkjema } from '@/form-schemas/fjernAndreYtelserSkjema';
import { VisesIkkeIVedtakTag } from '@components/tags/VisesIkkeIVedtakTag';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePostFjernGraderteAndreYtelser } from '@io/rest/generated/graderte-andre-ytelser/graderte-andre-ytelser';
import { ApiGraderteAndreYtelser } from '@io/rest/generated/spesialist.schemas';
import { andreYtelseTypeTilNavn } from '@saksbilde/andreYtelser/andreYtelserLabels';
import { useGraderteAndreYtelser } from '@saksbilde/andreYtelser/useGraderteAndreYtelser';

interface FjernAndreYtelserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    ytelse: ApiGraderteAndreYtelser;
}

export function FjernAndreYtelserDialog({ open, onOpenChange, ytelse }: FjernAndreYtelserDialogProps): ReactElement {
    const { invaliderGraderteAndreYtelser } = useGraderteAndreYtelser(ytelse.andreYtelserId);
    const {
        mutate,
        isPending,
        error: mutationError,
    } = usePostFjernGraderteAndreYtelser({
        mutation: {
            onSuccess: async () => {
                await invaliderGraderteAndreYtelser();
                onOpenChange(false);
            },
        },
    });

    const form = useForm<FjernAndreYtelserSkjema>({
        resolver: zodResolver(fjernAndreYtelserSkjema),
        defaultValues: {
            begrunnelse: '',
        },
    });

    function onSubmit(values: FjernAndreYtelserSkjema) {
        mutate({
            graderteAndreYtelserId: ytelse.andreYtelserId,
            data: { notatTilBeslutter: values.begrunnelse },
        });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange} aria-label="Fjern ytelse">
            <Dialog.Popup>
                <Dialog.Header>
                    <Dialog.Title>Fjern ytelse</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>
                    <VStack gap="space-16">
                        <BodyLong>
                            Vil du fjerne {andreYtelseTypeTilNavn[ytelse.andreYtelseType].toLowerCase()} med alle
                            tilhørende perioder?
                        </BodyLong>
                        <form onSubmit={form.handleSubmit(onSubmit)} id="fjern-andre-ytelser-form">
                            <VisesIkkeIVedtakTag />
                            <Controller
                                control={form.control}
                                name="begrunnelse"
                                render={({ field, fieldState }) => (
                                    <Textarea
                                        {...field}
                                        error={fieldState.error?.message}
                                        label="Begrunn hvorfor ytelsen fjernes"
                                        description="Teksten blir ikke vist til den sykmeldte, med mindre hen ber om innsyn."
                                    />
                                )}
                            />
                        </form>
                        {mutationError && (
                            <ErrorMessage showIcon>
                                Klarte ikke fjerne ytelsen. Prøv igjen senere, eller kontakt en coach.
                            </ErrorMessage>
                        )}
                    </VStack>
                </Dialog.Body>
                <Dialog.Footer>
                    <Dialog.CloseTrigger>
                        <Button type="button" variant="secondary" disabled={isPending}>
                            Nei
                        </Button>
                    </Dialog.CloseTrigger>
                    <Button type="submit" form="fjern-andre-ytelser-form" loading={isPending}>
                        Ja
                    </Button>
                </Dialog.Footer>
            </Dialog.Popup>
        </Dialog>
    );
}
