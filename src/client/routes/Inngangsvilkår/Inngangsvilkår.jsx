import React, { useContext, useState } from 'react';
import ListItem from '../../components/ListItem';
import Subheader from '../../components/Subheader';
import VisModalButton from './VisModalButton';
import SubheaderWithList from '../../components/SubheaderWithList';
import NavigationButtons from '../../components/NavigationButtons/NavigationButtons';
import TidligerePerioderModal from './TidligerePerioderModal';
import { Panel } from 'nav-frontend-paneler';
import { pages } from '../../hooks/useLinks';
import { toDate } from '../../utils/date';
import { Normaltekst } from 'nav-frontend-typografi';
import { PersonContext } from '../../context/PersonContext';
import { capitalize, toKroner, toLocaleFixedNumberString } from '../../utils/locale';
import './Inngangsvilkår.less';

const Inngangsvilkår = () => {
    const { inngangsvilkår } = useContext(PersonContext).personTilBehandling;
    const [visDetaljerModal, setVisDetaljerModal] = useState(false);
    const detaljerKnapp = <VisModalButton onClick={() => setVisDetaljerModal(true)} />;

    return (
        <Panel className="tekstbolker Inngangsvilkår">
            {inngangsvilkår && (
                <>
                    <Subheader
                        label="Enkelte inngangsvilkår må vurderes manuelt"
                        iconType="advarsel"
                    />
                    <Panel>
                        <Subheader label="Medlemsskap må vurderes manuelt" iconType="advarsel" />
                        <Subheader label="Opptjening må vurderes manuelt" iconType="advarsel" />
                        <SubheaderWithList label="Mer enn 0,5G" iconType="ok">
                            <ListItem label="Sykepengegrunnlaget">
                                {`${toLocaleFixedNumberString(inngangsvilkår.sykepengegrunnlag, 2)} kr`}
                            </ListItem>
                            <Normaltekst>{`0,5G er ${toKroner(99858 / 2)} kr`}</Normaltekst>
                        </SubheaderWithList>
                        <SubheaderWithList label="Dager igjen" iconType="ok" labelProp={detaljerKnapp}>
                            <ListItem label="Første fraværsdag">{toDate(inngangsvilkår.dagerIgjen.førsteFraværsdag)}</ListItem>
                            <ListItem label="Første sykepengedag">{toDate(inngangsvilkår.dagerIgjen.førsteSykepengedag)}</ListItem>
                            <ListItem label="Yrkesstatus">{capitalize(inngangsvilkår.dagerIgjen.yrkesstatus)}</ListItem>
                            <ListItem label="Dager brukt">{inngangsvilkår.dagerIgjen.dagerBrukt}</ListItem>
                            <ListItem label="Dager igjen">{248 - inngangsvilkår.dagerIgjen.dagerBrukt}</ListItem>
                            <ListItem label="Maks dato">{toDate(inngangsvilkår.dagerIgjen.maksdato)}</ListItem>
                        </SubheaderWithList>
                        <SubheaderWithList label="Under 67 år" iconType="ok">
                            <ListItem label="Alder">{inngangsvilkår.alder}</ListItem>
                        </SubheaderWithList>
                        <SubheaderWithList label="Søknadsfrist" iconType="ok">
                            <ListItem label="Sendt Nav">{toDate(inngangsvilkår.søknadsfrist.sendtNav)}</ListItem>
                            <ListItem label="Søknad t.o.m.">{toDate(inngangsvilkår.søknadsfrist.søknadTom)}</ListItem>
                            <ListItem label="Innen 3 mnd">{inngangsvilkår.søknadsfrist.innen3Mnd ? 'Ja' : 'Nei'}</ListItem>
                        </SubheaderWithList>

                        {visDetaljerModal && (
                            <TidligerePerioderModal
                                perioder={inngangsvilkår.dagerIgjen.tidligerePerioder}
                                onClose={() => setVisDetaljerModal(false)}
                                førsteFraværsdag={inngangsvilkår.dagerIgjen.førsteFraværsdag}
                            />
                        )}
                    </Panel>
                </>
            )}
            <NavigationButtons previous={pages.SYKDOMSVILKÅR} next={pages.INNTEKTSKILDER} />
        </Panel>
    );
};

export default Inngangsvilkår;
