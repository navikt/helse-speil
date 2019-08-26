import React from 'react';
import IconRow from '../../widgets/rows/IconRow';
import ListRow from '../../widgets/rows/ListRow';
import ItemMapper from '../../../datamapping/inngangsvilkårMapper';
import Navigasjonsknapper from '../../widgets/Navigasjonsknapper';
import { Panel } from 'nav-frontend-paneler';
import { Undertittel } from 'nav-frontend-typografi';
import { inngangsvilkårtekster as tekster } from '../../../tekster';
import { withBehandlingContext } from '../../../context/BehandlingerContext';

const Inngangsvilkår = withBehandlingContext(({ behandling }) => {
    return (
        <Panel border>
            <Undertittel className="panel-tittel">
                {tekster(`tittel`)}
            </Undertittel>
            <IconRow
                label={tekster('overskrift -> inngangsvilkår oppfylt')}
                bold
            />
            <ListRow
                label={tekster('overskrift -> medlemskap')}
                items={ItemMapper.medlemskap(
                    behandling.inngangsvilkår.medlemskap
                )}
            />
            <ListRow
                label={tekster('overskrift -> opptjening')}
                items={ItemMapper.opptjening(
                    behandling.inngangsvilkår.opptjening
                )}
            />
            <ListRow
                label={tekster('overskrift -> mer enn 0,5G')}
                items={ItemMapper.merEnn05G(
                    behandling.inngangsvilkår.merEnn05G
                )}
            />
            <ListRow
                label={tekster('overskrift -> søknadsfrist')}
                items={ItemMapper.søknadsfrist(
                    behandling.inngangsvilkår.søknadsfrist
                )}
            />
            <ListRow
                label={tekster('overskrift -> dager igjen')}
                items={ItemMapper.dagerIgjen(
                    behandling.inngangsvilkår.dagerIgjen
                )}
            />
            <ListRow
                label={tekster('overskrift -> under 67 år')}
                items={ItemMapper.under67År(
                    behandling.inngangsvilkår.dagerIgjen
                )}
            />
            <Navigasjonsknapper previous="/" next="/beregning" />
        </Panel>
    );
});

export default Inngangsvilkår;
