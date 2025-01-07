import React, { useState } from 'react';

import { MenuElipsisHorizontalIcon } from '@navikt/aksel-icons';
import { ActionMenu, Button, Loader } from '@navikt/ds-react';

import { Maybe, PersonFragment, Personnavn } from '@io/graphql';
import { PåVentNotatModal } from '@oversikt/table/cells/notat/PåVentNotatModal';
import { EndrePåVentModal } from '@saksbilde/historikk/hendelser/påvent/endre/EndrePåVentModal';
import { usePeriodeTilGodkjenning } from '@state/arbeidsgiver';
import { useFjernPåVentFraSaksbilde } from '@state/påvent';
import { useOperationErrorHandler } from '@state/varsler';
import { DateString } from '@typer/shared';

interface LagtPåVentDropdownProps {
    person: PersonFragment;
    årsaker: string[];
    notattekst: Maybe<string>;
    frist: Maybe<DateString>;
}

export const LagtPåVentDropdown = ({ person, årsaker, notattekst, frist }: LagtPåVentDropdownProps) => {
    const [showEndreModal, setShowEndreModal] = useState(false);
    const [showLeggPåVentModal, setShowLeggPåVentModal] = useState(false);

    const periodeTilGodkjenning = usePeriodeTilGodkjenning(person);
    const oppgaveId = periodeTilGodkjenning?.oppgave?.id;

    const [fjernPåVent, { loading, error: fjernPåVentError }] = useFjernPåVentFraSaksbilde(
        periodeTilGodkjenning?.behandlingId,
    );
    const errorHandler = useOperationErrorHandler('Legg på vent');

    if (!periodeTilGodkjenning || oppgaveId === undefined) return null;

    const tildeling = person.tildeling;
    const erPåVent = periodeTilGodkjenning?.paVent;

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
                    {erPåVent ? (
                        <ActionMenu.Item onSelect={fjernFraPåVent}>
                            Fjern fra på vent
                            {loading && <Loader size="xsmall" />}
                        </ActionMenu.Item>
                    ) : (
                        <ActionMenu.Item onSelect={() => setShowLeggPåVentModal(true)}>Legg på vent</ActionMenu.Item>
                    )}
                </ActionMenu.Content>
            </ActionMenu>
            {showEndreModal && (
                <EndrePåVentModal
                    onClose={() => setShowEndreModal(false)}
                    navn={navn}
                    oppgaveId={oppgaveId!}
                    tildeling={tildeling}
                    periodeId={periodeTilGodkjenning!.id}
                    opprinneligeÅrsaker={årsaker}
                    opprinneligNotattekst={notattekst}
                    opprinneligFrist={frist}
                />
            )}
            {showLeggPåVentModal && (
                <PåVentNotatModal
                    onClose={() => setShowLeggPåVentModal(false)}
                    showModal={showLeggPåVentModal}
                    navn={navn}
                    oppgaveId={oppgaveId}
                    tildeling={tildeling}
                    periodeId={periodeTilGodkjenning.id}
                />
            )}
        </>
    );
};
