import React, { useContext, useState } from 'react';
import ListRow from '../../components/Rows/ListRow';
import ItemMapper from '../../datamapping/inngangsvilkårMapper';
import TidligerePerioderModal from './TidligerePerioderModal';
import { Panel } from 'nav-frontend-paneler';
import { Normaltekst } from 'nav-frontend-typografi';
import { PersonContext } from '../../context/PersonContext';
import './Inngangsvilkår.less';

import NavigationButtons from '../../components/NavigationButtons/NavigationButtons';
import { pages } from '../../hooks/useLinks';
import IconRow from '../../components/Rows/IconRow';

const Inngangsvilkår = () => {
    const { inngangsvilkår } = useContext(PersonContext).personTilBehandling;
    const [visDetaljerboks, setVisDetaljerboks] = useState(false);

    const detaljerKnapp = (
        <button className="vis-modal-button" onClick={() => setVisDetaljerboks(true)} tabIndex={0}>
            Vis detaljer
        </button>
    );

    return (
        <Panel className="tekstbolker Inngangsvilkår">
            {inngangsvilkår ? (
                <>
                    <IconRow
                        label="Enkelte inngangsvilkår må vurderes manuelt"
                        iconType="advarsel"
                    />
                    <Panel>
                        <IconRow label="Medlemsskap må vurderes manuelt" iconType="advarsel" />
                        <IconRow label="Opptjening må vurderes manuelt" iconType="advarsel" />
                        <ListRow
                            label="Mer enn 0,5G"
                            items={ItemMapper.merEnn05G(inngangsvilkår.sykepengegrunnlag)}
                        />
                        <ListRow
                            label="Dager igjen"
                            labelProp={detaljerKnapp}
                            items={ItemMapper.dagerIgjen(inngangsvilkår.dagerIgjen)}
                        />
                        <ListRow
                            label="Under 67 år"
                            items={ItemMapper.alder(inngangsvilkår.alder)}
                        />
                        <ListRow
                            label="Søknadsfrist"
                            items={ItemMapper.søknadsfrist(inngangsvilkår.søknadsfrist)}
                        />

                        {visDetaljerboks && (
                            <TidligerePerioderModal
                                perioder={inngangsvilkår.dagerIgjen.tidligerePerioder}
                                onClose={() => setVisDetaljerboks(false)}
                                førsteFraværsdag={inngangsvilkår.dagerIgjen.førsteFraværsdag}
                            />
                        )}
                    </Panel>
                </>
            ) : (
                <Normaltekst>Ingen data</Normaltekst>
            )}
            <NavigationButtons previous={pages.SYKDOMSVILKÅR} next={pages.INNTEKTSKILDER} />
        </Panel>
    );
};

export default Inngangsvilkår;
