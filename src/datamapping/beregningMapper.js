import { item } from './mappingUtils';
import { beregningstekster } from '../tekster';
import { toKroner } from '../utils/locale';

// TODO: Legg til riktige beløp her når inntektsmelding er klart
const inntektsmelding = årsinntekt => [
    item(beregningstekster('månedsinntekt'), 'Ikke klart'),
    item(beregningstekster('årsinntekt'), 'Ikke klart')
];

const aordning = behandling => {
    const totaltIBeregningsperioden = behandling.beregningsperioden.reduce(
        (acc, periode) => acc + periode.beløp,
        0
    );
    return [
        item(
            beregningstekster('beregningsperioden'),
            `${toKroner(totaltIBeregningsperioden)} kr`
        ),
        item(
            beregningstekster('sammenligningsgrunnlag'),
            `${toKroner(behandling.sykepengegrunnlag)} kr`
        )
    ];
};

const sykepengegrunnlag = beregning => {
    return [item('Dagsats', `${toKroner(beregning.dagsats)} kr`)];
};

export default {
    inntektsmelding,
    aordning,
    sykepengegrunnlag
};
