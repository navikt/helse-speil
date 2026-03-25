import { useRouter } from 'next/navigation';
import React, { ReactElement, useState } from 'react';

import { MenuElipsisHorizontalIcon } from '@navikt/aksel-icons';
import { ActionMenu, Button, Loader } from '@navikt/ds-react';

import { EndrePåVentDialog } from '@components/påvent/PåVentDialoger';
import { BeregnetPeriodeFragment, PersonFragment } from '@io/graphql';
import { useDeletePåVent } from '@io/rest/generated/oppgaver/oppgaver';
import { ApiPersonnavn } from '@io/rest/generated/spesialist.schemas';
import { useFetchPersonQuery } from '@state/person';
import { useOperationErrorHandler } from '@state/varsler';
import { DateString } from '@typer/shared';

interface LagtPåVentDropdownProps {
    person: PersonFragment;
    periode: BeregnetPeriodeFragment;
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
    const router = useRouter();

    const errorHandler = useOperationErrorHandler('Legg på vent');

    if (oppgaveId === undefined) return null;

    const tildeling = person.tildeling;

    const navn: ApiPersonnavn = {
        fornavn: person.personinfo.fornavn,
        mellomnavn: person.personinfo.mellomnavn,
        etternavn: person.personinfo.etternavn,
    };

    const fjernFraPåVent = () => {
        fjernPåVent(
            {
                oppgaveId: Number.parseInt(oppgaveId),
            },
            {
                onSuccess: () => refetch(),
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
            {showEndreModal && (
                <EndrePåVentDialog
                    oppgaveId={oppgaveId!}
                    navn={navn}
                    utgangspunktÅrsaker={årsaker}
                    utgangspunktNotattekst={notattekst}
                    utgangspunktFrist={frist!}
                    utgangspunktTildeling={tildeling}
                    onClose={() => setShowEndreModal(false)}
                    onLeggPåVentSuccess={() => router.push('/')}
                />
            )}
        </>
    );
};
