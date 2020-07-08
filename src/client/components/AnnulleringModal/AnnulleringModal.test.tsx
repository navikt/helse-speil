import { render } from '@testing-library/react';
import React from 'react';
import { AnnulleringModal } from './AnnulleringModal';
import { PersonContext } from '../../context/PersonContext';
import { enVedtaksperiode } from '../../context/mapping/testdata/enVedtaksperiode';
import { mapVedtaksperiode } from '../../context/mapping/vedtaksperiodemapper';
import dayjs from 'dayjs';
import { Kjønn } from '../../context/types.internal';

const enSpeilVedtaksperiode = () => mapVedtaksperiode(enVedtaksperiode(), '123456789', []);

const enPersoninfo = () => ({
    fornavn: 'Kari',
    mellomnavn: null,
    etternavn: 'Normann',
    kjønn: 'Mann' as Kjønn,
    fødselsdato: dayjs(),
});

const enArbeidsgiver = () => ({
    id: '123',
    navn: 'En bedrift',
    organisasjonsnummer: '123456789',
    vedtaksperioder: [enSpeilVedtaksperiode()],
});

const personTilBehandling = {
    aktørId: '12345',
    fødselsnummer: '12345678901',
    arbeidsgivere: [enArbeidsgiver()],
    personinfo: enPersoninfo(),
    infotrygdutbetalinger: [],
    enhet: { id: '', navn: '' },
};

it('Viser feilmelding', () => {
    const { getByText } = render(
        <PersonContext.Provider
            value={{
                personTilBehandling,
                hentPerson: (_) => Promise.resolve(undefined),
                markerPersonSomTildelt: (_) => null,
                isFetching: false,
                aktiverVedtaksperiode: (_) => null,
                aktivVedtaksperiode: enSpeilVedtaksperiode(),
            }}
        >
            <AnnulleringModal
                onApprove={() => null}
                onClose={() => null}
                isSending={false}
                ident={'1234'}
                feilmelding={'Feilmelding'}
            />
        </PersonContext.Provider>
    );

    expect(getByText('Feilmelding')).toBeTruthy();
});
