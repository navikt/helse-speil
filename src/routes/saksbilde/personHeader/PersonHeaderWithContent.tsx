import { useParams, usePathname, useRouter } from 'next/navigation';
import React, { ReactElement } from 'react';

import { ChatIcon } from '@navikt/aksel-icons';
import { Button, HStack } from '@navikt/ds-react';

import { useHarDialogmeldingrolle } from '@hooks/brukerrolleHooks';
import { useGetSaksbehandlerStans } from '@io/rest/generated/personer/personer';
import { ApiPerson, ApiPersonKjønn } from '@io/rest/generated/spesialist.schemas';
import { AktørId } from '@saksbilde/personHeader/AktørId';
import { AutomatiskBehandlingStansetTag } from '@saksbilde/personHeader/AutomatiskBehandlingStansetTag';
import { FullmaktTag } from '@saksbilde/personHeader/FullmaktTag';

import { AdressebeskyttelseTag } from './AdressebeskyttelseTag';
import { BehandlendeEnhet } from './BehandlendeEnhet';
import { DødsdatoTag } from './DødsdatoTag';
import { Fødselsnummer } from './Fødselsnummer';
import { GenderIcon } from './GenderIcon';
import { NavnOgAlder } from './NavnOgAlder';
import { PersonHeaderFrame, PersonHeaderSeparator } from './PersonHeader';
import { ReservasjonTag } from './ReservasjonTag';
import { UtlandTag } from './UtlandTag';
import { VergemålTag } from './VergemålTag';

interface PersonHeaderWithContentProps {
    isAnonymous: boolean;
    person: ApiPerson;
}

export function PersonHeaderWithContent({ isAnonymous, person }: PersonHeaderWithContentProps): ReactElement {
    const { personPseudoId } = useParams<{ personPseudoId: string }>();
    const { data, isPending } = useGetSaksbehandlerStans(personPseudoId);
    const router = useRouter();
    const harDialogmeldingrolle = useHarDialogmeldingrolle();
    const path = usePathname();
    const erIDialogmeldingKontekst = path.includes('/dialogmelding');

    return (
        <PersonHeaderFrame>
            <GenderIcon gender={isAnonymous ? ApiPersonKjønn.UKJENT : person.kjønn} />
            <NavnOgAlder
                fornavn={person.fornavn}
                mellomnavn={person.mellomnavn}
                etternavn={person.etternavn}
                fødselsdato={person.fødselsdato}
                dødsdato={person.dødsdato}
            />
            <PersonHeaderSeparator />
            <Fødselsnummer fødselsnummer={person.identitetsnummer} />
            <PersonHeaderSeparator />
            <AktørId aktørId={person.aktørId} />
            <PersonHeaderSeparator />
            <BehandlendeEnhet />
            <HStack paddingInline="space-12 space-0" gap="space-12">
                <AdressebeskyttelseTag adressebeskyttelse={person.adressebeskyttelse} />
                <ReservasjonTag />
                <VergemålTag />
                <FullmaktTag fullmakt={person.fullmakt} />
                <UtlandTag />
                <DødsdatoTag dødsdato={person.dødsdato} />
                {!isPending && data && data.erStanset && (
                    <AutomatiskBehandlingStansetTag
                        erStanset={data.erStanset}
                        dato={data.opprettetTidspunkt as string}
                    />
                )}
            </HStack>
            {harDialogmeldingrolle && !erIDialogmeldingKontekst && (
                <Button
                    className="ml-auto"
                    variant="primary"
                    size="small"
                    icon={<ChatIcon />}
                    onClick={() => router.push(`/person/${personPseudoId}/dialogmelding`)}
                >
                    Dialogmelding
                </Button>
            )}
        </PersonHeaderFrame>
    );
}
