import { item } from './mappingUtils';
import { beregningstekster } from '../tekster';

const inntektsmelding = månedsinntekt => [
    item(beregningstekster('månedsinntekt'), `${månedsinntekt / 12} kr`),
    item(beregningstekster('årsinntekt'), `${månedsinntekt} kr`)
];

const aordning = månedsinntekt => {
    return [
        item(
            beregningstekster('beregningsperioden'),
            `${(månedsinntekt / 12) * 3} kr`
        ),
        item(beregningstekster('sammenligningsgrunnlag'), `${månedsinntekt} kr`)
    ];
};

const sykepleiegrunnlag = sykepleiegrunnlag => {
    return [item('Dagsats', `${sykepleiegrunnlag / 260} kr`)];
};

export default {
    inntektsmelding,
    aordning,
    sykepleiegrunnlag
};
