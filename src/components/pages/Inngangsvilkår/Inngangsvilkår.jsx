import React from 'react';
import IconRow from '../../widgets/rows/IconRow';
import ListRow from '../../widgets/rows/ListRow';
import ItemMapper from '../../../datamapping/inngangsvilkårMapper';
import Navigasjonsknapper from '../../widgets/Navigasjonsknapper';
import { Panel } from 'nav-frontend-paneler';
import { Undertittel } from 'nav-frontend-typografi';
import { inngangsvilkårtekster as tekster } from '../../../tekster';
import { withBehandlingContext } from '../../../context/BehandlingerContext';

const Inngangsvilkår = withBehandlingContext(({ behandling }) => (
    <Panel border>
        <Undertittel className="panel-tittel">{tekster(`tittel`)}</Undertittel>
        <IconRow label="Inngangsvilkår oppfylt" bold />
        <ListRow
            label="Medlemskap"
            items={ItemMapper.medlemskap(behandling.inngangsvilkår.medlemskap)}
        />
        <ListRow
            label="Opptjening"
            items={ItemMapper.opptjening(behandling.inngangsvilkår.opptjening)}
        />
        <ListRow
            label="Søknadsfrist"
            items={ItemMapper.søknadsfrist(
                behandling.inngangsvilkår.søknadsfrist
            )}
        />
        <ListRow
            label="Dager igjen"
            items={ItemMapper.dagerIgjen(behandling.inngangsvilkår.dagerIgjen)}
        />
        <ListRow
            label="Under 67 år"
            items={ItemMapper.under67År(behandling.inngangsvilkår.dagerIgjen)}
        />
        <Navigasjonsknapper previous="/" next="/beregning" />
    </Panel>
));

export default Inngangsvilkår;
