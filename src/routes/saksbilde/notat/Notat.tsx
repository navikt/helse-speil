import { useParams } from 'next/navigation';
import React, { ReactElement, useState } from 'react';
import { SubmitHandler } from 'react-hook-form';

import { MinusCircleIcon, PlusCircleFillIcon } from '@navikt/aksel-icons';
import { Box, Button, ErrorMessage, VStack } from '@navikt/ds-react';

import { NotatFormFields } from '@/form-schemas/notatSkjema';
import { VisHvisSkrivetilgang } from '@components/VisHvisSkrivetilgang';
import { VisesIkkeIVedtakTag } from '@components/tags/VisesIkkeIVedtakTag';
import { Key, useKeyboard } from '@hooks/useKeyboard';
import {
    getGetNotatVedtaksperiodeIderForPersonQueryKey,
    getGetNotaterForVedtaksperiodeQueryKey,
    usePostNotat,
} from '@io/rest/generated/notater/notater';
import { ApiNotatType } from '@io/rest/generated/spesialist.schemas';
import { NotatSkjema } from '@saksbilde/notat/NotatSkjema';
import { useNotatkladd } from '@state/notater';
import { useQueryClient } from '@tanstack/react-query';

interface NotatProps {
    vedtaksperiodeId: string;
}

export const Notat = ({ vedtaksperiodeId }: NotatProps): ReactElement | null => {
    const notatkladd = useNotatkladd();
    const lagretNotat = notatkladd.finnNotatForVedtaksperiode(vedtaksperiodeId, ApiNotatType.Generelt);

    const [open, setOpen] = useState(lagretNotat != undefined);

    const { leggTilNotat, loading, error, reset } = useLeggTilNotat(vedtaksperiodeId, () => setOpen(false));

    useKeyboard([
        {
            key: Key.N,
            action: () => {
                setOpen(true);
            },
            ignoreIfModifiers: false,
            modifier: Key.Alt,
        },
    ]);

    return (
        <Box borderWidth="0 0 1 0" borderColor="neutral">
            <VStack as="li" align="start" paddingBlock="space-0 space-16" gap="space-4">
                <VisHvisSkrivetilgang>
                    <Button
                        size="small"
                        variant="tertiary"
                        icon={
                            open ? (
                                <MinusCircleIcon title="lukk" fontSize="1.5rem" />
                            ) : (
                                <PlusCircleFillIcon title="åpne" fontSize="1.5rem" />
                            )
                        }
                        onClick={() => setOpen(!open)}
                    >
                        Skriv nytt notat
                    </Button>
                </VisHvisSkrivetilgang>
                {open && (
                    <VStack gap="space-8" align="start" className="mt-1">
                        <VisesIkkeIVedtakTag />
                        <NotatSkjema
                            submit={leggTilNotat}
                            submitTekst="Lagre notat"
                            vedtaksperiodeId={vedtaksperiodeId}
                            skjulNotatFelt={() => {
                                setOpen(false);
                                reset();
                            }}
                            loading={loading}
                            notattype={ApiNotatType.Generelt}
                            description="Teksten vises ikke til den sykmeldte, med mindre hen ber om innsyn."
                        />
                    </VStack>
                )}
                {open && error && (
                    <ErrorMessage>
                        {error.response?.status === 401 ? 'Du har blitt logget ut' : 'Notatet kunne ikke lagres'}
                    </ErrorMessage>
                )}
            </VStack>
        </Box>
    );
};

function useLeggTilNotat(vedtaksperiodeId: string, onSuccess: () => void) {
    const [loading, setLoading] = useState(false);
    const { personPseudoId } = useParams<{ personPseudoId: string }>();

    const { mutate: postNotat, error, reset } = usePostNotat();
    const queryClient = useQueryClient();
    const notatkladd = useNotatkladd();

    const leggTilNotat: SubmitHandler<NotatFormFields> = async ({ tekst }) => {
        setLoading(true);
        postNotat(
            {
                data: {
                    tekst: tekst,
                    vedtaksperiodeId: vedtaksperiodeId,
                },
            },
            {
                onSuccess: async () => {
                    await Promise.all([
                        queryClient.invalidateQueries({
                            queryKey: getGetNotaterForVedtaksperiodeQueryKey(vedtaksperiodeId),
                        }),
                        queryClient.invalidateQueries({
                            queryKey: getGetNotatVedtaksperiodeIderForPersonQueryKey(personPseudoId),
                        }),
                    ]);
                    notatkladd.fjernNotat(vedtaksperiodeId, ApiNotatType.Generelt);
                    onSuccess();
                    setLoading(false);
                },
                onError: () => setLoading(false),
            },
        );
    };
    return {
        leggTilNotat,
        loading,
        error,
        reset,
    };
}
