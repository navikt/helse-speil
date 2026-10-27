import { XMarkIcon } from '@navikt/aksel-icons';
import { Button, Tooltip } from '@navikt/ds-react';

interface XKnappProps {
    tittel: string;
    onClick: () => void;
}

export function XKnapp({ tittel, onClick }: XKnappProps) {
    return (
        <Tooltip content={tittel}>
            <Button
                size="xsmall"
                variant="tertiary"
                data-color="neutral"
                icon={<XMarkIcon aria-hidden />}
                onClick={onClick}
            />
        </Tooltip>
    );
}
