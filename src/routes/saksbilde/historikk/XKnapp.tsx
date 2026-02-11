import { XMarkIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';

interface XKnappProps {
    tittel: string;
    onClick: () => void;
}

export function XKnapp({ tittel, onClick }: XKnappProps) {
    return (
        <Button
            size="xsmall"
            variant="tertiary"
            data-color="neutral"
            icon={<XMarkIcon title={tittel} />}
            onClick={onClick}
        />
    );
}
