import { ApiBehandlerMedDialoger } from '@io/rest/generated/sporhund.schemas';

export const testBehandlere = [
    { behandlernavn: 'Linus Lege', behandlerId: 'behandlerId-1' },
    { behandlernavn: 'Solveig Lege', behandlerId: 'behandlerId-2' },
    { behandlernavn: 'Christian Lege', behandlerId: 'behandlerId-3' },
];

export function finnNyesteDialog(behandlerDialoger: ApiBehandlerMedDialoger[]) {
    return behandlerDialoger.flatMap((b) => b.dialoger).sort((a, b) => b.tid.localeCompare(a.tid))[0] ?? null;
}
