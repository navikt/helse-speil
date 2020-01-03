import React, { useContext } from 'react';
import Row from '../components/Row/Row';
import ListItem from '../components/ListItem';
import Subheader from '../components/Subheader';
import ListSeparator from '../components/ListSeparator';
import SubheaderWithList from '../components/SubheaderWithList';
import Navigasjonsknapper from '../components/NavigationButtons';
import { Panel } from 'nav-frontend-paneler';
import { pages } from '../hooks/useLinks';
import { PersonContext } from '../context/PersonContext';
import { toKronerOgØre } from '../utils/locale';
import { Person } from '../context/types';

const G = 99858;

const Sykepengegrunnlag = () => {
    const { sykepengegrunnlag } = useContext(PersonContext).personTilBehandling as Person;

    return (
        <Panel className="tekstbolker Sykepengegrunnlag">
            {sykepengegrunnlag && (
                <>
                    <SubheaderWithList label="Hentet fra inntektsmeldingen">
                        <ListItem label="Beregnet månedsinntekt">
                            {`${toKronerOgØre(sykepengegrunnlag.månedsinntekt)} kr`}
                        </ListItem>
                        <ListItem label="Omregnet årsinntekt">
                            {`${toKronerOgØre(sykepengegrunnlag.årsinntekt)} kr`}
                        </ListItem>
                    </SubheaderWithList>
                    <Subheader label="A-ordningen må sjekkes manuelt" iconType="advarsel" />
                    <Subheader label="Avvik må sjekkes manuelt" iconType="advarsel" />
                    <Row label="Sykepengegrunnlag">
                        {`${toKronerOgØre(sykepengegrunnlag.grunnlag)} kr`}
                    </Row>
                    <Row label="Redusert til 6G">
                        {(sykepengegrunnlag?.grunnlag ?? 0) > G * 6 ? `${toKronerOgØre(G * 6)} kr` : '-'}
                    </Row>
                    <ListSeparator />
                    <Row label="Dagsats">{`${toKronerOgØre(sykepengegrunnlag.dagsats)} kr`}</Row>
                </>
            )}
            <Navigasjonsknapper previous={pages.INNTEKTSKILDER} next={pages.UTBETALINGSOVERSIKT} />
        </Panel>
    );
};

export default Sykepengegrunnlag;
