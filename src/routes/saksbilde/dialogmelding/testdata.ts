import { ApiBehandlerDialog } from '@io/rest/generated/sporhund.schemas';

export const testBehandlere = [
    { behandlernavn: 'Linus Lege', behandlerId: 'behandlerId-1' },
    { behandlernavn: 'Solveig Lege', behandlerId: 'behandlerId-2' },
    { behandlernavn: 'Christian Lege', behandlerId: 'behandlerId-3' },
];

export function finnDialog(behandlerDialoger: ApiBehandlerDialog[], dialogId: string) {
    for (const behandlerDialog of behandlerDialoger) {
        const dialog = behandlerDialog.dialoger.find((d) => d.id === dialogId);
        if (dialog) return dialog;
    }
    return null;
}

export function finnNyesteDialog(behandlerDialoger: ApiBehandlerDialog[]) {
    return behandlerDialoger.flatMap((b) => b.dialoger).sort((a, b) => b.tid.localeCompare(a.tid))[0] ?? null;
}
