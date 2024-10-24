import { Utbetalingsdagtype } from '@io/graphql';
import { IndividuellBegrunnelse } from '@saksbilde/venstremeny/individuellBegrunnelse/IndividuellBegrunnelse';
import { enBeregnetPeriode, enDag } from '@test-data/periode';
import { enPerson } from '@test-data/person';
import { render, screen } from '@test-utils';

describe('IndividuellBegrunnelse', () => {
    it('åpnes med preutfylt verdi dersom minimum sykdomsgrad overstyring foreligger', () => {
        const person = enPerson();
        const periode = enBeregnetPeriode({
            tidslinje: [
                enDag({
                    utbetalingsinfo: {
                        __typename: 'Utbetalingsinfo',
                        personbelop: null,
                        arbeidsgiverbelop: 1000,
                        inntekt: 1000,
                        refusjonsbelop: 1000,
                        totalGrad: 19,
                        utbetaling: 1000,
                    },
                    utbetalingsdagtype: Utbetalingsdagtype.AvvistDag,
                }),
            ],
        });
        const overstyrtMinimumSykdomsgradBegrunnelse = 'en begrunnelse';

        render(
            <IndividuellBegrunnelse
                visIndividuellBegrunnelse={true}
                setVisIndividuellBegrunnelse={jest.fn()}
                avslag={null}
                setAvslag={jest.fn()}
                periode={periode}
                person={person}
                overstyrtMinimumSykdomsgradBegrunnelse={overstyrtMinimumSykdomsgradBegrunnelse}
            />,
        );

        expect(screen.queryByText('Skriv begrunnelse for avslag')).toBeVisible();
        expect(screen.queryByText(overstyrtMinimumSykdomsgradBegrunnelse)).toBeVisible();
    });
});
