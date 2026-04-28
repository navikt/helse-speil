import cn from 'classnames';
import { useAtom } from 'jotai';
import React, { ReactElement, useEffect } from 'react';

import { ChevronRightIcon, PaperclipIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, Label } from '@navikt/ds-react';

import { BehandlerDialoger, Dialog, valgtDialogAtom } from '../types';

type Props = {
    behandlere: BehandlerDialoger[];
};

function formaterDatoTid(dato: Date): string {
    return (
        dato.toLocaleDateString('nb-NO', { day: '2-digit', month: '2-digit', year: '2-digit' }) +
        ' kl. ' +
        dato.toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit' })
    );
}

export function VenstremenyDialogmelding({ behandlere }: Props): ReactElement {
    const [valgtDialog, setValgtDialog] = useAtom(valgtDialogAtom);

    useEffect(() => {
        if (valgtDialog === null) {
            const førsteDialog = behandlere[0]?.dialoger[0] ?? null;
            setValgtDialog(førsteDialog);
        }
    });

    return (
        <section className="flex w-91.5 flex-col gap-8 border-r border-r-(--ax-border-neutral-subtle) px-4 py-8 [grid-area:venstremeny]">
            <Button variant="primary" size="small" className="self-start">
                Ny dialogmelding
            </Button>
            <ul className="flex flex-col gap-6">
                {behandlere.map((behandler) => (
                    <li key={behandler.behandlernavn}>
                        <Label size="small" className="px-2 text-(--ax-text-subtle)">
                            {behandler.behandlernavn}
                        </Label>
                        <ul className="flex flex-col">
                            {behandler.dialoger.map((dialog: Dialog, dialogIndex: number) => {
                                const harVedlegg = dialog.dialogmeldinger.some((m) => m.vedlegg.length > 0);
                                return (
                                    <li key={dialogIndex}>
                                        <button
                                            className={cn(
                                                'flex w-full items-center justify-between gap-2 rounded px-2 py-2 text-left hover:bg-(--ax-bg-neutral-moderate-hover)',
                                                dialog === valgtDialog && 'bg-(--ax-bg-neutral-moderate) font-semibold',
                                            )}
                                            onClick={() => setValgtDialog(dialog)}
                                        >
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-1">
                                                    <BodyShort size="small" weight="semibold">
                                                        {dialog.tittel}
                                                    </BodyShort>
                                                    {harVedlegg && (
                                                        <PaperclipIcon
                                                            aria-label="Har vedlegg"
                                                            className="shrink-0 text-(--ax-text-subtle)"
                                                            fontSize="1rem"
                                                        />
                                                    )}
                                                </div>
                                                <BodyShort size="small" className="text-(--ax-text-subtle)">
                                                    {formaterDatoTid(dialog.tid)}
                                                </BodyShort>
                                            </div>
                                            <ChevronRightIcon aria-hidden className="shrink-0" />
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </li>
                ))}
            </ul>
        </section>
    );
}
