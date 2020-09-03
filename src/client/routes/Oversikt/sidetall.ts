const tallrekke = (start: number, end: number) => new Array(end - start).fill(start).map((n, i) => n + i);

const startFraMinimum = (sidetall: number[]) => {
    const førsteSynligeSide = sidetall[0];
    const padding = Math.abs(førsteSynligeSide) + 1;
    return førsteSynligeSide < 1 ? sidetall.map((n) => n + padding) : sidetall;
};

const sluttTilMaksimum = (sidetall: number[], antallSider: number) => {
    const sisteSynligeSide = sidetall.slice(-1)[0];
    const padding = sisteSynligeSide - antallSider;
    return sisteSynligeSide > antallSider ? sidetall.map((n) => n - padding) : sidetall;
};

const ellipsePåStart = (sidetall: (number | string)[]) =>
    sidetall[0] > 1 ? [1, '...', ...sidetall.slice(2)] : sidetall;

const ellipsePåSlutt = (sidetall: (number | string)[], antallSider: number) =>
    sidetall.slice(-1)[0] < antallSider ? [...sidetall.slice(0, -2), '...', antallSider] : sidetall;

export const genererSidetall = (sidenummer: number, totaltAntallSider: number, antallSynligeSider: number = 9) => {
    if (antallSynligeSider >= totaltAntallSider) {
        return tallrekke(1, totaltAntallSider + 1);
    }

    const start = sidenummer - Math.floor(antallSynligeSider / 2);
    const end = start + antallSynligeSider;
    let sidetall = tallrekke(start, end);
    sidetall = startFraMinimum(sidetall);
    sidetall = sluttTilMaksimum(sidetall, totaltAntallSider);
    sidetall = ellipsePåStart(sidetall);
    return ellipsePåSlutt(sidetall, totaltAntallSider);
};
