import React, { useContext, useState } from 'react';
import ListRow from '../../components/Rows/ListRow';
import ItemMapper from '../../datamapping/inngangsvilkårMapper';
import TidligerePerioderModal from './TidligerePerioderModal';
import { Panel } from 'nav-frontend-paneler';
import { Normaltekst } from 'nav-frontend-typografi';
import { PersonContext } from '../../context/PersonContext';

import NavigationButtons from '../../components/NavigationButtons/NavigationButtons';
import { pages } from '../../hooks/useLinks';

const Inngangsvilkår = () => {
    const { inngangsvilkår } = useContext(PersonContext).personTilBehandling;
    const [visDetaljerboks, setVisDetaljerboks] = useState(false);

    const detaljerKnapp = (
        <button className="vis-modal-button" onClick={() => setVisDetaljerboks(true)} tabIndex={0}>
            Vis detaljer
        </button>
    );

    return (
        <Panel className="tekstbolker">
            {inngangsvilkår ? (
                <>
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
                        items={ItemMapper.under67År(inngangsvilkår.dagerIgjen)}
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
                </>
            ) : (
                <Normaltekst>Ingen data</Normaltekst>
            )}
            <NavigationButtons previous={pages.SYKMELDINGSPERIODE} next={pages.INNTEKTSKILDER} />
        </Panel>
    );
};

export default Inngangsvilkår;
