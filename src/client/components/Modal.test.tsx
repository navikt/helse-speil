import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ReactModal from 'react-modal';
import { Modal } from './Modal';

describe('Modal', () => {
    test('rendres når isOpen = true', () => {
        render(
            <div id="modalAnchor">
                <Modal contentLabel="test" onRequestClose={() => null} isOpen={true}>
                    <span>Denne skal vises</span>
                </Modal>
            </div>
        );
        ReactModal.setAppElement('#modalAnchor');
        expect(screen.queryByText('Denne skal vises')).toBeVisible();
    });
    test('rendres ikke når isOpen = false', () => {
        render(
            <div id="modalAnchor">
                <Modal contentLabel="test" onRequestClose={() => null} isOpen={false}>
                    <span>Denne skal ikke vises</span>
                </Modal>
            </div>
        );
        ReactModal.setAppElement('#modalAnchor');
        expect(screen.queryByText('Denne skal ikke vises')).toBeNull();
    });
});
