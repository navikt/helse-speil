import { mappetPerson } from 'test-data';
import { umappetArbeidsgiver } from '../../../test/data/arbeidsgiver';
import { umappetUtbetalingshistorikk } from '../../../test/data/utbetalingshistorikk';
import { umappetVedtaksperiode } from '../../../test/data/vedtaksperiode';
import { useTidslinjerader } from './useTidslinjerader';
import { umappetInfotrygdutbetalinger } from '../../../test/data/infotrygdutbetalinger';
import { umappetInntektsgrunnlag } from '../../../test/data/inntektsgrunnlag';
import { Tidslinje } from './Tidslinje';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { RecoilRoot } from 'recoil';
import { testOrganisasjonsnummer } from '../../../test/data/person';

let person = mappetPerson();
const wrapper: React.FC = ({ children }) => <RecoilRoot>{children}</RecoilRoot>;

describe('useTidslinjerader', () => {
    beforeEach(() => {
        person = mappetPerson();
    });

    test('infotrygdperioder som overlapper med spleisperioder', () => {
        person = mappetPerson(
            [
                umappetArbeidsgiver(
                    [umappetVedtaksperiode({ beregningIder: ['1234'] })],
                    [],
                    [umappetUtbetalingshistorikk('1234')]
                ),
            ],
            [],
            [umappetInntektsgrunnlag()],
            [
                umappetInfotrygdutbetalinger(),
                {
                    fom: '2018-01-01',
                    tom: '2018-01-05',
                    dagsats: 1500,
                    grad: '100',
                    typetekst: 'ArbRef',
                    organisasjonsnummer: testOrganisasjonsnummer,
                },
            ]
        );
        render(<Tidslinje person={person} />, { wrapper });
        expect(screen.getAllByText(/Potetsekk AS/)).toHaveLength(2);
    });

    test('infotrygdperioder som ikkje overlapper med spleisperioder', () => {
        person = mappetPerson(
            [
                umappetArbeidsgiver(
                    [umappetVedtaksperiode({ beregningIder: ['1234'] })],
                    [],
                    [umappetUtbetalingshistorikk('1234')]
                ),
            ],
            [],
            [umappetInntektsgrunnlag()],
            [umappetInfotrygdutbetalinger()]
        );
        render(<Tidslinje person={person} />, { wrapper });
        expect(screen.getAllByText(/Potetsekk AS/)).toHaveLength(1);
    });
});
