import React, { ReactElement, useState } from 'react';

import { MenuElipsisHorizontalIcon } from '@navikt/aksel-icons';
import { ActionMenu, Button, Loader } from '@navikt/ds-react';

import { EndrePåVentModal } from '@components/påvent/PåVentModaler';
import { BeregnetPeriodeFragment, PersonFragment, Personnavn } from '@io/graphql';
import { useFjernPåVentFraSaksbilde } from '@state/påvent';
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

    const [fjernPåVent, { loading, error: fjernPåVentError }] = useFjernPåVentFraSaksbilde(periode.behandlingId);
    const errorHandler = useOperationErrorHandler('Legg på vent');

    if (oppgaveId === undefined) return null;

    const tildeling = person.tildeling;

    const navn: Personnavn = {
        __typename: 'Personnavn',
        fornavn: person.personinfo.fornavn,
        mellomnavn: person.personinfo.mellomnavn,
        etternavn: person.personinfo.etternavn,
    };

    const fjernFraPåVent = async () => {
        await fjernPåVent(oppgaveId);
        if (fjernPåVentError) {
            errorHandler(fjernPåVentError);
        }
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
                <EndrePåVentModal
                    oppgaveId={oppgaveId!}
                    behandlingId={periode.behandlingId}
                    navn={navn}
                    utgangspunktÅrsaker={årsaker}
                    utgangspunktNotattekst={notattekst}
                    utgangspunktFrist={frist!}
                    utgangspunktTildeling={tildeling}
                    onClose={() => setShowEndreModal(false)}
                />
            )}
        </>
    );
};
