import { item } from './mappingUtils';
import { beregningstekster } from '../tekster';
import { toKroner } from '../utils/locale';

const inntektsmelding = månedsinntekt => [
    item(
        beregningstekster('månedsinntekt'),
        `${toKroner(månedsinntekt / 12)} kr`
    ),
    item(beregningstekster('årsinntekt'), `${toKroner(månedsinntekt)} kr`)
];

const aordning = månedsinntekt => {
    return [
        item(
            beregningstekster('beregningsperioden'),
            `${toKroner((månedsinntekt / 12) * 3)} kr`
        ),
        item(
            beregningstekster('sammenligningsgrunnlag'),
            `${toKroner(månedsinntekt)} kr`
        )
    ];
};

const sykepleiegrunnlag = sykepleiegrunnlag => {
    return [item('Dagsats', `${toKroner(sykepleiegrunnlag / 260)} kr`)];
};

export default {
    inntektsmelding,
    aordning,
    sykepleiegrunnlag
};
