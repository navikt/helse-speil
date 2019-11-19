import React, { useContext } from 'react';
import ListRow from '../../components/Rows/ListRow';
import IconRow from '../../components/Rows/IconRow';
import NavigationButtons from '../../components/NavigationButtons/NavigationButtons';
import { item } from '../../datamapping/mappingUtils';
import { Panel } from 'nav-frontend-paneler';
import { pages } from '../../hooks/useLinks';
import { PersonContext } from '../../context/PersonContext';
import { toKronerOgØre } from '../../utils/locale';
import FormRow from '../../components/Rows/FormRow';

const Inntektskilder = () => {
    const { inntektskilder } = useContext(PersonContext).personTilBehandling;
    const inntektsmeldingItems = inntektskilder && [
        item('Beregnet månedsinntekt', `${toKronerOgØre(inntektskilder.månedsinntekt)} kr`),
        item('Omregnet årsinntekt', `${toKronerOgØre(inntektskilder.årsinntekt)} kr`)
    ];

    return (
        <Panel className="tekstbolker">
            {inntektskilder && (
                <ListRow
                    label="Hentet fra inntektsmeldingen"
                    items={inntektsmeldingItems}
                    showIcon={false}
                />
            )}
            <IconRow label="A-ordningen må sjekkes manuelt" iconType="advarsel" />
            <FormRow label="Refusjon til arbeidsgiver" value={inntektskilder.refusjon} />
            <FormRow label="Betaler arbeidsgiverperiode" value={inntektskilder.forskuttering} />
            <NavigationButtons previous={pages.INNGANGSVILKÅR} next={pages.SYKEPENGEGRUNNLAG} />
        </Panel>
    );
};

export default Inntektskilder;
