import { render } from '@testing-library/react';
import React from 'react';
import { AnnulleringModal } from './AnnulleringModal';
import { PersonContext } from '../../context/PersonContext';
import { enVedtaksperiode } from '../../context/mapping/testdata/enVedtaksperiode';
import { mapVedtaksperiode } from '../../context/mapping/vedtaksperiode';
import dayjs from 'dayjs';
import { Kjønn, Overstyring } from '../../context/types.internal';

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

it('Viser feilmelding', async () => {
    const { getByText } = render(
        <PersonContext.Provider
            value={{
                personTilBehandling: await personTilBehandling(),
                hentPerson: (_) => Promise.resolve(undefined),
                markerPersonSomTildelt: (_) => null,
                isFetching: false,
                aktiverVedtaksperiode: (_) => null,
                aktivVedtaksperiode: await enSpeilVedtaksperiode(),
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
