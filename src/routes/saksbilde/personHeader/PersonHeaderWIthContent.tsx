import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { AnonymizableText } from '@components/anonymizable/AnonymizableText';
import { Clipboard } from '@components/clipboard';
import { Enhet, Kjonn, Maybe, Personinfo } from '@io/graphql';

import { AdressebeskyttelseTag } from './AdressebeskyttelseTag';
import { DødsdatoTag } from './DødsdatoTag';
import { Fødselsnummer } from './Fødselsnummer';
import { GenderIcon } from './GenderIcon';
import { NavnOgAlder } from './NavnOgAlder';
import { ReservasjonTag } from './ReservasjonTag';
import { UtlandTag } from './UtlandTag';
import { VergemålTag } from './VergemålTag';

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
            <div className={styles.Tags}>
                <AdressebeskyttelseTag adressebeskyttelse={personinfo.adressebeskyttelse} />
                <ReservasjonTag reservasjon={personinfo.reservasjon} />
                <VergemålTag />
                <UtlandTag />
                <DødsdatoTag dødsdato={dødsdato} />
            </div>
        </div>
    );
};
