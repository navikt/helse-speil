import React, { ReactElement } from 'react';

import { BodyShort, HStack } from '@navikt/ds-react';

import { AnonymizableText } from '@components/anonymizable/AnonymizableText';
import { Kjonn, PersonFragment } from '@io/graphql';
import { AktørId } from '@saksbilde/personHeader/AktørId';
import { AutomatiskBehandlingStansetTag } from '@saksbilde/personHeader/AutomatiskBehandlingStansetTag';
import { FullmaktTag } from '@saksbilde/personHeader/FullmaktTag';
import { enhetsnavn } from '@saksbilde/personHeader/enheter';

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
            <AktørId aktørId={person.aktorId} />
            <BodyShort className={styles.Separator}>/</BodyShort>
            <AnonymizableText>
                Boenhet: {person.enhet.id} ({enhetsnavn.get(Number(person.enhet.id))})
            </AnonymizableText>
            <HStack paddingInline="space-12 space-0" gap="space-12">
                <AdressebeskyttelseTag adressebeskyttelse={personinfo.adressebeskyttelse} />
                <ReservasjonTag />
                <VergemålTag person={person} />
                <FullmaktTag person={person} />
                <UtlandTag person={person} />
                <DødsdatoTag dødsdato={person.dodsdato} />
                <AutomatiskBehandlingStansetTag
                    erStanset={person.personinfo.automatiskBehandlingStansetAvSaksbehandler ?? false}
                />
            </HStack>
        </div>
    );
};
