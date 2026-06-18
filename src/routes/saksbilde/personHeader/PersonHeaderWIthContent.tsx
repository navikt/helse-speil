import { useParams, useRouter } from 'next/navigation';
import React, { ReactElement } from 'react';

import { ChatIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, HStack } from '@navikt/ds-react';

import { useHarDialogmeldingrolle } from '@hooks/brukerrolleHooks';
import { Kjonn, PersonFragment } from '@io/graphql';
import { useGetSaksbehandlerStans } from '@io/rest/generated/personer/personer';
import { AktørId } from '@saksbilde/personHeader/AktørId';
import { AutomatiskBehandlingStansetTag } from '@saksbilde/personHeader/AutomatiskBehandlingStansetTag';
import { FullmaktTag } from '@saksbilde/personHeader/FullmaktTag';

import { AdressebeskyttelseTag } from './AdressebeskyttelseTag';
import { BehandlendeEnhet } from './BehandlendeEnhet';
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
    const { personPseudoId } = useParams<{ personPseudoId: string }>();
    const { data, isPending } = useGetSaksbehandlerStans(personPseudoId);
    const router = useRouter();
    const harDialogmeldingrolle = useHarDialogmeldingrolle();

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
            <BehandlendeEnhet />
            <HStack paddingInline="space-12 space-0" gap="space-12">
                <AdressebeskyttelseTag adressebeskyttelse={personinfo.adressebeskyttelse} />
                <ReservasjonTag />
                <VergemålTag person={person} />
                <FullmaktTag person={person} />
                <UtlandTag person={person} />
                <DødsdatoTag dødsdato={person.dodsdato} />
                {!isPending && data && data.erStanset && (
                    <AutomatiskBehandlingStansetTag
                        erStanset={data.erStanset}
                        dato={data.opprettetTidspunkt as string}
                    />
                )}
            </HStack>
            <HStack flexGrow="1" />
            {harDialogmeldingrolle && (
                <Button
                    variant="primary"
                    size="small"
                    icon={<ChatIcon />}
                    onClick={() => router.push(`/person/${personPseudoId}/dialogmelding`)}
                >
                    Dialogmelding
                </Button>
            )}
        </div>
    );
};
