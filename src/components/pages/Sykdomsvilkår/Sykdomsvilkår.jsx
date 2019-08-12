import React from 'react';
import ListRow from '../../widgets/rows/ListRow';
import IconRow from '../../widgets/rows/IconRow';
import ListeSeparator from '../../widgets/ListeSeparator';
import Navigasjonsknapper from '../../widgets/Navigasjonsknapper';
import ItemMapper from '../../../datamapping/sykdomsvilkårMapper';
import { Panel } from 'nav-frontend-paneler';
import { Element, Undertittel } from 'nav-frontend-typografi';
import { sykdomsvilkårtekster, tekster } from '../../../tekster';
import { withBehandlingContext } from '../../../context/BehandlingerContext';

const Sykdomsvilkår = withBehandlingContext(({ behandling }) => (
    <Panel className="Sykdomsvilkår" border>
        <Undertittel className="panel-tittel">Sykdomsvilkår</Undertittel>
        <IconRow label={sykdomsvilkårtekster('sykdomsvilkår_oppfylt')} />
        <ListeSeparator />
        <Element className="mvp-tittel">{tekster('mvp')}</Element>
        <ListRow
            label={sykdomsvilkårtekster('mindre_enn_8_uker')}
            items={ItemMapper.mindreEnnÅtteUker(
                behandling.sykdomsvilkår.mindreEnnÅtteUkerSammenhengende
            )}
        />
        <IconRow label={sykdomsvilkårtekster('ingen_yrkesskade')} />
        <Navigasjonsknapper next="/inngangsvilkår" />
    </Panel>
));

export default Sykdomsvilkår;
