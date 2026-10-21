import { vi } from 'vitest';

import { ApiAvslagstype, ApiUtbetalingsdagtype, ApiVedtakUtfall } from '@io/rest/generated/spesialist.schemas';
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
                        personbelop: null,
                        arbeidsgiverbelop: 1000,
                        inntekt: 1000,
                        refusjonsbelop: 1000,
                        totalGrad: 19,
                        utbetaling: 1000,
                    },
                    utbetalingsdagtype: ApiUtbetalingsdagtype.AVVIST_DAG,
                }),
            ],
            avslag: [
                {
                    type: ApiAvslagstype.DELVIS_AVSLAG,
                    begrunnelse: 'en begrunnelse',
                    opprettet: '',
                    saksbehandlerIdent: '',
                    invalidert: false,
                },
            ],
            vedtakBegrunnelser: [
                {
                    utfall: ApiVedtakUtfall.DELVIS_INNVILGELSE,
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
                        personbelop: null,
                        arbeidsgiverbelop: 1000,
                        inntekt: 1000,
                        refusjonsbelop: 1000,
                        totalGrad: 19,
                        utbetaling: 1000,
                    },
                    utbetalingsdagtype: ApiUtbetalingsdagtype.AVVIST_DAG,
                }),
            ],
            avslag: [
                {
                    type: ApiAvslagstype.DELVIS_AVSLAG,
                    begrunnelse: 'en begrunnelse',
                    opprettet: '',
                    saksbehandlerIdent: '',
                    invalidert: true,
                },
            ],
            vedtakBegrunnelser: [
                {
                    utfall: ApiVedtakUtfall.DELVIS_INNVILGELSE,
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
