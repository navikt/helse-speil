import { DødsdatoTag } from './DødsdatoTag';
import { Fødselsnummer } from './Fødselsnummer';
import React from 'react';
import { Link } from 'react-router-dom';

import { BodyShort } from '@navikt/ds-react';

import { AnonymizableText } from '@components/anonymizable/AnonymizableText';
import { Clipboard } from '@components/clipboard';
import { Enhet, Kjonn, Maybe, Personinfo } from '@io/graphql';
import { utbetalingsoversikt } from '@utils/featureToggles';

import { AdressebeskyttelseTag } from './AdressebeskyttelseTag';
import { GenderIcon } from './GenderIcon';
import { NavnOgAlder } from './NavnOgAlder';
import { ReservasjonTag } from './ReservasjonTag';

import styles from './PersonHeader.module.css';

interface PersonHeaderWithContentProps {
    fødselsnummer: string;
    aktørId: string;
    enhet: Enhet;
    personinfo: Personinfo;
    isAnonymous: boolean;
    dødsdato?: Maybe<DateString>;
}

export const PersonHeaderWithContent: React.FC<PersonHeaderWithContentProps> = ({
    fødselsnummer,
    aktørId,
    enhet,
    personinfo,
    isAnonymous,
    dødsdato,
}) => {
    return (
        <div className={styles.PersonHeader}>
            <GenderIcon gender={isAnonymous ? Kjonn.Ukjent : personinfo.kjonn} />
            <NavnOgAlder personinfo={personinfo} />
            <BodyShort className={styles.Separator}>/</BodyShort>
            <Fødselsnummer fødselsnummer={fødselsnummer} />
            <BodyShort className={styles.Separator}>/</BodyShort>
            <AnonymizableText>Aktør-ID:&nbsp;</AnonymizableText>
            <Clipboard
                preserveWhitespace={false}
                copyMessage="Aktør-ID er kopiert"
                tooltip={{ content: 'Kopier aktør-ID' }}
            >
                <AnonymizableText>{aktørId}</AnonymizableText>
            </Clipboard>
            <BodyShort className={styles.Separator}>/</BodyShort>
            <AnonymizableText>
                Boenhet: {enhet.id} ({enhet.navn})
            </AnonymizableText>
            {utbetalingsoversikt && (
                <>
                    <BodyShort className={styles.Separator}>/</BodyShort>
                    <Link className={styles.Link} to={`${aktørId}/../utbetalingshistorikk`}>
                        Utbetalingsoversikt
                    </Link>
                </>
            )}
            <div className={styles.Tags}>
                <AdressebeskyttelseTag adressebeskyttelse={personinfo.adressebeskyttelse} />
                <ReservasjonTag reservasjon={personinfo.reservasjon} />
                <DødsdatoTag dødsdato={dødsdato} />
            </div>
        </div>
    );
};
