import React, { ReactElement, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';

import { MinusCircleIcon, PlusCircleFillIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, ErrorMessage, HStack, VStack } from '@navikt/ds-react';

import { NotatFormFields, notatSkjema } from '@/form-schemas/notatSkjema';
import { useMutation } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Key, useKeyboard } from '@hooks/useKeyboard';
import { LeggTilNotatDocument, NotatType, PersonFragment } from '@io/graphql';
import { Notattekstfelt } from '@saksbilde/notat/Notattekstfelt';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { useNotatkladd } from '@state/notater';
import { useActivePeriod } from '@state/periode';
import { apolloErrorCode } from '@utils/error';
import { isGhostPeriode } from '@utils/typeguards';

interface NotatProps {
    person: PersonFragment;
}

export const Notat = ({ person }: NotatProps): ReactElement | null => {
    const aktivPeriode = useActivePeriod(person);
    const erGhostEllerHarIkkeAktivPeriode = isGhostPeriode(aktivPeriode) || !aktivPeriode;

    const notatkladd = useNotatkladd();

    const lagretNotat = notatkladd.finnNotatForVedtaksperiode(
        !erGhostEllerHarIkkeAktivPeriode ? aktivPeriode.vedtaksperiodeId : undefined,
    );

    const [nyttNotat, { loading, error }] = useMutation(LeggTilNotatDocument);
    const { oid } = useInnloggetSaksbehandler();

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

    if (erGhostEllerHarIkkeAktivPeriode) return null;

    const submit: SubmitHandler<NotatFormFields> = (data) => {
        void nyttNotat({
            variables: {
                oid: oid,
                tekst: data.tekst || '',
                type: NotatType.Generelt,
                vedtaksperiodeId: aktivPeriode.vedtaksperiodeId,
            },
            update: (cache, { data }) => {
                cache.writeQuery({
                    query: LeggTilNotatDocument,
                    variables: {
                        oid: oid,
                        tekst: data?.leggTilNotat?.tekst || '',
                        type: NotatType.Generelt,
                        vedtaksperiodeId: aktivPeriode.vedtaksperiodeId,
                    },
                    data: data,
                });
                cache.modify({
                    id: cache.identify({
                        __typename: aktivPeriode?.__typename,
                        behandlingId: aktivPeriode?.behandlingId,
                    }),
                    fields: {
                        notater(existingNotater) {
                            return [
                                ...existingNotater,
                                { __ref: cache.identify({ __typename: 'Notat', id: data?.leggTilNotat?.id }) },
                            ];
                        },
                    },
                });
            },
            onCompleted: () => {
                lukkNotatfelt();
            },
        });
    };

    const lukkNotatfelt = () => {
        setOpen(false);
        notatkladd.fjernNotat(aktivPeriode.vedtaksperiodeId, NotatType.Generelt);
    };

    return (
        <VStack
            as="li"
            align="start"
            paddingBlock="0 space-16"
            style={{ borderBottom: '1px solid var(--a-border-default)' }}
        >
            <Button
                size="xsmall"
                variant="tertiary"
                icon={
                    open ? (
                        <MinusCircleIcon title="nytt-notat" fontSize="1.5rem" />
                    ) : (
                        <PlusCircleFillIcon title="nytt-notat" fontSize="1.5rem" />
                    )
                }
                onClick={() => setOpen(!open)}
            >
                Skriv nytt notat
            </Button>

            {open && (
                <>
                    <VStack paddingBlock="0 space-8">
                        <BodyShort>Teksten vises ikke til den sykmeldte, med mindre hen ber om innsyn.</BodyShort>
                    </VStack>
                    <FormProvider {...form}>
                        <form onSubmit={form.handleSubmit(submit)} style={{ width: '100%' }}>
                            <Notattekstfelt control={form.control} vedtaksperiodeId={aktivPeriode.vedtaksperiodeId} />
                            <HStack gap="space-8" align="center" marginBlock="space-16 space-0">
                                <Button size="small" variant="secondary" type="submit" loading={loading}>
                                    Lagre notat
                                </Button>
                                <Button size="small" variant="tertiary" type="button" onClick={lukkNotatfelt}>
                                    Avbryt
                                </Button>
                            </HStack>
                        </form>
                    </FormProvider>
                </>
            )}
            {error && (
                <ErrorMessage>
                    {apolloErrorCode(error) === 401 ? 'Du har blitt logget ut' : 'Notatet kunne ikke lagres'}
                </ErrorMessage>
            )}
        </VStack>
    );
};
