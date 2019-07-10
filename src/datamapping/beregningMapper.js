import { item } from './mappingUtils';

const inntektsmelding = månedsinntekt => [
    item('Månedsinntekt, inntektsmelding', `${månedsinntekt / 12} kr`),
    item('Omregnet årsinntekt', `${månedsinntekt} kr`)
];

const aordning = månedsinntekt => {
    /* eslint-disable */
    console.log('Månedsinntekt ', månedsinntekt);
    /* eslint-enable */
    return [
        item('Beregningsperioden', `${(månedsinntekt / 12) * 3} kr`),
        item('Sammenligningsgrunnlag', `${månedsinntekt} kr`)
    ];
};

const sykepleiegrunnlag = sykepleiegrunnlag => {
    return [item('Dagpenger', `${sykepleiegrunnlag / 260} kr`)];
};

export default {
    inntektsmelding,
    aordning,
    sykepleiegrunnlag
};
