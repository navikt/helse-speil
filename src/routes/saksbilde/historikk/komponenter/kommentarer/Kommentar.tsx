import classNames from 'classnames';
import dayjs from 'dayjs';
import React from 'react';

import { ErrorMessage } from '@navikt/ds-react';

import { useMutation } from '@apollo/client';
import { FeilregistrerKommentarMutationDocument, Kommentar as GraphQLKommentar } from '@io/graphql';
import { HendelseDate } from '@saksbilde/historikk/komponenter/HendelseDate';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { ISO_TIDSPUNKTFORMAT } from '@utils/date';

import { KommentarDropdown } from './KommentarDropdown';

import styles from './Kommentarer.module.css';

interface KommentarProps {
    kommentar: GraphQLKommentar;
}

export const Kommentar = ({ kommentar }: KommentarProps) => {
    const [feilregistrerKommentar, { loading, error }] = useMutation(FeilregistrerKommentarMutationDocument);
    const innloggetSaksbehandler = useInnloggetSaksbehandler();

    const onFeilregistrerKommentar = (id: number) => () => {
        void feilregistrerKommentar({
            variables: { id: id },
            update: (cache, { data }) => {
                cache.modify({
                    id: cache.identify({ __typename: 'Kommentar', id: id }),
                    fields: {
                        feilregistrert_tidspunkt() {
                            return data?.feilregistrerKommentar?.feilregistrert_tidspunkt?.toString() ?? '';
                        },
                    },
                });
            },
        });
    };

    const erFeilregistrert = dayjs(kommentar.feilregistrert_tidspunkt, ISO_TIDSPUNKTFORMAT).isValid();

    return (
        <div key={kommentar.id} className={styles.Kommentar}>
            <HendelseDate timestamp={kommentar.opprettet} ident={kommentar.saksbehandlerident} />
            <div className={classNames(erFeilregistrert && styles.Feilregistrert)}>
                {kommentar.tekst} {erFeilregistrert && '(feilregistert)'}
            </div>
            {!kommentar.feilregistrert_tidspunkt && innloggetSaksbehandler.ident === kommentar.saksbehandlerident && (
                <KommentarDropdown feilregistrerAction={onFeilregistrerKommentar(kommentar.id)} isFetching={loading} />
            )}
            {error && <ErrorMessage>Kunne ikke feilregistrere kommentar. Prøv igjen senere.</ErrorMessage>}
        </div>
    );
};
