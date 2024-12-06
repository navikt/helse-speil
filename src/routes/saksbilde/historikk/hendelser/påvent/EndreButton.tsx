import React, { ReactElement, useState } from 'react';

import { Dropdown } from '@navikt/ds-react';

import { Maybe, PersonFragment, Personnavn } from '@io/graphql';
import { EndrePåVentModal } from '@saksbilde/historikk/hendelser/påvent/endre/EndrePåVentModal';
import { usePeriodeTilGodkjenning } from '@state/arbeidsgiver';
import { DateString } from '@typer/shared';

interface EndreButtonProps {
    person: PersonFragment;
    årsaker: string[];
    notattekst: Maybe<string>;
    frist: Maybe<DateString>;
}

export const EndreButton = ({ person, årsaker, notattekst, frist }: EndreButtonProps): Maybe<ReactElement> => {
    const [showModal, setShowModal] = useState(false);
    const periodeTilGodkjenning = usePeriodeTilGodkjenning(person);
    const oppgaveId = periodeTilGodkjenning?.oppgave?.id;
    const tildeling = person.tildeling;

    if (!periodeTilGodkjenning || oppgaveId === undefined) return null;

    const navn: Personnavn = {
        __typename: 'Personnavn',
        fornavn: person.personinfo.fornavn,
        mellomnavn: person.personinfo.mellomnavn,
        etternavn: person.personinfo.etternavn,
    };

    return (
        <>
            <Dropdown.Menu.List.Item onClick={() => setShowModal(true)}>Endre</Dropdown.Menu.List.Item>
            {showModal && (
                <EndrePåVentModal
                    onClose={() => setShowModal(false)}
                    navn={navn}
                    oppgaveId={oppgaveId}
                    tildeling={tildeling}
                    periodeId={periodeTilGodkjenning.id}
                    opprinneligeÅrsaker={årsaker}
                    opprinneligNotattekst={notattekst}
                    opprinneligFrist={frist}
                />
            )}
        </>
    );
};
