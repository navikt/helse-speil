import { vi } from 'vitest';

import { Avslagstype, Utbetalingsdagtype, VedtakUtfall } from '@io/graphql';
import { IndividuellBegrunnelse } from '@saksbilde/venstremeny/individuellBegrunnelse/IndividuellBegrunnelse';
import { enBeregnetPeriode, enDag } from '@test-data/periode';
import { enPerson } from '@test-data/person';
import { render, screen } from '@test-utils';

vi.mock('@hooks/brukerrolleHooks', () => ({
    useHarSkrivetilgang: () => true,
    useHarBeslutterrolle: () => true,
}));

describe('IndividuellBegrunnelse', () => {
    it('åpnes med preutfylt verdi dersom det tidligere er sendt inn avslag', () => {
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
            avslag: [
                {
                    __typename: 'Avslag',
                    type: Avslagstype.DelvisAvslag,
                    begrunnelse: 'en begrunnelse',
                    opprettet: '',
                    saksbehandlerIdent: '',
                    invalidert: false,
                },
            ],
            vedtakBegrunnelser: [
                {
                    __typename: 'VedtakBegrunnelse',
                    utfall: VedtakUtfall.DelvisInnvilgelse,
                    begrunnelse: 'en begrunnelse',
                    opprettet: '',
                    saksbehandlerIdent: '',
                },
            ],
        });

        render(
            <IndividuellBegrunnelse
                defaultÅpen={true}
                vedtakBegrunnelseTekst="en begrunnelse"
                setVedtakBegrunnelseTekst={vi.fn()}
                periode={periode}
                person={person}
            />,
        );

        expect(screen.queryByText('Individuell begrunnelse')).toBeVisible();
        expect(screen.queryByText('en begrunnelse')).toBeVisible();
    });

    it('skal ikke åpnes med preutfylt verdi dersom tidligere sendt inn avslag er invalidert', () => {
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
            avslag: [
                {
                    __typename: 'Avslag',
                    type: Avslagstype.DelvisAvslag,
                    begrunnelse: 'en begrunnelse',
                    opprettet: '',
                    saksbehandlerIdent: '',
                    invalidert: true,
                },
            ],
            vedtakBegrunnelser: [
                {
                    __typename: 'VedtakBegrunnelse',
                    utfall: VedtakUtfall.DelvisInnvilgelse,
                    begrunnelse: 'en begrunnelse',
                    opprettet: '',
                    saksbehandlerIdent: '',
                },
            ],
        });

        render(
            <IndividuellBegrunnelse
                defaultÅpen={false}
                vedtakBegrunnelseTekst=""
                setVedtakBegrunnelseTekst={vi.fn()}
                periode={periode}
                person={person}
            />,
        );

        expect(screen.queryByText('Individuell begrunnelse')).toBeVisible();
        expect(screen.queryByText('en begrunnelse')).toBeNull();
    });
});
