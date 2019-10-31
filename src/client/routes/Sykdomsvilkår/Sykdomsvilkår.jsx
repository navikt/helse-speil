import React, { useContext } from 'react';
import ListRow from '../../components/Rows/ListRow';
import IconRow from '../../components/Rows/IconRow';
import ItemMapper from '../../datamapping/sykdomsvilkårMapper';
import ListSeparator from '../../components/ListSeparator';
import Navigasjonsknapper from '../../components/NavigationButtons';
import { Panel } from 'nav-frontend-paneler';
import { PersonContext } from '../../context/PersonContext';
import { Element, Undertittel, Normaltekst } from 'nav-frontend-typografi';
import { sykdomsvilkårtekster, tekster } from '../../tekster';

const Sykdomsvilkår = () => {
    const { personTilBehandling } = useContext(PersonContext);

    return (
        <Panel className="Sykdomsvilkår">
            <Undertittel className="panel-tittel">Sykdomsvilkår</Undertittel>
            {personTilBehandling.sykdomsvilkår ? (
                <>
                    <IconRow label={sykdomsvilkårtekster('sykdomsvilkår_oppfylt')} bold />
                    <ListSeparator />
                    <Element className="mvp-tittel">{tekster('mvp')}</Element>
                    <ListRow
                        label={sykdomsvilkårtekster('mindre_enn_8_uker')}
                        items={ItemMapper.mindreEnnÅtteUker(
                            personTilBehandling.sykdomsvilkår.mindreEnnÅtteUkerSammenhengende
                        )}
                    />
                    <IconRow label={sykdomsvilkårtekster('ingen_yrkesskade')} bold />
                </>
            ) : (
                <Normaltekst>Ingen data</Normaltekst>
            )}
            <Navigasjonsknapper previous="/sykmeldingsperiode" next="/inngangsvilkår" />
        </Panel>
    );
};

export default Sykdomsvilkår;
