import React from 'react';
import './Sykdomsvilkår.css';
import Bolk from '../../widgets/Bolk/Bolk';
import ItemMapper from '../../../datamapping/sykdomsvilkårMapper';
import { Panel } from 'nav-frontend-paneler';
import { Undertittel } from 'nav-frontend-typografi';
import ListeSeparator from '../../widgets/ListeSeparator';
import { sykdomsvilkårtekster as tekster } from '../../../tekster';
import { withBehandlingContext } from '../../../context/BehandlingerContext';
import Navigasjonsknapper from '../../widgets/Navigasjonsknapper';

const Sykdomsvilkår = withBehandlingContext(({ behandling }) => (
    <Panel className="Sykdomsvilkår" border>
        <Undertittel>Sykdomsvilkår</Undertittel>

        <Bolk title={tekster('sykdomsvilkår_oppfylt')} />

        <ListeSeparator />

        <Undertittel>{tekster('sykdomsrelaterte_betingelser')}</Undertittel>

        <Bolk
            title={tekster('mindre_enn_8_uker')}
            items={ItemMapper.mindreEnnÅtteUker(
                behandling.sykdomsvilkår.mindreEnnÅtteUkerSammenhengende
            )}
        />

        <Bolk title={tekster('ingen_yrkesskade')} />

        <Navigasjonsknapper next="/inngangsvilkår" />
    </Panel>
));

export default Sykdomsvilkår;
