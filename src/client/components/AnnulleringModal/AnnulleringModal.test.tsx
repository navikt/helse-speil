import React from 'react';
import dayjs from 'dayjs';
import { render, screen } from '@testing-library/react';
import { AnnulleringModal } from './AnnulleringModal';
import { enVedtaksperiode } from '../../context/mapping/testdata/enVedtaksperiode';
import { mapVedtaksperiode } from '../../context/mapping/vedtaksperiode';
import { Kjønn, Overstyring } from '../../context/types.internal';
import { RecoilRoot } from 'recoil';
import { authState } from '../../state/authentication';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom/extend-expect';

const enSpeilVedtaksperiode = () =>
    mapVedtaksperiode({
        ...enVedtaksperiode(),
        organisasjonsnummer: '123456789',
        risikovurderingerForArbeidsgiver: [],
        overstyringer: [],
    });

const enPersoninfo = () => ({
    fornavn: 'Kari',
    mellomnavn: null,
    etternavn: 'Normann',
    kjønn: 'Mann' as Kjønn,
    fødselsdato: dayjs(),
    overstyringer: new Map<string, Overstyring>(),
});

const enArbeidsgiver = async () => ({
    id: '123',
    navn: 'En bedrift',
    organisasjonsnummer: '123456789',
    vedtaksperioder: [await enSpeilVedtaksperiode()],
    overstyringer: new Map<string, Overstyring>(),
});

const personTilBehandling = async () => ({
    aktørId: '12345',
    fødselsnummer: '12345678901',
    arbeidsgivere: [await enArbeidsgiver()],
    personinfo: enPersoninfo(),
    infotrygdutbetalinger: [],
    enhet: { id: '', navn: '' },
});

const authInfo = {
    name: 'Sara Saksbehandler',
    ident: 'S123456',
    email: 'sara.saksbehandler@nav.no',
    isLoggedIn: true,
};

describe('Annulleringsmodalen', () => {
    test('viser feilmelding om ident ikke fylles ut', async () => {
        render(
            <RecoilRoot initializeState={({ set }) => set(authState, authInfo)}>
                <AnnulleringModal
                    person={await personTilBehandling()}
                    vedtaksperiode={await enSpeilVedtaksperiode()}
                    onClose={() => null}
                />
            </RecoilRoot>
        );

        act(() => {
            userEvent.click(screen.getAllByRole('button')[0]);
            const feilmelding = 'For å gjennomføre annulleringen må du skrive inn din NAV brukerident i feltet under.';
            const elementMedFeilmelding = screen.getByText(feilmelding);
            expect(elementMedFeilmelding).toBeVisible();
        });
    });
});
