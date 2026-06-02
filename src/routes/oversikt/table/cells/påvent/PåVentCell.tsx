import React, { ReactElement, useState } from 'react';

import { HourglassBottomFilledIcon, HourglassTopFilledIcon } from '@navikt/aksel-icons';
import { Button, HStack, Table, Tooltip } from '@navikt/ds-react';

import { ApiOppgaveProjeksjonPaaVentInfo, ApiPersonnavn } from '@io/rest/generated/spesialist.schemas';
import { SisteNotattekst } from '@oversikt/table/oppgaverTable/SisteNotattekst';
import { PåVentInfo } from '@oversikt/table/oppgaverTable/util';

import { PåVentListeDialog } from './PåVentListeDialog';

interface PåVentCellProps {
    navn: ApiPersonnavn;
    påVentInfo: ApiOppgaveProjeksjonPaaVentInfo | undefined | null;
}

export const PåVentCell = ({ navn, påVentInfo }: PåVentCellProps): ReactElement => {
    return (
        <Table.DataCell onClick={(event) => event.stopPropagation()} className="w-3xs">
            {påVentInfo != null && (
                <HStack gap="space-8" wrap={false} className="items-center">
                    <PåVentKnapp navn={navn} påVentInfo={påVentInfo} />
                    <SisteNotattekst påVentInfo={påVentInfo} />
                </HStack>
            )}
        </Table.DataCell>
    );
};

interface PåVentKnappProps {
    navn: ApiPersonnavn;
    påVentInfo: ApiOppgaveProjeksjonPaaVentInfo;
}

const PåVentKnapp = ({ navn, påVentInfo }: PåVentKnappProps): ReactElement | null => {
    const [showModal, setShowModal] = useState(false);
    const utgåttFrist = PåVentInfo.erTidsfristUtgått(påVentInfo);

    const toggleModal = (event: React.SyntheticEvent) => {
        event.stopPropagation();
        if (event.type === 'keyup' && !['Space', 'Enter'].includes((event as React.KeyboardEvent).key)) return;
        setShowModal((prevState) => !prevState);
    };

    return (
        <>
            <Tooltip content="Lagt på vent">
                <Button
                    variant="tertiary-neutral"
                    size="xsmall"
                    onClick={toggleModal}
                    onKeyUp={toggleModal}
                    icon={
                        utgåttFrist ? (
                            <HourglassBottomFilledIcon
                                fontSize="1.5rem"
                                className="text-ax-text-danger-subtle"
                                aria-hidden
                            />
                        ) : (
                            <HourglassTopFilledIcon fontSize="1.5rem" aria-hidden />
                        )
                    }
                />
            </Tooltip>
            <PåVentListeDialog open={showModal} onOpenChange={setShowModal} påVentInfo={påVentInfo} navn={navn} />
        </>
    );
};
