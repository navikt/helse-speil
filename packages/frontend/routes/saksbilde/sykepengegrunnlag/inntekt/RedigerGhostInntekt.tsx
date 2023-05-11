import React, { Dispatch, SetStateAction } from 'react';

import { EditButton } from '@components/EditButton';

interface RedigerGhostInntektProps {
    erRevurdering: boolean;
    setEditing: Dispatch<SetStateAction<boolean>>;
    editing: boolean;
}

export const RedigerGhostInntekt = ({ erRevurdering, setEditing, editing }: RedigerGhostInntektProps) => {
    return (
        <EditButton
            isOpen={editing}
            openText="Avbryt"
            closedText={erRevurdering ? 'Revurder' : 'Endre'}
            onOpen={() => setEditing(true)}
            onClose={() => setEditing(false)}
        />
    );
};
