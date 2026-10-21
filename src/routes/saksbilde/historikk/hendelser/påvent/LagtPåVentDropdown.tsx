import { useParams, useRouter } from 'next/navigation';
import React, { ReactElement, useState } from 'react';

import { MenuElipsisHorizontalIcon } from '@navikt/aksel-icons';
import { ActionMenu, Button, Loader } from '@navikt/ds-react';

import { EndrePåVentDialog } from '@components/påvent/PåVentDialoger';
import { useDeletePåVent } from '@io/rest/generated/oppgaver/oppgaver';
import { useGetPerson } from '@io/rest/generated/personer/personer';
import { ApiBeregnetPeriode, ApiPersonnavn, ApiSaksbildePerson } from '@io/rest/generated/spesialist.schemas';
import { useInvaliderOppgaver } from '@state/oppgaver';
import { useFetchPersonQuery } from '@state/person';
import { useOperationErrorHandler } from '@state/varsler';
import { DateString } from '@typer/shared';

interface LagtPåVentDropdownProps {
    person: ApiSaksbildePerson;
    periode: ApiBeregnetPeriode;
    årsaker: string[];
    notattekst: string | null;
    frist: DateString | null;
}

export const LagtPåVentDropdown = ({
    person,
    periode,
    årsaker,
    notattekst,
    frist,
}: LagtPåVentDropdownProps): ReactElement | null => {
    const [showEndreModal, setShowEndreModal] = useState(false);

    const oppgaveId = periode.oppgave?.id;

    const { mutate: fjernPåVent, isPending: loading } = useDeletePåVent();
    const { refetch } = useFetchPersonQuery();
    const invaliderOppgaver = useInvaliderOppgaver();
    const { personPseudoId } = useParams<{ personPseudoId: string }>();
    const { data: apiPerson } = useGetPerson(personPseudoId);
    const router = useRouter();

    const errorHandler = useOperationErrorHandler('Legg på vent');

    if (oppgaveId === undefined) return null;

    const tildeling = person.tildeling;

    const navn: ApiPersonnavn | undefined = apiPerson && {
        fornavn: apiPerson.fornavn,
        mellomnavn: apiPerson.mellomnavn,
        etternavn: apiPerson.etternavn,
    };

    const fjernFraPåVent = () => {
        fjernPåVent(
            {
                oppgaveId: Number.parseInt(oppgaveId),
            },
            {
                onSuccess: () => {
                    void invaliderOppgaver();
                    void refetch();
                },
                onError: (error) => errorHandler(new Error(error.message)),
            },
        );
    };

    return (
        <>
            <ActionMenu>
                <ActionMenu.Trigger>
                    <Button
                        icon={<MenuElipsisHorizontalIcon />}
                        title="Alternativer"
                        variant="tertiary"
                        size="xsmall"
                    />
                </ActionMenu.Trigger>
                <ActionMenu.Content>
                    <ActionMenu.Item onSelect={() => setShowEndreModal(true)}>Endre</ActionMenu.Item>
                    <ActionMenu.Item onSelect={fjernFraPåVent}>
                        Fjern fra på vent
                        {loading && <Loader size="xsmall" />}
                    </ActionMenu.Item>
                </ActionMenu.Content>
            </ActionMenu>
            {showEndreModal && navn && (
                <EndrePåVentDialog
                    oppgaveId={oppgaveId!}
                    navn={navn}
                    utgangspunktÅrsaker={årsaker}
                    utgangspunktNotattekst={notattekst}
                    utgangspunktFrist={frist!}
                    utgangspunktTildeling={tildeling ?? null}
                    onClose={() => setShowEndreModal(false)}
                    onLeggPåVentSuccess={() => router.push('/')}
                />
            )}
        </>
    );
};
