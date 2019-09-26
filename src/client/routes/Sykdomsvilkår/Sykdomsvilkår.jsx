import React from 'react';
import ListRow from '../../components/Rows/ListRow';
import IconRow from '../../components/Rows/IconRow';
import ListSeparator from '../../components/ListSeparator/ListSeparator';
import Navigasjonsknapper from '../../components/NavigationButtons';
import ItemMapper from '../../datamapping/sykdomsvilkårMapper';
import { Panel } from 'nav-frontend-paneler';
import { Element, Undertittel } from 'nav-frontend-typografi';
import { sykdomsvilkårtekster, tekster } from '../../tekster';
import { withBehandlingContext } from '../../context/BehandlingerContext';

const Sykdomsvilkår = withBehandlingContext(({ behandling }) => (
    <Panel className="Sykdomsvilkår" border>
        <Undertittel className="panel-tittel">Sykdomsvilkår</Undertittel>
        <IconRow label={sykdomsvilkårtekster('sykdomsvilkår_oppfylt')} bold />
        <ListSeparator />
        <Element className="mvp-tittel">{tekster('mvp')}</Element>
        <ListRow
            label={sykdomsvilkårtekster('mindre_enn_8_uker')}
            items={ItemMapper.mindreEnnÅtteUker(
                behandling.sykdomsvilkår.mindreEnnÅtteUkerSammenhengende
            )}
        />
        <IconRow label={sykdomsvilkårtekster('ingen_yrkesskade')} bold />
        <Navigasjonsknapper next="/inngangsvilkår" />
    </Panel>
));

export default Sykdomsvilkår;
