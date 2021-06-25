import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { Vedtaksperiode } from 'internal-types';
import React from 'react';
import { RecoilRoot } from 'recoil';

import { AnnulleringDTO } from '../../../../io/types';
import { authState } from '../../../../state/authentication';
import { personState } from '../../../../state/person';

import { mappetPerson } from '../../../../../test/data/person';
import { Annulleringsmodal } from './Annulleringsmodal';

dayjs.extend(isSameOrAfter);

let cachedAnnullering: AnnulleringDTO;

jest.mock('../../../../io/http', () => ({
    postAnnullering: (annullering: AnnulleringDTO) => {
        cachedAnnullering = annullering;
        return Promise.resolve();
    },
}));

const authInfo = {
    name: 'Sara Saksbehandler',
    ident: 'S123456',
    email: 'sara.saksbehandler@nav.no',
    isLoggedIn: true,
};

const renderAnnulleringsmodal = async () => {
    const person = mappetPerson();
    const arbeidsgiver = person.arbeidsgivere[0];
    const aktivPeriode = arbeidsgiver.tidslinjeperioder[0][0];
    const vedtaksperiode = arbeidsgiver.vedtaksperioder.find(
        (vedtaksperiode) => vedtaksperiode.id === aktivPeriode.id
    ) as Vedtaksperiode;
    const arbeidsgiverUtbetaling = vedtaksperiode.utbetalinger?.arbeidsgiverUtbetaling;

    return render(
        <RecoilRoot
            initializeState={({ set }) => {
                set(personState, { person: person });
                set(authState, authInfo);
            }}
        >
            {arbeidsgiverUtbetaling && (
                <Annulleringsmodal
                    person={person}
                    organisasjonsnummer={aktivPeriode.organisasjonsnummer}
                    fagsystemId={aktivPeriode.fagsystemId!}
                    linjer={arbeidsgiverUtbetaling?.linjer}
                    onClose={() => null}
                />
            )}
        </RecoilRoot>
    );
};

const annuller = () => Promise.resolve(userEvent.click(screen.getByText('Annuller')));

const velgFørsteBegrunnelse = () =>
    Promise.resolve(userEvent.click(screen.getByText('Feil ble gjort i opprinnelig automatisk vedtak')));

const velgBegrunnelseAnnet = () => Promise.resolve(userEvent.click(screen.getByText('Annet')));

const captureAnnullering = () => cachedAnnullering;

const assertFeilmeldingBegrunnelse = () =>
    waitFor(() => expect(screen.queryByText('Velg minst én begrunnelse')).not.toBeNull());

const assertFeilmeldingKommentar = () =>
    waitFor(() => expect(screen.queryByText('Skriv en kommentar hvis du velger begrunnelsen annet')).not.toBeNull());

describe('Annulleringsmodal', () => {
    test('viser feilmelding ved manglende begrunnelse', async () => {
        await renderAnnulleringsmodal();
        await annuller().then(assertFeilmeldingBegrunnelse);
    });
    test('viser feilmelding ved manglende kommentar', async () => {
        await renderAnnulleringsmodal();
        await velgBegrunnelseAnnet().then(annuller).then(assertFeilmeldingKommentar);
    });
    test('bygger AnnulleringDTO ved post av annullering', async () => {
        await renderAnnulleringsmodal();
        const annullering = await velgFørsteBegrunnelse().then(annuller).then(captureAnnullering);
        expect(annullering.aktørId).toEqual('1211109876233');
        expect(annullering.fødselsnummer).toEqual('01019000123');
        expect(annullering.organisasjonsnummer).toEqual('987654321');
        expect(annullering.fagsystemId).toEqual('EN_FAGSYSTEMID');
    });
});
