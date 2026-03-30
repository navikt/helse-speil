import React, { ReactElement, useState } from 'react';

import { MenuElipsisHorizontalIcon } from '@navikt/aksel-icons';
import { ActionMenu, Button, Table } from '@navikt/ds-react';

import { VisHvisSkrivetilgang } from '@components/VisHvisSkrivetilgang';
import { LeggPåVentDialog } from '@components/påvent/PåVentDialoger';
import {
    getGetAntallOppgaverQueryKey,
    getGetOppgaverQueryKey,
    useDeletePåVent,
} from '@io/rest/generated/oppgaver/oppgaver';
import { ApiEgenskap, ApiOppgaveProjeksjon, ApiPersonnavn } from '@io/rest/generated/spesialist.schemas';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { useAvmeld, useTildel } from '@state/tildeling';
import { useQueryClient } from '@tanstack/react-query';

interface OptionsButtonProps {
    oppgave: ApiOppgaveProjeksjon;
    navn: ApiPersonnavn;
}

export function OptionsCell({ oppgave, navn }: OptionsButtonProps): ReactElement {
    const [showModal, setShowModal] = useState(false);
    const innloggetSaksbehandler = useInnloggetSaksbehandler();
    const erTildeltInnloggetBruker = erLike(oppgave.tildeling?.oid, innloggetSaksbehandler.oid);
    const erTildelt = !!oppgave.tildeling?.oid;
    const erPåVent = oppgave.egenskaper.includes(ApiEgenskap.PA_VENT);

    const queryClient = useQueryClient();
    const [tildelOppgave] = useTildel();
    const [avmeldOppgave] = useAvmeld();
    const { mutate: fjernPåVent } = useDeletePåVent();

    async function invalidateOppgaver() {
        await Promise.all([
            queryClient.invalidateQueries({ queryKey: getGetOppgaverQueryKey() }),
            queryClient.invalidateQueries({ queryKey: getGetAntallOppgaverQueryKey() }),
        ]);
    }

    async function tildel() {
        await tildelOppgave(oppgave.personPseudoId, invalidateOppgaver);
    }

    async function avmeld() {
        await avmeldOppgave(oppgave.personPseudoId, invalidateOppgaver);
    }

    function fjernFraPåVent() {
        fjernPåVent({ oppgaveId: Number.parseInt(oppgave.id) }, { onSuccess: invalidateOppgaver });
    }

    return (
        <Table.DataCell onClick={(event) => event.stopPropagation()} className="w-5 pr-0">
            <span className="flex items-center">
                <VisHvisSkrivetilgang>
                    <ActionMenu>
                        <ActionMenu.Trigger>
                            <Button size="xsmall" variant="secondary" title="Mer" className="h-5 w-5 rounded-full">
                                <MenuElipsisHorizontalIcon title="Alternativer" height={20} width={20} />
                            </Button>
                        </ActionMenu.Trigger>
                        <ActionMenu.Content>
                            {!erTildeltInnloggetBruker && !erTildelt && (
                                <ActionMenu.Item onSelect={tildel} disabled={!!oppgave.tildeling}>
                                    Tildel meg
                                </ActionMenu.Item>
                            )}
                            {erPåVent ? (
                                <ActionMenu.Item onSelect={fjernFraPåVent}>Fjern fra på vent</ActionMenu.Item>
                            ) : (
                                <ActionMenu.Item onSelect={() => setShowModal(true)}>Legg på vent</ActionMenu.Item>
                            )}
                            <ActionMenu.Item onSelect={avmeld}>
                                {erTildeltInnloggetBruker ? 'Meld av' : 'Frigi oppgave'}
                            </ActionMenu.Item>
                        </ActionMenu.Content>
                    </ActionMenu>
                </VisHvisSkrivetilgang>
                {showModal && (
                    <LeggPåVentDialog
                        oppgaveId={oppgave.id}
                        navn={navn}
                        utgangspunktTildeling={oppgave?.tildeling ?? null}
                        onClose={() => setShowModal(false)}
                        onLeggPåVentSuccess={invalidateOppgaver}
                    />
                )}
            </span>
        </Table.DataCell>
    );
}

function erLike(a?: string | null, b?: string | null): boolean {
    return typeof a === 'string' && typeof b === 'string' && a === b;
}
