import React from 'react';
import './Sykdomsvilkår.css';
import Bolk from '../../widgets/Bolk/Bolk';
import ItemMapper from '../../../datamapping/sykdomsvilkårMapper';
import { Panel } from 'nav-frontend-paneler';
import { Undertittel } from 'nav-frontend-typografi';
import ListeSeparator from '../../widgets/ListeSeparator';
import { sykdomsvilkårtekster, tekster } from '../../../tekster';
import { withBehandlingContext } from '../../../context/BehandlingerContext';
import Navigasjonsknapper from '../../widgets/Navigasjonsknapper';

const Sykdomsvilkår = withBehandlingContext(({ behandling }) => (
    <Panel className="Sykdomsvilkår" border>
        <Undertittel>Sykdomsvilkår</Undertittel>

        <Bolk title={sykdomsvilkårtekster('sykdomsvilkår_oppfylt')} />

        <ListeSeparator />

        <Undertittel>{tekster('mvp')}</Undertittel>

        <Bolk
            title={sykdomsvilkårtekster('mindre_enn_8_uker')}
            items={ItemMapper.mindreEnnÅtteUker(
                behandling.sykdomsvilkår.mindreEnnÅtteUkerSammenhengende
            )}
        />

        <Bolk title={sykdomsvilkårtekster('ingen_yrkesskade')} />

        <Navigasjonsknapper next="/inngangsvilkår" />
    </Panel>
));

export default Sykdomsvilkår;
