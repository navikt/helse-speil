import React, { useContext } from 'react';
import ListRow from '../../components/Rows/ListRow';
import IconRow from '../../components/Rows/IconRow';
import ItemMapper from '../../datamapping/sykdomsvilkårMapper';
import ListSeparator from '../../components/ListSeparator';
import Navigasjonsknapper from '../../components/NavigationButtons';
import { Panel } from 'nav-frontend-paneler';
import { BehandlingerContext } from '../../context/BehandlingerContext';
import { Element, Undertittel } from 'nav-frontend-typografi';
import { sykdomsvilkårtekster, tekster } from '../../tekster';

const Sykdomsvilkår = () => {
    const { valgtBehandling } = useContext(BehandlingerContext);
    return (
        <Panel className="Sykdomsvilkår" border>
            <Undertittel className="panel-tittel">Sykdomsvilkår</Undertittel>
            <IconRow label={sykdomsvilkårtekster('sykdomsvilkår_oppfylt')} bold />
            <ListSeparator />
            <Element className="mvp-tittel">{tekster('mvp')}</Element>
            <ListRow
                label={sykdomsvilkårtekster('mindre_enn_8_uker')}
                items={ItemMapper.mindreEnnÅtteUker(
                    valgtBehandling.sykdomsvilkår.mindreEnnÅtteUkerSammenhengende
                )}
            />
            <IconRow label={sykdomsvilkårtekster('ingen_yrkesskade')} bold />
            <Navigasjonsknapper next="/inngangsvilkår" />
        </Panel>
    );
};

export default Sykdomsvilkår;
