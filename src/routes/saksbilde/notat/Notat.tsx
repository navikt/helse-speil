import React, { ReactElement, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { MinusCircleIcon, PlusCircleFillIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Button, ErrorMessage, VStack } from '@navikt/ds-react';

import { NotatFormFields, notatSkjema } from '@/form-schemas/notatSkjema';
import { VisHvisSkrivetilgang } from '@components/VisHvisSkrivetilgang';
import { zodResolver } from '@hookform/resolvers/zod';
import { Key, useKeyboard } from '@hooks/useKeyboard';
import { NotatType } from '@io/graphql';
import { getGetNotaterForVedtaksperiodeQueryKey, usePostNotat } from '@io/rest/generated/notater/notater';
import { NotatSkjema } from '@saksbilde/notat/NotatSkjema';
import { useNotatkladd } from '@state/notater';
import { useQueryClient } from '@tanstack/react-query';

interface NotatProps {
    vedtaksperiodeId: string;
}

export const Notat = ({ vedtaksperiodeId }: NotatProps): ReactElement | null => {
    const notatkladd = useNotatkladd();

    const lagretNotat = notatkladd.finnNotatForVedtaksperiode(vedtaksperiodeId, NotatType.Generelt);

    const { mutate: postNotat, error, reset } = usePostNotat();
    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();

    const form = useForm<NotatFormFields>({
        resolver: zodResolver(notatSkjema),
        reValidateMode: 'onBlur',
        defaultValues: {
            tekst: lagretNotat,
        },
    });

    const [open, setOpen] = useState(lagretNotat != undefined);

    useKeyboard([
        {
            key: Key.N,
            action: () => {
                setOpen(true);
                form.setFocus('tekst');
            },
            ignoreIfModifiers: false,
            modifier: Key.Alt,
        },
    ]);

    const submit: SubmitHandler<NotatFormFields> = (data) => {
        setLoading(true);
        postNotat(
            {
                data: {
                    tekst: data.tekst || '',
                    vedtaksperiodeId: vedtaksperiodeId,
                },
            },
            {
                onSuccess: async () => {
                    await queryClient.invalidateQueries({
                        queryKey: getGetNotaterForVedtaksperiodeQueryKey(vedtaksperiodeId),
                    });
                    notatkladd.fjernNotat(vedtaksperiodeId, NotatType.Generelt);
                    setOpen(false);
                    setLoading(false);
                },
                onError: () => setLoading(false),
            },
        );
    };

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
                    <>
                        <VStack paddingBlock="space-0 space-8">
                            <BodyShort>Teksten vises ikke til den sykmeldte, med mindre hen ber om innsyn.</BodyShort>
                        </VStack>
                        <NotatSkjema
                            submit={submit}
                            submitTekst="Lagre notat"
                            vedtaksperiodeId={vedtaksperiodeId}
                            skjulNotatFelt={() => {
                                setOpen(false);
                                reset();
                            }}
                            loading={loading}
                            notattype={NotatType.Generelt}
                        />
                    </>
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
