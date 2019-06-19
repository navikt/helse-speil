import React from 'react';
import Modal from 'nav-frontend-modal';
import PropTypes from 'prop-types';
import { Normaltekst } from 'nav-frontend-typografi';
import './ListeModal.css';

Modal.setAppElement('#root');

const ListeModal = ({ isOpen, title, onClose, items }) => (
    <Modal
        className="ListeModal"
        isOpen={isOpen}
        contentLabel={title}
        onRequestClose={onClose}
    >
        <Normaltekst>{title}</Normaltekst>
        {items.map((item, i) => (
            <span
                className="ListeModal__item"
                key={`${item.label}${i}`}
            >
                <Normaltekst>{item.label}</Normaltekst>
                <Normaltekst>{item.value}</Normaltekst>
            </span>
        ))}
    </Modal>
);

ListeModal.propTypes = {
    title: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired
    })),
    isOpen: PropTypes.bool
};

ListeModal.defaultProps = {
    isOpen: true
};

export default ListeModal;
