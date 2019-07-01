import React from 'react';
import Modal from 'nav-frontend-modal';
import PropTypes from 'prop-types';
import './ListeModal.css';
import Liste from '../Liste';

Modal.setAppElement('#root');

const ListeModal = ({ isOpen, title, onClose, items }) => (
    <Modal
        className="ListeModal"
        isOpen={isOpen}
        contentLabel={title}
        onRequestClose={onClose}
    >
        {items && <Liste items={items} title={title} />}
    </Modal>
);

ListeModal.propTypes = {
    title: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    items: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired
        })
    ),
    isOpen: PropTypes.bool
};

ListeModal.defaultProps = {
    isOpen: true
};

export default ListeModal;
