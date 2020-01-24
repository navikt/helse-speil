import React from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import Lenke from 'nav-frontend-lenker';
import './IkkeLoggetInn.less';

const IkkeLoggetInn = () => (
    <div className="IkkeLoggetInn">
        <Normaltekst>Du må logge inn for å få tilgang til systemet</Normaltekst>
        <Normaltekst>
            <Lenke href="/">Gå til innloggingssiden</Lenke>
        </Normaltekst>
    </div>
);

export default IkkeLoggetInn;
