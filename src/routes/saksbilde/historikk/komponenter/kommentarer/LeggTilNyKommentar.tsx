import dayjs from 'dayjs';
import React, { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';

import { PlusCircleFillIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';

import { KommentarFormFields } from '@/form-schemas/kommentarSkjema';
import { useApolloClient } from '@apollo/client';
import { VisForSaksbehandler } from '@components/VisForSaksbehandler';
import { LeggTilKommentarDocument, PeriodehistorikkType } from '@io/graphql';
import { usePostKommentar } from '@io/rest/generated/dialoger/dialoger';
import { LeggTilNyKommentarForm } from '@saksbilde/historikk/komponenter/kommentarer/LeggTilNyKommentarForm';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { finnKommentertElementType } from '@state/notater';
import { ISO_TIDSPUNKTFORMAT } from '@utils/date';

type LeggTilNyKommentarProps = {
    dialogRef: number;
    historikkinnslagId: number;
    historikktype?: PeriodehistorikkType;
    åpneKommentarvisning: () => void;
};

export const LeggTilNyKommentar = ({
    dialogRef,
    historikkinnslagId,
    historikktype,
    åpneKommentarvisning,
}: LeggTilNyKommentarProps) => {
    const [visLeggTilKommentar, setVisLeggTilKommentar] = useState(false);
    // Må holde på loading i state for å holde lastetilstand imens vi oppdaterer apollo state i overgangen til REST.
    const [isLoading, setIsLoading] = useState(false);

    const innloggetSaksbehandler = useInnloggetSaksbehandler();
    const { mutate, error, isPending: loading } = usePostKommentar();
    const apolloClient = useApolloClient();

    const onLeggTilKommentar: SubmitHandler<KommentarFormFields> = async (formFields) => {
        const saksbehandlerident = innloggetSaksbehandler.ident;
        const tekst = formFields.tekst;
        if (saksbehandlerident) {
            setIsLoading(true);
            mutate(
                {
                    dialogId: dialogRef,
                    data: {
                        tekst,
                    },
                },
                {
                    onSuccess: async (data) => {
                        apolloClient.cache.writeQuery({
                            query: LeggTilKommentarDocument,
                            variables: {
                                tekst,
                                dialogRef,
                                saksbehandlerident,
                            },
                            data: {
                                __typename: 'Mutation',
                                leggTilKommentar: {
                                    __typename: 'Kommentar',
                                    id: data.data.id,
                                    tekst: tekst,
                                    opprettet: dayjs().format(ISO_TIDSPUNKTFORMAT),
                                    saksbehandlerident: saksbehandlerident,
                                    feilregistrert_tidspunkt: null,
                                },
                            },
                        });
                        apolloClient.cache.modify({
                            id: apolloClient.cache.identify({
                                __typename: finnKommentertElementType(historikktype),
                                id: historikkinnslagId,
                            }),
                            fields: {
                                kommentarer(eksisterendeKommentarer) {
                                    return [
                                        ...eksisterendeKommentarer,
                                        {
                                            __ref: apolloClient.cache.identify({
                                                __typename: 'Kommentar',
                                                id: data.data.id,
                                            }),
                                        },
                                    ];
                                },
                            },
                        });
                        setIsLoading(false);
                        setVisLeggTilKommentar(false);
                        åpneKommentarvisning();
                    },
                    onError: () => {
                        setIsLoading(false);
                    },
                },
            );
        }
    };

    const errorMessage: string | undefined =
        error == undefined
            ? undefined
            : error.status === 401
              ? 'Du har blitt logget ut'
              : 'Kommentaren kunne ikke lagres';

    return visLeggTilKommentar ? (
        <LeggTilNyKommentarForm
            loading={loading || isLoading}
            onLeggTilKommentar={onLeggTilKommentar}
            errorMessage={errorMessage}
            closeForm={() => setVisLeggTilKommentar(false)}
        />
    ) : (
        <span>
            <VisForSaksbehandler>
                <Button
                    size="xsmall"
                    variant="tertiary"
                    icon={<PlusCircleFillIcon />}
                    onClick={() => setVisLeggTilKommentar(true)}
                >
                    Legg til ny kommentar
                </Button>
            </VisForSaksbehandler>
        </span>
    );
};
