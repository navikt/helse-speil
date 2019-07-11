import React from 'react';
import Bolk from '../../widgets/Bolk/Bolk';
import ItemMapper from '../../../datamapping/inngangsvilkårMapper';
import { Panel } from 'nav-frontend-paneler';
import { Undertittel } from 'nav-frontend-typografi';
import { inngangsvilkårtekster as tekster } from '../../../tekster';
import { withBehandlingContext } from '../../../context/BehandlingerContext';
import Navigasjonsknapper from '../../widgets/Navigasjonsknapper';

const Inngangsvilkår = withBehandlingContext(({ behandling }) => (
    <Panel border>
        <Undertittel className="panel-tittel">{tekster(`tittel`)}</Undertittel>
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
        <Navigasjonsknapper previous="/" next="/beregning" />
    </Panel>
));

export default Inngangsvilkår;
