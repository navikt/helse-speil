import React from 'react';
import { Route } from 'react-router-dom';
import './MainContentWrapper.css';
import JsonView from '../JsonView/JsonView';
import Nav from '../Nav/NavView';
import Personinfo from '../widgets/Personinfo';
import Inngangsvilkår from '../pages/Inngangsvilkår/Inngangsvilkår';
import Beregning from '../pages/Beregning/Beregning';
import Periode from '../pages/Periode/Periode';
import Utbetaling from '../pages/Utbetaling/Utbetaling';

const MainContentWrapper = () => {
    return (
        <div className="page-content">
            <Nav />
            <div className="main-content">
                <Personinfo />
                <Route path={'/'} exact component={JsonView} />
                <Route
                    path={'/inngangsvilkår'}
                    exact
                    component={Inngangsvilkår}
                />
                <Route path={'/beregning'} exact component={Beregning} />
                <Route path={'/periode'} exact component={Periode} />
                <Route path={'/utbetaling'} exact component={Utbetaling} />
            </div>
        </div>
    );
};

export default MainContentWrapper;
