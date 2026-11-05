import { ReactElement, useState } from 'react';

import { MenuElipsisHorizontalIcon } from '@navikt/aksel-icons';
import { ActionMenu, Button, Table, Tooltip } from '@navikt/ds-react';

import { LeggPåVentDialog } from '@components/påvent/PåVentDialoger';
import { ActionMenuItemKreverSkrivetilgang } from '@components/skrivetilgang/ActionMenuItemKreverSkrivetilgang';
import { useDeletePåVent } from '@io/rest/generated/oppgaver/oppgaver';
import { ApiEgenskap, ApiOppgaveProjeksjon, ApiPersonnavn } from '@io/rest/generated/spesialist.schemas';
import { sporHendelse } from '@observability/hendelser';
import { useInnloggetSaksbehandler } from '@state/authentication';
import { useInvaliderOppgaver } from '@state/oppgaver';
import { useAvmeld, useTildel } from '@state/tildeling';

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

    const invaliderOppgaver = useInvaliderOppgaver();
    const [tildelOppgave] = useTildel('oppgaveliste');
    const [avmeldOppgave] = useAvmeld('oppgaveliste');
    const { mutate: fjernPåVent } = useDeletePåVent();

    async function tildel() {
        await tildelOppgave(oppgave.personPseudoId);
    }

    async function avmeld() {
        await avmeldOppgave(oppgave.personPseudoId);
    }

    function fjernFraPåVent() {
        fjernPåVent(
            { oppgaveId: Number.parseInt(oppgave.id) },
            {
                onSuccess: () => {
                    sporHendelse(
                        { name: 'fjernet fra på vent', properties: { kilde: 'oppgaveliste' } },
                        oppgave.personPseudoId,
                    );
                    void invaliderOppgaver();
                },
            },
        );
    }

    return (
        <Table.DataCell onClick={(event) => event.stopPropagation()} className="w-5 pr-0">
            <span className="flex items-center">
                <ActionMenu>
                    <Tooltip content="Alternativer">
                        <ActionMenu.Trigger>
                            <Button size="xsmall" variant="secondary" className="h-5 w-5 rounded-full">
                                <MenuElipsisHorizontalIcon aria-hidden height={20} width={20} />
                            </Button>
                        </ActionMenu.Trigger>
                    </Tooltip>
                    <ActionMenu.Content>
                        {!erTildeltInnloggetBruker && !erTildelt && (
                            <ActionMenuItemKreverSkrivetilgang onSelect={tildel} disabled={!!oppgave.tildeling}>
                                Tildel meg
                            </ActionMenuItemKreverSkrivetilgang>
                        )}
                        {erPåVent ? (
                            <ActionMenuItemKreverSkrivetilgang onSelect={fjernFraPåVent}>
                                Fjern fra på vent
                            </ActionMenuItemKreverSkrivetilgang>
                        ) : (
                            <ActionMenu.Item onSelect={() => setShowModal(true)}>Legg på vent</ActionMenu.Item>
                        )}
                        <ActionMenuItemKreverSkrivetilgang onSelect={avmeld}>
                            {erTildeltInnloggetBruker ? 'Meld av' : 'Frigi oppgave'}
                        </ActionMenuItemKreverSkrivetilgang>
                    </ActionMenu.Content>
                </ActionMenu>
                {showModal && (
                    <LeggPåVentDialog
                        oppgaveId={oppgave.id}
                        navn={navn}
                        utgangspunktTildeling={oppgave?.tildeling ?? null}
                        onClose={() => setShowModal(false)}
                    />
                )}
            </span>
        </Table.DataCell>
    );
}

function erLike(a?: string | null, b?: string | null): boolean {
    return typeof a === 'string' && typeof b === 'string' && a === b;
}
