const tallrekke = (start: number, end: number) => new Array(end - start).fill(start).map((n, i) => n + i);

const flyttTallrekkeTilMinimum = (tallrekke: number[], minimum: number = 1) => {
    const førsteSynligeSide = tallrekke[0];
    const padding = Math.abs(førsteSynligeSide) + 1;
    return førsteSynligeSide < minimum ? tallrekke.map((n) => n + padding) : tallrekke;
};

const flyttTallrekkeTilMaksimum = (tallrekke: number[], maksimum: number) => {
    const sisteSynligeSide = tallrekke.slice(-1)[0];
    const padding = sisteSynligeSide - maksimum;
    return sisteSynligeSide > maksimum ? tallrekke.map((n) => n - padding) : tallrekke;
};

const leggEllipseTilVedStart = (tallrekke: (number | string)[], minimum: number = 1) =>
    tallrekke[0] > 1 ? [1, '...', ...tallrekke.slice(2)] : tallrekke;

const leggEllipseTilVedSlutt = (tallrekke: (number | string)[], maksimum: number) =>
    tallrekke.slice(-1)[0] < maksimum ? [...tallrekke.slice(0, -2), '...', maksimum] : tallrekke;

export const genererSidetall = (sidenummer: number, totaltAntallSider: number, antallSynligeSider: number = 9) => {
    if (antallSynligeSider >= totaltAntallSider) {
        return tallrekke(1, totaltAntallSider + 1);
    }

    const start = sidenummer - Math.floor(antallSynligeSider / 2);
    const end = start + antallSynligeSider;
    let sidetall = tallrekke(start, end);
    sidetall = flyttTallrekkeTilMinimum(sidetall);
    sidetall = flyttTallrekkeTilMaksimum(sidetall, totaltAntallSider);
    sidetall = leggEllipseTilVedStart(sidetall);
    return leggEllipseTilVedSlutt(sidetall, totaltAntallSider);
};
