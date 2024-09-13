import React, { ReactElement } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { AnonymizableText } from '@components/anonymizable/AnonymizableText';
import { Clipboard } from '@components/clipboard';
import { Kjonn, PersonFragment } from '@io/graphql';
import { FullmaktTag } from '@saksbilde/personHeader/FullmaktTag';

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
    isAnonymous: boolean;
    person: PersonFragment;
}

export const PersonHeaderWithContent = ({ isAnonymous, person }: PersonHeaderWithContentProps): ReactElement => {
    const personinfo = person.personinfo;
    return (
        <div className={styles.PersonHeader}>
            <GenderIcon gender={isAnonymous ? Kjonn.Ukjent : personinfo.kjonn} />
            <NavnOgAlder personinfo={personinfo} dodsdato={person.dodsdato} />
            <BodyShort className={styles.Separator}>/</BodyShort>
            <Fødselsnummer fødselsnummer={person.fodselsnummer} />
            <BodyShort className={styles.Separator}>/</BodyShort>
            <AnonymizableText>Aktør-ID:&nbsp;</AnonymizableText>
            <Clipboard
                preserveWhitespace={false}
                copyMessage="Aktør-ID er kopiert"
                tooltip={{ content: 'Kopier aktør-ID' }}
            >
                <AnonymizableText>{person.aktorId}</AnonymizableText>
            </Clipboard>
            <BodyShort className={styles.Separator}>/</BodyShort>
            <AnonymizableText>
                Boenhet: {person.enhet.id} ({person.enhet.navn})
            </AnonymizableText>
            <div className={styles.Tags}>
                <AdressebeskyttelseTag adressebeskyttelse={personinfo.adressebeskyttelse} />
                <ReservasjonTag reservasjon={personinfo.reservasjon} />
                <VergemålTag person={person} />
                <FullmaktTag person={person} />
                <UtlandTag person={person} />
                <DødsdatoTag dødsdato={person.dodsdato} />
            </div>
        </div>
    );
};
