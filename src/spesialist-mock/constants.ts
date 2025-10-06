export const sleep = (ms: number) =>
    new Promise((resolve) => {
        setTimeout(resolve, ms);
    });

export const antallTilfeldigeOppgaver = 50;
export const antallTilfeldigeBehandledeOppgaver = 0;
