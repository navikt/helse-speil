import React, { useState } from 'react';
import { Sidetittel } from 'nav-frontend-typografi';
import { Flatknapp } from 'nav-frontend-knapper';
import { getAlleOpptegnelser, getOpptegnelser, postAbonnerPåAktør } from '../../io/http';

const abonnerPåAktør = (aktørId: string) => {
    postAbonnerPåAktør(aktørId).then((r) => console.log(r));
};

const hentOpptegnelser = (sisteSekvensId: string) => {
    getOpptegnelser(sisteSekvensId).then((r) => console.log(r));
};

const hentAlleOpptegnelser = () => {
    getAlleOpptegnelser().then((r) => console.log(r));
};

export const Opptegnelse = () => {
    const [aktørId, setAktørId] = useState('1230123');
    const [sisteSekvensId, setSisteSekvensId] = useState('1');

    return (
        <>
            <Sidetittel>Opptegnelse</Sidetittel>
            <br />

            <input value={aktørId} onChange={(e) => setAktørId(e.target.value)}></input>
            <Flatknapp onClick={() => abonnerPåAktør(aktørId)}>Abonner på aktør</Flatknapp>

            <br />
            <input value={sisteSekvensId} onChange={(e) => setSisteSekvensId(e.target.value)}></input>
            <Flatknapp onClick={() => hentOpptegnelser(sisteSekvensId)}>
                Hent opptegnelser etter siste sekvensId
            </Flatknapp>

            <br />
            <Flatknapp onClick={() => hentAlleOpptegnelser()}>Hent alle opptegnelser</Flatknapp>
        </>
    );
};
