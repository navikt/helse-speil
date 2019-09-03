import React, { useState } from 'react';
import { Panel } from 'nav-frontend-paneler';
import { Undertittel, Normaltekst } from 'nav-frontend-typografi';
import { downloadFeedback } from '../../../io/http';
import { Keys } from '../../../hooks/useKeyboard';
import './HentTilbakemeldinger.less';

const Tilbakemeldinger = () => {
    const [dato, setDato] = useState('');

    const onInputChange = e => {
        setDato(e.target.value);
    };

    const keyTyped = e => {
        if ((e.keyCode || e.charCode) === Keys.ENTER) {
            downloadFeedback(dato);
        }
    };

    return (
        <Panel border>
            <Undertittel className="panel-tittel">
                Laste ned tilbakemeldinger
            </Undertittel>
            <Normaltekst>
                Bruk dato for å begrense hvilke tilbameldinger du vil hente. Du
                kan bruke norsk datoformat eller datadatoformat. Eksempler:
            </Normaltekst>
            <ul className="dato-eksempler typo-normal">
                <li>2019-09-02</li>
                <li>1.10.2020</li>
            </ul>

            <br></br>

            <div className="form">
                <label className="dato-label" htmlFor="datofelt">
                    <Normaltekst>Fra og med dato:</Normaltekst>
                    <input
                        id="datofelt"
                        type="text"
                        onChange={onInputChange}
                        onKeyPress={keyTyped}
                        value={dato}
                    />
                </label>
                <button onClick={() => downloadFeedback(dato)}>Last ned</button>
            </div>
        </Panel>
    );
};

export default Tilbakemeldinger;
