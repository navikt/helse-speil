import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import dayjs from 'dayjs';
import { UtbetalingshistorikkUtbetaling } from 'internal-types';
import React from 'react';

import { AnnulleringDTO } from '../../../io/types';

import { mappetPersonObject } from '../../../../test/data/person';
import { Annulleringsmodal } from './Annulleringsmodal';

let cachedAnnullering: AnnulleringDTO;

jest.mock('../../../io/http', () => ({
    postAnnullering: (annullering: AnnulleringDTO) => {
        cachedAnnullering = annullering;
        return Promise.resolve();
    },
}));

const personTilBehandling = async () => ({
    aktørId: '12345',
    fødselsnummer: '12345678901',
    utbetalinger: [],
    arbeidsgivere: [],
    personinfo: mappetPersonObject.personinfo,
    infotrygdutbetalinger: [],
    enhet: { id: '', navn: '' },
});

const enUtbetaling: UtbetalingshistorikkUtbetaling = {
    type: 'Utbetaling',
    status: 'UTBETALT',
    arbeidsgiverOppdrag: {
        fagsystemId: 'fagsystemId',
        orgnummer: '987654321',
        utbetalingslinjer: [
            {
                fom: dayjs('2020-01-01'),
                tom: dayjs('2020-01-31'),
            },
        ],
    },
    totalbeløp: null,
};

const renderAnnulleringsmodal = async () =>
    render(
        <Annulleringsmodal
            person={await personTilBehandling()}
            utbetaling={enUtbetaling}
            onClose={() => null}
            onSuccess={() => null}
        />
    );

const annullér = () => Promise.resolve(userEvent.click(screen.getByText('Annullér')));
const captureAnnullering = () => cachedAnnullering;

describe('Annulleringsmodal', () => {
    test('sender ut annullering', async () => {
        await renderAnnulleringsmodal();
        const annullering = await annullér().then(captureAnnullering);
        expect(annullering.aktørId).toEqual('12345');
        expect(annullering.fødselsnummer).toEqual('12345678901');
        expect(annullering.organisasjonsnummer).toEqual('987654321');
        expect(annullering.fagsystemId).toEqual('fagsystemId');
    });
});
