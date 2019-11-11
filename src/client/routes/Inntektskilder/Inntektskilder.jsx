import React, { useContext } from 'react';
import ListRow from '../../components/Rows/ListRow';
import IconRow from '../../components/Rows/IconRow';
import NavigationButtons from '../../components/NavigationButtons/NavigationButtons';
import { item } from '../../datamapping/mappingUtils';
import { Panel } from 'nav-frontend-paneler';
import { pages } from '../../hooks/useLinks';
import { PersonContext } from '../../context/PersonContext';
import { toLocaleFixedNumberString } from '../../utils/locale';

const Inntektskilder = () => {
    const { inntektskilder } = useContext(PersonContext).personTilBehandling;
    const inntektsmeldingItems = inntektskilder && [
        item(
            'Beregnet månedsinntekt',
            `${toLocaleFixedNumberString(inntektskilder.månedsinntekt, 2)} kr`
        ),
        item(
            'Omregnet årsinntekt',
            `${toLocaleFixedNumberString(inntektskilder.årsinntekt, 2)} kr`
        ),
        item('Refusjon til arbeidsgiver', inntektskilder.refusjon),
        item('Betaler arbeidsgiverperiode', inntektskilder.forskuttering)
    ];

    return (
        <Panel className="tekstbolker">
            {inntektskilder && (
                <>
                    <ListRow
                        label="Hentet fra inntektsmeldingen"
                        items={inntektsmeldingItems}
                        showIcon={false}
                    />
                    <IconRow label="A-ordningen må sjekkes manuelt" iconType="advarsel" />
                </>
            )}
            <NavigationButtons previous={pages.INNGANGSVILKÅR} next={pages.SYKEPENGEGRUNNLAG} />
        </Panel>
    );
};

export default Inntektskilder;
