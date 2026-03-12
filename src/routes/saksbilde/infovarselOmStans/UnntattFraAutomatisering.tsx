import dayjs from 'dayjs';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';

import { Alert, BodyShort, Button, ErrorMessage, HStack, Textarea, VStack } from '@navikt/ds-react';

import { StansAutomatiskBehandlingSchema, stansAutomatiskBehandlingSchema } from '@/form-schemas';
import { useApolloClient } from '@apollo/client';
import { VisHvisSkrivetilgang } from '@components/VisHvisSkrivetilgang';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePatchStansVeileder } from '@io/rest/generated/stans-av-automatisering/stans-av-automatisering';
import {
    opphevStansAutomatiskBehandlingVeilederToast,
    somAutomatiskStansBackendfeil,
} from '@saksbilde/saksbildeMenu/dropdown/stansAutomatiskBehandling/stansAutomatiskBehandlingUtils';
import { useAddToast } from '@state/toasts';
import { ISO_TIDSPUNKTFORMAT, getFormattedDatetimeString } from '@utils/date';

interface UnntattFraAutomatiseringProps {
    årsaker: string[];
    tidspunkt: string;
    fødselsnummer: string;
}

export const UnntattFraAutomatisering = ({ årsaker, tidspunkt, fødselsnummer }: UnntattFraAutomatiseringProps) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [åpen, setÅpen] = useState(false);

    const { personPseudoId } = useParams<{ personPseudoId: string }>();
    const { cache } = useApolloClient();
    const { mutate: stansAutomatiskBehandlingMutation, error } = usePatchStansVeileder();
    const addToast = useAddToast();

    const form = useForm<StansAutomatiskBehandlingSchema>({
        resolver: zodResolver(stansAutomatiskBehandlingSchema),
        defaultValues: {
            fodselsnummer: fødselsnummer,
            begrunnelse: '',
        },
    });

    async function onSubmit(values: StansAutomatiskBehandlingSchema) {
        setLoading(true);
        stansAutomatiskBehandlingMutation(
            {
                pseudoId: personPseudoId,
                data: {
                    begrunnelse: values.begrunnelse,
                    stans: false,
                },
            },
            {
                onSuccess: () => {
                    cache.modify({
                        id: cache.identify({ __typename: 'Person', fodselsnummer: fødselsnummer }),
                        fields: {
                            personinfo: (existing) => ({
                                ...existing,
                                unntattFraAutomatisering: {
                                    __typename: 'UnntattFraAutomatiskGodkjenning',
                                    erUnntatt: false,
                                    arsaker: [],
                                    tidspunkt: dayjs().format(ISO_TIDSPUNKTFORMAT),
                                },
                            }),
                        },
                    });
                    setLoading(false);
                    addToast(opphevStansAutomatiskBehandlingVeilederToast);
                },
                onError: () => {
                    setLoading(false);
                },
            },
        );
    }

    return (
        <Alert variant="info" style={{ borderRadius: 0 }} size="small">
            <BodyShort weight="semibold">Automatisk behandling stanset av veileder</BodyShort>
            <VStack marginBlock="space-8">
                <HStack gap="space-8">
                    <BodyShort weight="semibold">Årsak til stans:</BodyShort>
                    <BodyShort>{årsakerSomTekst(årsaker)}</BodyShort>
                </HStack>
                <HStack gap="space-8">
                    <BodyShort weight="semibold">Stansknappen ble trykket:</BodyShort>
                    <BodyShort>{getFormattedDatetimeString(tidspunkt)}</BodyShort>
                </HStack>
                <BodyShort>Se notat i Modia Sykefraværsoppfølging eller Gosys for mer info.</BodyShort>
            </VStack>
            {!åpen && (
                <VisHvisSkrivetilgang>
                    <Button size="small" variant="primary" type="button" onClick={() => setÅpen(true)}>
                        Opphev stans
                    </Button>
                </VisHvisSkrivetilgang>
            )}
            {åpen && (
                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <Controller
                            control={form.control}
                            name="begrunnelse"
                            render={({ field, fieldState }) => (
                                <Textarea
                                    {...field}
                                    error={fieldState.error?.message}
                                    label="Begrunnelse"
                                    description="Kommer ikke i vedtaksbrevet, men vil bli forevist bruker ved spørsmål om innsyn."
                                    maxLength={2000}
                                />
                            )}
                        />
                        {error && <ErrorMessage showIcon>{somAutomatiskStansBackendfeil(error)}</ErrorMessage>}
                        <HStack gap="space-8" align="center" marginBlock="space-16 space-0">
                            <Button size="small" variant="primary" type="submit" loading={loading}>
                                Opphev stans
                            </Button>
                            <Button size="small" variant="tertiary" type="button" onClick={() => setÅpen(false)}>
                                Avbryt
                            </Button>
                        </HStack>
                    </form>
                </FormProvider>
            )}
        </Alert>
    );
};

const årsakerSomTekst = (årsaker: string[]) => {
    const alle = årsaker.map(årsakSomTekst).join(', ');
    return alle.charAt(0).toUpperCase() + alle.slice(1);
};

const årsakSomTekst = (årsak: string) => årsaktekster[årsak] ?? 'ukjent årsak';

const årsaktekster: { [key: string]: string } = {
    MEDISINSK_VILKAR: 'medisinsk vilkår',
    AKTIVITETSKRAV: 'aktivitetskrav',
    MANGLENDE_MEDVIRKNING: 'manglende medvirkning',
    // Årsakene under er avviklet hos iSyfo, men siden vi skal lese inn gamle stoppknapp-meldinger kan
    // vi få inn noen med disse årsakene også
    BESTRIDELSE_SYKMELDING: 'bestridelse sykmelding',
    TILBAKEDATERT_SYKMELDING: 'tilbakedatert sykmelding',
};
