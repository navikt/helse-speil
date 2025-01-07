import classNames from 'classnames';
import React, { ReactElement } from 'react';

import { ChatIcon, CheckmarkCircleIcon, PaperplaneIcon, TimerPauseIcon } from '@navikt/aksel-icons';
import { BodyLong, ErrorMessage, VStack } from '@navikt/ds-react';

import { useMutation } from '@apollo/client';
import { FeilregistrerNotatMutationDocument } from '@io/graphql';
import { Expandable } from '@saksbilde/historikk/hendelser/Expandable';
import { Historikkhendelse } from '@saksbilde/historikk/hendelser/Historikkhendelse';
import { KommentarSeksjon } from '@saksbilde/historikk/komponenter/kommentarer/KommentarSeksjon';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { NotathendelseObject } from '@typer/historikk';
import { NotatType } from '@typer/notat';

import { HendelseDropdownMenu } from './HendelseDropdownMenu';

import styles from './Notathendelse.module.css';

type NotathendelseProps = Omit<NotathendelseObject, 'type'>;

export const Notathendelse = ({
    id,
    dialogRef,
    tekst,
    notattype,
    saksbehandler,
    timestamp,
    feilregistrert,
    kommentarer,
}: NotathendelseProps): ReactElement => {
    const innloggetSaksbehandler = useInnloggetSaksbehandler();

    const [feilregistrerNotat, { loading, error }] = useMutation(FeilregistrerNotatMutationDocument, {
        variables: { id: parseInt(id) },
        update: (cache, { data }) => {
            cache.modify({
                id: cache.identify({ __typename: 'Notat', id: data?.feilregistrerNotat?.id }),
                fields: {
                    feilregistrert() {
                        return true;
                    },
                    feilregistert_tidspunkt() {
                        return data?.feilregistrerNotat?.feilregistrert_tidspunkt ?? '';
                    },
                },
            });
        },
    });

    const førsteTekstlinje = tekst.split(/\r?\n/, 1)[0]!;
    const øvrigeTekstlinjer = tekst.slice(førsteTekstlinje.length).trim();
    return (
        <Historikkhendelse
            icon={<NotatIkon notattype={notattype} />}
            title={toNotatTittel(notattype) + (feilregistrert ? ' (feilregistrert)' : '')}
            kontekstknapp={
                !feilregistrert && innloggetSaksbehandler.ident === saksbehandler ? (
                    <HendelseDropdownMenu feilregistrerAction={feilregistrerNotat} isFetching={loading} />
                ) : undefined
            }
            timestamp={timestamp}
            saksbehandler={saksbehandler}
            aktiv={true}
        >
            {error && <ErrorMessage>Kunne ikke feilregistrere notat. Prøv igjen senere.</ErrorMessage>}
            <VStack gap="0">
                {førsteTekstlinje}
                {øvrigeTekstlinjer !== '' && (
                    <Expandable>
                        <BodyLong style={{ whiteSpace: 'pre-wrap' }}>{øvrigeTekstlinjer}</BodyLong>
                    </Expandable>
                )}
            </VStack>
            <KommentarSeksjon
                kommentarer={kommentarer}
                dialogRef={dialogRef}
                historikkinnslagId={Number.parseInt(id)}
            />
        </Historikkhendelse>
    );
};

const toNotatTittel = (notattype: NotatType): string => {
    switch (notattype) {
        case 'OpphevStans':
            return 'Stans opphevet';
        case 'PaaVent':
            return 'Lagt på vent';
        case 'Retur':
            return 'Returnert';
        default:
            return 'Notat';
    }
};

interface NotatIkonProps {
    notattype: NotatType;
}

const NotatIkon = ({ notattype }: NotatIkonProps): ReactElement => {
    switch (notattype) {
        case 'OpphevStans':
            return <CheckmarkCircleIcon title="Sjekkmerke ikon" className={styles.Innrammet} />;
        case 'PaaVent':
            return <TimerPauseIcon title="Timer ikon" className={classNames(styles.Innrammet, styles.LagtPaaVent)} />;
        case 'Retur':
            return <PaperplaneIcon title="Papirfly ikon" className={classNames(styles.Innrammet, styles.Retur)} />;
        case 'Generelt':
            return <ChatIcon title="Chat ikon" className={styles.Innrammet} />;
    }
};
