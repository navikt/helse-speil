import React, { useContext } from 'react';
import { Panel } from 'nav-frontend-paneler';
import { Normaltekst } from 'nav-frontend-typografi';
import NavigationButtons from '../../components/NavigationButtons/NavigationButtons';
import { pages } from '../../hooks/useLinks';
import ListRow from '../../components/Rows/ListRow';
import { item } from '../../datamapping/mappingUtils';
import { PersonContext } from '../../context/PersonContext';
import { toLocaleFixedNumberString } from '../../utils/locale';

const Inntektskilder = () => {
    const { inntektskilder } = useContext(PersonContext).personTilBehandling;
    return (
        <Panel className="tekstbolker">
            {inntektskilder ? (
                <div>
                    <ListRow
                        label="Hentet fra inntektsmeldingen"
                        items={[
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
                        ]}
                        displayIcon={false}
                    ></ListRow>

                    <NavigationButtons
                        previous={pages.INNGANGSVILKÅR}
                        next={pages.SYKEPENGEGRUNNLAG}
                    />
                </div>
            ) : (
                <Normaltekst>Ingen data</Normaltekst>
            )}
        </Panel>
    );
};

export default Inntektskilder;
