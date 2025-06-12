import dayjs from 'dayjs';
import { nanoid } from 'nanoid';

import { PersonFragment } from '@io/graphql';
import { getLatestUtbetalingTimestamp, getRequiredVilkårsgrunnlag } from '@state/utils';
import { enArbeidsgiver } from '@test-data/arbeidsgiver';
import { enBeregnetPeriode } from '@test-data/periode';
import { enPerson } from '@test-data/person';
import { enUtbetaling, enVurdering } from '@test-data/utbetaling';
import { etVilkårsgrunnlagFraSpleis } from '@test-data/vilkårsgrunnlag';

describe('getRequiredVilkårsgrunnlag', () => {
    it('returnerer vilkårsgrunnlaget for gitt id hvis den finnes', () => {
        const grunnlag = etVilkårsgrunnlagFraSpleis();
        const person = enPerson({ vilkarsgrunnlagV2: [grunnlag] }) as unknown as PersonFragment;

        expect(getRequiredVilkårsgrunnlag(person, grunnlag.id)).toEqual(grunnlag);
    });

    it('thrower når vilkårsgrunnlaget ikke finnes', () => {
        const person = enPerson() as unknown as PersonFragment;

        expect(() => getRequiredVilkårsgrunnlag(person, nanoid())).toThrow();
    });
});

describe('getLatestUtbetalingTimestamp', () => {
    it('returnerer det siste utbetalingstidspunktet for en person', () => {
        const siste = '2022-10-01';
        const arbeidsgiverA = enArbeidsgiver().medPerioder([
            enBeregnetPeriode().medUtbetaling(enUtbetaling({ vurdering: enVurdering({ tidsstempel: '2020-01-01' }) })),
            enBeregnetPeriode().medUtbetaling(enUtbetaling({ vurdering: enVurdering({ tidsstempel: '2018-01-01' }) })),
            enBeregnetPeriode().medUtbetaling(enUtbetaling({ vurdering: enVurdering({ tidsstempel: siste }) })),
            enBeregnetPeriode().medUtbetaling(enUtbetaling({ vurdering: enVurdering({ tidsstempel: '2000-01-01' }) })),
        ]);
        const arbeidsgiverB = enArbeidsgiver().medPerioder([
            enBeregnetPeriode().medUtbetaling(enUtbetaling({ vurdering: enVurdering({ tidsstempel: '2021-01-01' }) })),
            enBeregnetPeriode().medUtbetaling(enUtbetaling({ vurdering: enVurdering({ tidsstempel: '2003-01-01' }) })),
        ]);
        const person = enPerson().medArbeidsgivere([arbeidsgiverB, arbeidsgiverA]) as PersonFragment;

        expect(getLatestUtbetalingTimestamp(person)).toEqual(dayjs(siste));
    });

    it('returnerer 1970-01-01 dersom personen ikke har noen utbetalte utbetalinger', () => {
        const siste = dayjs('1970-01-01');
        const periodeUtenUtbetaling = enBeregnetPeriode().medUtbetaling(enUtbetaling({ vurdering: null }));
        const arbeidsgiver = enArbeidsgiver().medPerioder([periodeUtenUtbetaling]);
        const person = enPerson().medArbeidsgivere([arbeidsgiver]) as PersonFragment;

        expect(getLatestUtbetalingTimestamp(person)).toEqual(siste);
    });
});
