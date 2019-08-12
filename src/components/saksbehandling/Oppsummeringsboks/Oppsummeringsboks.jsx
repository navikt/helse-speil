import React from 'react';
import PropTypes from 'prop-types';
import { Panel } from 'nav-frontend-paneler';
import { Undertittel } from 'nav-frontend-typografi';
import OppsummeringsboksItem, {
    ItemStatus,
    OppsummeringsboksItemProps
} from './OppsummeringsboksItem';
import './Oppsummeringsboks.less';
import { toKroner } from '../../../utils/locale';

const withTestData = Component => {
    Component.propTypes = {};
    return props => (
        <Component
            title="Sykepengegrunnlag"
            items={[
                {
                    label: 'Månedsinntekt',
                    value: toKroner(17000),
                    iconType: 'inntekstmelding'
                },
                {
                    label: 'Omregnet til årsinntekt',
                    value: toKroner(204000)
                },
                {
                    label: 'Sammenligningsgr.lag',
                    value: toKroner(155691),
                    iconType: 'aaregisteret'
                },
                {
                    label: 'Fastsatt inntekt',
                    status: ItemStatus.ULØST
                },
                {
                    label: 'Sykepengegrunnlag'
                },
                {
                    label: 'Dagsats'
                }
            ]}
            {...props}
        />
    );
};

const Oppsummeringsboks = ({ title, items }) => (
    <Panel border className="Oppsummeringsboks">
        <Undertittel>{title}</Undertittel>
        {items.map((item, i) => (
            <OppsummeringsboksItem
                key={`oppsummeringsboks-item-key${i}`}
                {...item}
            />
        ))}
        <hr />
    </Panel>
);

Oppsummeringsboks.propTypes = {
    title: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(OppsummeringsboksItemProps).isRequired
};

export default withTestData(Oppsummeringsboks);
