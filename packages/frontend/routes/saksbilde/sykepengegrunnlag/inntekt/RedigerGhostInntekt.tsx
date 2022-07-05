import React, { Dispatch, SetStateAction } from 'react';
import { EditButton } from '@components/EditButton';

interface RedigerGhostInntektProps {
    setEditing: Dispatch<SetStateAction<boolean>>;
    editing: boolean;
}

export const RedigerGhostInntekt = ({ setEditing, editing }: RedigerGhostInntektProps) => {
    return (
        <EditButton
            isOpen={editing}
            openText="Avbryt"
            closedText="Endre"
            onOpen={() => setEditing(true)}
            onClose={() => setEditing(false)}
            style={{ justifySelf: 'flex-end' }}
        />
    );
};
