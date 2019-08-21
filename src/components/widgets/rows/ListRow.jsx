import React from 'react';
import IconRow from './IconRow';
import PropTypes from 'prop-types';
import { Normaltekst } from 'nav-frontend-typografi';
import './ListRow.less';

const ListRow = ({ label, items, bold }) => {
    return (
        <>
            <IconRow label={label} bold={bold} />
            {items && (
                <div className="ListRow">
                    {items.map((item, i) => (
                        <span
                            key={`ListRow__item-${label}-${i}`}
                            className="ListItem"
                        >
                            <span className="ListItem__left">
                                <Normaltekst>{item.label}</Normaltekst>
                                <Normaltekst className={bold ? 'bold' : ''}>
                                    {item.value ?? ''}
                                </Normaltekst>
                            </span>
                            <span className="ListItem__right" />
                        </span>
                    ))}
                </div>
            )}
        </>
    );
};

ListRow.propTypes = {
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
    items: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        })
    ),
    bold: PropTypes.bool
};

ListRow.defaultProps = {
    bold: true
};

export default ListRow;
