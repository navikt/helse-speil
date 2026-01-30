import React, { ReactElement, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { MinusCircleIcon, PlusCircleFillIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Button, ErrorMessage, VStack } from '@navikt/ds-react';

import { NotatFormFields, notatSkjema } from '@/form-schemas/notatSkjema';
import { useApolloClient } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Key, useKeyboard } from '@hooks/useKeyboard';
import {
    BeregnetPeriodeFragment,
    LeggTilNotatDocument,
    NotatType,
    PersonFragment,
    UberegnetPeriodeFragment,
} from '@io/graphql';
import { getNotat, usePostNotat } from '@io/rest/generated/notater/notater';
import { ApiNotat } from '@io/rest/generated/spesialist.schemas';
import { NotatSkjema } from '@saksbilde/notat/NotatSkjema';
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

    const { mutate: postNotat, error, reset } = usePostNotat();
    // Midlertidig: håndlaget loading-state fordi den skal dekke både POST og GET, fordi vi bruker har dataene i apollo
    // selv om vi bruker REST til å kommunisere med spesialist.
    const [loading, setLoading] = useState(false);
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
        setLoading(true);
        postNotat(
            {
                vedtaksperiodeId: aktivPeriode.vedtaksperiodeId,
                data: {
                    tekst: data.tekst || '',
                },
            },
            {
                onSuccess: async ({ data: { id } }) => {
                    await hentNyopprettetNotat(aktivPeriode.vedtaksperiodeId, id);
                    setLoading(false);
                },
                onError: () => setLoading(false),
            },
        );
    };

    const hentNyopprettetNotat = async (vedtaksperiodeId: string, notatId: number) => {
        const { data: notat } = await getNotat(vedtaksperiodeId, notatId);
        if (notat == undefined) return null;
        oppdaterApolloCache(notat, aktivPeriode);
        notatkladd.fjernNotat(vedtaksperiodeId, NotatType.Generelt);
        setOpen(false);
    };

    function oppdaterApolloCache(notat: ApiNotat, periode: BeregnetPeriodeFragment | UberegnetPeriodeFragment) {
        apolloClient.cache.writeQuery({
            query: LeggTilNotatDocument,
            variables: {
                oid: notat.saksbehandlerOid,
                tekst: notat.tekst,
                type: NotatType.Generelt,
                vedtaksperiodeId: periode.vedtaksperiodeId,
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
                __typename: periode?.__typename,
                behandlingId: periode?.behandlingId,
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
    }

    return (
        <Box borderWidth="0 0 1 0" borderColor="neutral">
            <VStack as="li" align="start" paddingBlock="space-0 space-16" gap="space-4">
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
                {open && (
                    <>
                        <VStack paddingBlock="space-0 space-8">
                            <BodyShort>Teksten vises ikke til den sykmeldte, med mindre hen ber om innsyn.</BodyShort>
                        </VStack>
                        <NotatSkjema
                            submit={submit}
                            submitTekst="Lagre notat"
                            vedtaksperiodeId={aktivPeriode.vedtaksperiodeId}
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
