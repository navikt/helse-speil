import React, {
    ElementType,
    HTMLAttributes,
    PropsWithChildren,
    ReactElement,
    createContext,
    useContext,
    useState,
} from 'react';

import { ChevronDownIcon } from '@navikt/aksel-icons';
import { Button, Stack } from '@navikt/ds-react';

import { cn } from '@utils/tw';

import styles from './EkspanderbartVarsel.module.css';

interface EkspanderbartVarselContextValue {
    open: boolean;
    toggleOpen: () => void;
}

const EkspanderbartVarselContext = createContext<EkspanderbartVarselContextValue | null>(null);

const useEkspanderbartVarselContext = (komponent: string): EkspanderbartVarselContextValue => {
    const context = useContext(EkspanderbartVarselContext);
    if (context === null) {
        throw Error(`<${komponent}> må brukes inne i en <EkspanderbartVarsel>`);
    }
    return context;
};

interface EkspanderbartVarselProps extends PropsWithChildren, Omit<HTMLAttributes<HTMLElement>, 'onToggle'> {
    as?: ElementType;
    open?: boolean;
    onToggle?: (open: boolean) => void;
    defaultOpen?: boolean;
}

interface EkspanderbartVarselComponent {
    (props: EkspanderbartVarselProps): ReactElement;
    Header: typeof Header;
    Content: typeof Content;
}

export const EkspanderbartVarsel = (({
    as: Component = 'div',
    open,
    onToggle,
    defaultOpen = false,
    className,
    children,
    ...rest
}: EkspanderbartVarselProps): ReactElement => {
    const [ukontrollertOpen, setUkontrollertOpen] = useState(defaultOpen);
    const erKontrollert = open !== undefined;
    const currentOpen = erKontrollert ? open : ukontrollertOpen;

    const toggleOpen = () => {
        const nesteOpen = !currentOpen;
        if (!erKontrollert) {
            setUkontrollertOpen(nesteOpen);
        }
        onToggle?.(nesteOpen);
    };

    return (
        <EkspanderbartVarselContext.Provider value={{ open: currentOpen, toggleOpen }}>
            <Component className={className} {...rest}>
                {children}
            </Component>
        </EkspanderbartVarselContext.Provider>
    );
}) as EkspanderbartVarselComponent;

interface HeaderProps extends PropsWithChildren {
    className?: string;
    flexDirection?: 'row' | 'row-reverse';
    justify?: 'start' | 'center' | 'end' | 'space-around' | 'space-between' | 'space-evenly';
}

const Header = ({
    children,
    className,
    flexDirection = 'row',
    justify = 'space-between',
}: HeaderProps): ReactElement => {
    const { open, toggleOpen } = useEkspanderbartVarselContext('EkspanderbartVarsel.Header');

    return (
        <Stack
            direction={flexDirection}
            align="center"
            justify={justify}
            gap="space-16"
            wrap={false}
            data-open={open}
            className={cn(styles.header, className)}
        >
            {children}
            <Button
                type="button"
                variant="tertiary"
                size="small"
                className={styles.chevronButton}
                onClick={toggleOpen}
                aria-expanded={open}
                aria-label={open ? 'Skjul' : 'Vis'}
                icon={<ChevronDownIcon className={styles.chevron} aria-hidden />}
            />
        </Stack>
    );
};

interface ContentProps extends PropsWithChildren {
    className?: string;
}

const Content = ({ children, className }: ContentProps): ReactElement => {
    const { open } = useEkspanderbartVarselContext('EkspanderbartVarsel.Content');

    return (
        <div className={cn(styles.content, className)} data-open={open} aria-hidden={!open}>
            <div className={styles.contentInnhold}>{children}</div>
        </div>
    );
};

EkspanderbartVarsel.Header = Header;
EkspanderbartVarsel.Content = Content;
