import React, { useContext } from 'react';
import ListRow from '../../components/Rows/ListRow';
import IconRow from '../../components/Rows/IconRow';
import Navigasjonsknapper from '../../components/NavigationButtons';
import { Panel } from 'nav-frontend-paneler';
import { pages } from '../../hooks/useLinks';
import { item } from '../../datamapping/mappingUtils';
import { PersonContext } from '../../context/PersonContext';
import { toKronerOgØre } from '../../utils/locale';
import './Sykepengegrunnlag.less';
import FormRow from '../../components/Rows/FormRow';

const G = 99858;

const Sykepengegrunnlag = () => {
    const { sykepengegrunnlag } = useContext(PersonContext).personTilBehandling;
    const inntektsmeldingItems = sykepengegrunnlag && [
        item('Beregnet månedsinntekt', `${toKronerOgØre(sykepengegrunnlag.månedsinntekt)} kr`),
        item('Omregnet årsinntekt', `${toKronerOgØre(sykepengegrunnlag.årsinntekt)} kr`)
    ];

    return (
        <Panel className="tekstbolker Sykepengegrunnlag">
            {sykepengegrunnlag && (
                <>
                    <ListRow
                        label="Hentet fra inntektsmeldingen"
                        items={inntektsmeldingItems}
                        showIcon={false}
                    />
                    <IconRow label="A-ordningen må sjekkes manuelt" iconType="advarsel" />
                    <IconRow label="Avvik må sjekkes manuelt" iconType="advarsel" />
                    <FormRow
                        label="Sykepengegrunnlag"
                        value={`${toKronerOgØre(sykepengegrunnlag.grunnlag)} kr`}
                        bold
                        showSeparator={false}
                    />
                    <FormRow
                        label="Redusert til 6G"
                        value={
                            sykepengegrunnlag.grunnlag > G * 6 ? `${toKronerOgØre(G * 6)} kr` : '-'
                        }
                        bold={false}
                    />
                    <FormRow
                        label="Dagsats"
                        value={`${toKronerOgØre(sykepengegrunnlag.dagsats)} kr`}
                        bold={false}
                        showSeparator={false}
                    />
                </>
            )}
            <Navigasjonsknapper previous={pages.INNTEKTSKILDER} next={pages.UTBETALINGSOVERSIKT} />
        </Panel>
    );
};

export default Sykepengegrunnlag;
