import React, { useContext } from 'react';
import './Inngangsvilkår.css';
import Personinfo from '../widgets/Personinfo';
import Bolk from '../widgets/Bolk';
import BehandlingerContext from '../../context/BehandlingerContext';
import ItemMapper from '../../datamapping/inngangsvilkårMapper';
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
                <Bolk
                    title="Medlemskap"
                    items={ItemMapper.medlemskap(behandling.inngangsvilkår.medlemskap)}
                />
                <Bolk
                    title="Opptjening"
                    items={ItemMapper.opptjening(behandling.inngangsvilkår.opptjening)}
                />
                <Bolk
                    title="Søknadsfrist"
                    items={ItemMapper.søknadsfrist(
                        behandling.inngangsvilkår.søknadsfrist
                    )}
                />
                <Bolk
                    title="Dager igjen"
                    items={ItemMapper.dagerIgjen(behandling.inngangsvilkår.dagerIgjen)}
                />
            </Panel>
        </div>
    );
};

export default Inngangsvilkår;
