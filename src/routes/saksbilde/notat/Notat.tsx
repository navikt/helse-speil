import React, { ReactElement, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { MinusCircleIcon, PlusCircleFillIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Button, ErrorMessage, VStack } from '@navikt/ds-react';

import { NotatFormFields, notatSkjema } from '@/form-schemas/notatSkjema';
import { useApolloClient } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Key, useKeyboard } from '@hooks/useKeyboard';
import { LeggTilNotatDocument, NotatType, PersonFragment } from '@io/graphql';
import { NotatSkjema } from '@saksbilde/notat/NotatSkjema';
import { getNotat, usePostNotat } from '@io/rest/generated/notater/notater';
import { useNotatkladd } from '@state/notater';
import { useActivePeriod } from '@state/periode';
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
        NotatType.Generelt,
    );

    const { mutate: postNotat, isPending: loading, error } = usePostNotat();
    const apolloClient = useApolloClient();

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
        void postNotat(
            {
                vedtaksperiodeId: aktivPeriode.vedtaksperiodeId,
                data: {
                    tekst: data.tekst || '',
                },
            },
            {
                onSuccess: async ({ data: { id } }) => {
                    lukkNotatfelt();
                    return hentNyopprettetNotat(aktivPeriode.vedtaksperiodeId, id);
                },
            },
        );
    };

    const hentNyopprettetNotat = async (vedtaksperiodeId: string, notatId: number) => {
        const { data: notat } = await getNotat(vedtaksperiodeId, notatId);
        if (notat == undefined) return null;

        apolloClient.cache.writeQuery({
            query: LeggTilNotatDocument,
            variables: {
                oid: notat.saksbehandlerOid,
                tekst: notat.tekst,
                type: NotatType.Generelt,
                vedtaksperiodeId: aktivPeriode.vedtaksperiodeId,
            },
            data: {
                __typename: 'Mutation',
                leggTilNotat: {
                    __typename: 'Notat',
                    id: notat.id,
                    tekst: notat.tekst,
                    opprettet: notat.opprettet,
                    saksbehandlerOid: notat.saksbehandlerOid,
                    saksbehandlerNavn: notat.saksbehandlerNavn,
                    saksbehandlerEpost: notat.saksbehandlerEpost,
                    saksbehandlerIdent: notat.saksbehandlerIdent,
                    vedtaksperiodeId: notat.vedtaksperiodeId,
                    feilregistrert: notat.feilregistrert,
                    feilregistrert_tidspunkt: notat.feilregistrert_tidspunkt ?? '',
                    type: NotatType.Generelt,
                    kommentarer: [],
                },
            },
        });
        apolloClient.cache.modify({
            id: apolloClient.cache.identify({
                __typename: aktivPeriode?.__typename,
                behandlingId: aktivPeriode?.behandlingId,
            }),
            fields: {
                notater(existingNotater) {
                    return [
                        ...existingNotater,
                        { __ref: apolloClient.cache.identify({ __typename: 'Notat', id: notat.id }) },
                    ];
                },
            },
        });
    };

    const lukkNotatfelt = () => {
        setOpen(false);
        notatkladd.fjernNotat(aktivPeriode.vedtaksperiodeId, NotatType.Generelt);
    };

    return (
        <Box borderWidth="0 0 1 0" borderColor="neutral">
            <VStack as="li" align="start" paddingBlock="space-0 space-16" gap="space-4">
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
                        <VStack paddingBlock="space-0 space-8">
                            <BodyShort>Teksten vises ikke til den sykmeldte, med mindre hen ber om innsyn.</BodyShort>
                        </VStack>
                        <NotatSkjema
                            submit={submit}
                            submitTekst="Lagre notat"
                            vedtaksperiodeId={aktivPeriode.vedtaksperiodeId}
                            skjulNotatFelt={() => setOpen(false)}
                            loading={loading}
                        />
                    </>
                )}
                {error && (
                    <ErrorMessage>
                        {error.response?.status === 401 ? 'Du har blitt logget ut' : 'Notatet kunne ikke lagres'}
                    </ErrorMessage>
                )}
            </VStack>
        </Box>
    );
};
