import dayjs from 'dayjs';
import React, { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';

import { PlusCircleFillIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';

import { KommentarFormFields } from '@/form-schemas/kommentarSkjema';
import { useApolloClient } from '@apollo/client';
import { VisHvisSkrivetilgang } from '@components/VisHvisSkrivetilgang';
import { KommentarFragmentDoc, PeriodehistorikkType } from '@io/graphql';
import { usePostKommentar } from '@io/rest/generated/dialoger/dialoger';
import { LeggTilNyKommentarForm } from '@saksbilde/historikk/komponenter/kommentarer/LeggTilNyKommentarForm';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { ISO_TIDSPUNKTFORMAT } from '@utils/date';

type LeggTilNyKommentarProps = {
    dialogRef: number;
    historikkinnslagId: number;
    åpneKommentarvisning: () => void;
    historikktype?: PeriodehistorikkType;
};

export const LeggTilHendelseKommentar = ({
    dialogRef,
    historikkinnslagId,
    åpneKommentarvisning,
    historikktype,
}: LeggTilNyKommentarProps) => {
    const [visLeggTilKommentar, setVisLeggTilKommentar] = useState(false);

    const { leggTilKommentar, loading, error } = useLeggTilKommentar(
        dialogRef,
        historikkinnslagId,
        () => {
            setVisLeggTilKommentar(false);
            åpneKommentarvisning();
        },
        historikktype,
    );

    const errorMessage: string | undefined =
        error == undefined
            ? undefined
            : error.status === 401
              ? 'Du har blitt logget ut'
              : 'Kommentaren kunne ikke lagres';

    return visLeggTilKommentar ? (
        <LeggTilNyKommentarForm
            loading={loading}
            onLeggTilKommentar={leggTilKommentar}
            errorMessage={errorMessage}
            closeForm={() => setVisLeggTilKommentar(false)}
        />
    ) : (
        <span>
            <VisHvisSkrivetilgang>
                <Button
                    size="xsmall"
                    variant="tertiary"
                    icon={<PlusCircleFillIcon />}
                    onClick={() => setVisLeggTilKommentar(true)}
                >
                    Legg til ny kommentar
                </Button>
            </VisHvisSkrivetilgang>
        </span>
    );
};

function useLeggTilKommentar(
    dialogRef: number,
    historikkinnslagId: number,
    onSuccess: () => void,
    historikktype?: PeriodehistorikkType,
) {
    const [isLoading, setIsLoading] = useState(false);
    const { ident: saksbehandlerident } = useInnloggetSaksbehandler();
    const { mutate, error, isPending: loading } = usePostKommentar();
    const apolloClient = useApolloClient();

    const leggTilKommentar: SubmitHandler<KommentarFormFields> = async ({ tekst }) => {
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
                    onSuccess: async ({ id }) => {
                        apolloClient.writeFragment({
                            id: `Kommentar:{"id":${id}}`,
                            fragment: KommentarFragmentDoc,
                            data: {
                                id: id,
                                tekst: tekst,
                                opprettet: dayjs().format(ISO_TIDSPUNKTFORMAT),
                                saksbehandlerident: saksbehandlerident,
                                feilregistrert_tidspunkt: null,
                                __typename: 'Kommentar',
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
                                                id: id,
                                            }),
                                        },
                                    ];
                                },
                            },
                        });
                        setIsLoading(false);
                        onSuccess();
                    },
                    onError: () => {
                        setIsLoading(false);
                    },
                },
            );
        }
    };

    return {
        leggTilKommentar,
        loading: loading || isLoading,
        error,
    };
}

type KommentertElementType =
    | 'LagtPaVent'
    | 'EndrePaVent'
    | 'TotrinnsvurderingRetur'
    | 'StansAutomatiskBehandlingSaksbehandler'
    | 'OpphevStansAutomatiskBehandlingSaksbehandler'
    | 'Notat';

const finnKommentertElementType = (historikktype?: PeriodehistorikkType): KommentertElementType => {
    switch (historikktype) {
        case PeriodehistorikkType.LeggPaVent:
            return 'LagtPaVent';
        case PeriodehistorikkType.EndrePaVent:
            return 'EndrePaVent';
        case PeriodehistorikkType.TotrinnsvurderingRetur:
            return 'TotrinnsvurderingRetur';
        case PeriodehistorikkType.StansAutomatiskBehandlingSaksbehandler:
            return 'StansAutomatiskBehandlingSaksbehandler';
        case PeriodehistorikkType.OpphevStansAutomatiskBehandlingSaksbehandler:
            return 'OpphevStansAutomatiskBehandlingSaksbehandler';
        default:
            return 'Notat';
    }
};
