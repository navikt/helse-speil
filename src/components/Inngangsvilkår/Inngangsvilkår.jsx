import React, { useContext } from 'react';
import './Inngangsvilkår.css';
import Personinfo from '../widgets/Personinfo';
import Bolk from '../widgets/Bolk';
import BehandlingerContext from '../../context/BehandlingerContext';
import { Panel } from 'nav-frontend-paneler';
import { Undertittel } from 'nav-frontend-typografi';

const Inngangsvilkår = () => {
    const behandlingerCtx = useContext(BehandlingerContext);

    if (!behandlingerCtx.state || !behandlingerCtx.state[0]) {
        return '';
    }

    const behandling = behandlingerCtx.state[0];

    return (
        <div>
            <Personinfo />

            <Panel border>
                <Undertittel className="panel-tittel">
                    Beregning av sykepengegrunnlag og dagsats
                </Undertittel>

                <Bolk title="Inngangsvilkår oppfylt" />

                {medlemskapBolk(behandling.inngangsvilkår.medlemskap)}
            </Panel>
        </div>
    );
};

function medlemskapBolk(medlemskap) {
    const items = Object.keys(medlemskap).map(key => {
        return {
            label: key,
            value: medlemskap[key]
        };
    });

    return <Bolk title="Medlemskap" items={items} />;
}

export default Inngangsvilkår;
