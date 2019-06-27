import React from 'react';
import './Sykdomsvilkår.css';
import Bolk from '../../widgets/Bolk/Bolk';
import ItemMapper from '../../../datamapping/sykdomsvilkårMapper';
import { Panel } from 'nav-frontend-paneler';
import { Normaltekst } from 'nav-frontend-typografi';
import ListeSeparator from '../../widgets/ListeSeparator';
import { sykdomsvilkårtekster as tekster } from '../../../tekster';
import { withBehandlingContext } from '../../../context/withBehandlingContext';
import Navigasjonsknapper from '../../widgets/Navigasjonsknapper';

const Sykdomsvilkår = withBehandlingContext(({ behandling }) => (
    <Panel border>
        <Bolk title={tekster('sykdomsvilkår_oppfylt')} />

        <ListeSeparator type="dotted" />

        <Normaltekst className="Deloverskrift">
            {tekster('sykdomsrelaterte_betingelser')}
        </Normaltekst>

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
