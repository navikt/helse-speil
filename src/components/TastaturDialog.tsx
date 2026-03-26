import { useTheme } from 'next-themes';
import React, { ReactElement } from 'react';

import { Dialog, Heading, Table, Theme } from '@navikt/ds-react';
import { TableBody, TableDataCell, TableRow } from '@navikt/ds-react/Table';

import { Action, Key, useKeyboard } from '@hooks/useKeyboard';
import { useKeyboardActions } from '@hooks/useKeyboardShortcuts';

interface TastaturDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function TastaturDialog({ open, onOpenChange }: TastaturDialogProps): ReactElement {
    const { resolvedTheme } = useTheme();

    useKeyboard([
        {
            key: Key.F1,
            action: () => onOpenChange(!open),
            ignoreIfModifiers: false,
        },
    ]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange} aria-label="Tastatursnarveier modal">
            {/* resolvedTheme er undefined på serveren, så vi rendrer Theme kun når open er true for å unngå hydreringsfeil */}
            {open && (
                <Theme theme={resolvedTheme as 'light' | 'dark'}>
                    <TastaturDialogInnhold />
                </Theme>
            )}
        </Dialog>
    );
}

function TastaturDialogInnhold(): ReactElement {
    const tastatursnarveier: Action[] = useKeyboardActions();
    const [utviklerOnlySnarveier, snarveier] = tastatursnarveier.reduce<[Action[], Action[]]>(
        ([a, b], snarvei) => (snarvei.utviklerOnly ? [[...a, snarvei], b] : [a, [...b, snarvei]]),
        [[], []],
    );

    return (
        <Dialog.Popup>
            <Dialog.Header>
                <Dialog.Title>Tastatursnarveier</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
                <Table size="small" zebraStripes>
                    <TableBody>
                        {snarveier
                            .filter((snarvei) => snarvei?.visningssnarvei !== undefined)
                            .map((snarvei, i) => (
                                <TableRow key={i}>
                                    <TableDataCell className="w-full">{snarvei.visningstekst}</TableDataCell>
                                    <TableDataCell className="text-right">
                                        <Shortcut visningssnarvei={snarvei.visningssnarvei!} />
                                    </TableDataCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
                {utviklerOnlySnarveier.length > 0 && (
                    <>
                        <Heading level="2" size="xsmall" className="my-4">
                            Utviklersnacks
                        </Heading>
                        <Table size="small" zebraStripes>
                            <TableBody>
                                {utviklerOnlySnarveier
                                    .filter((snarvei) => snarvei?.visningssnarvei !== undefined)
                                    .map((snarvei, i) => (
                                        <TableRow key={i}>
                                            <TableDataCell className="w-full">{snarvei.visningstekst}</TableDataCell>
                                            <TableDataCell className="text-right">
                                                <Shortcut visningssnarvei={snarvei.visningssnarvei!} />
                                            </TableDataCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </>
                )}
            </Dialog.Body>
        </Dialog.Popup>
    );
}

function Shortcut({ visningssnarvei }: { visningssnarvei: string[] }): ReactElement {
    return (
        <div className="aksel-action-menu__marker aksel-action-menu__marker--right inline-flex">
            {visningssnarvei.map((tast, index) => (
                <span key={index} className="aksel-action-menu__shortcut">
                    {tast}
                </span>
            ))}
        </div>
    );
}
