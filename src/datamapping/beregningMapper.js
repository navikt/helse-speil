import { item } from './mappingUtils';
import { beregningstekster, tekster } from '../tekster';
import { toKroner } from '../utils/locale';

// TODO: Legg til riktige beløp her når inntektsmelding er klart
const inntektsmelding = årsinntekt => [
    item(beregningstekster('månedsinntekt'), tekster('informasjon ikke tilgjengelig')),
    item(beregningstekster('årsinntekt'), tekster('informasjon ikke tilgjengelig'))
];

const aordning = behandling => {
    return [
        item(
            beregningstekster('beregningsperioden'),
            `${toKroner(behandling.totaltIBeregningsperioden)} kr`
        ),
        item(
            beregningstekster('sammenligningsgrunnlag'),
            `${toKroner(behandling.sammenligningsgrunnlag)} kr`
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
