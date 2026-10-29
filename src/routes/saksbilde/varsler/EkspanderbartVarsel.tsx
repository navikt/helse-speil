import React, {
    HTMLAttributes,
    MouseEvent,
    PropsWithChildren,
    ReactElement,
    createContext,
    useContext,
    useState,
} from 'react';

import { ChevronDownIcon } from '@navikt/aksel-icons';
import { Button, Stack } from '@navikt/ds-react';

import { cn } from '@utils/tw';

interface EkspanderbartVarselProps extends PropsWithChildren, Omit<HTMLAttributes<HTMLDivElement>, 'onToggle'> {
    open?: boolean;
    onToggle?: (open: boolean) => void;
}

export function EkspanderbartVarsel({ open, onToggle, children, ...rest }: EkspanderbartVarselProps): ReactElement {
    const [ukontrollertOpen, setUkontrollertOpen] = useState(false);
    const erKontrollert = open !== undefined;
    const currentOpen = erKontrollert ? open : ukontrollertOpen;

    const toggleOpen = () => {
        if (!erKontrollert) {
            setUkontrollertOpen(!currentOpen);
        }
        onToggle?.(!currentOpen);
    };

    return (
        <EkspanderbartVarselContext.Provider value={{ open: currentOpen, toggleOpen }}>
            <div {...rest}>{children}</div>
        </EkspanderbartVarselContext.Provider>
    );
}

interface HeaderProps extends PropsWithChildren {
    className?: string;
    flexDirection?: 'row' | 'row-reverse';
    justify?: 'start' | 'center' | 'end' | 'space-around' | 'space-between' | 'space-evenly';
}

function Header({ children, className, flexDirection = 'row', justify = 'space-between' }: HeaderProps): ReactElement {
    const { open, toggleOpen } = useEkspanderbartVarselContext('EkspanderbartVarsel.Header');

    const håndterKlikk = (event: MouseEvent<HTMLElement>) => {
        if (!(event.target instanceof Element)) return;
        if (event.target.closest(IKKE_EKSPANDER_SELEKTOR)) return;
        if (window.getSelection()?.toString()) return;
        toggleOpen();
    };

    return (
        <Stack
            direction={flexDirection}
            align="center"
            justify={justify}
            gap="space-16"
            wrap={false}
            data-open={open}
            onClick={håndterKlikk}
            // Raske klikk skal toggle, ikke markere ord. Markering ved å dra virker fortsatt.
            onMouseDown={(event) => event.detail > 1 && event.preventDefault()}
            className={cn('group/header cursor-pointer p-2 text-ax-text-accent-subtle', className)}
        >
            {children}
            {/* Knappen er tastatur- og skjermleserkontrollen. Med mus går klikket gjennom til headeren. */}
            <Button
                type="button"
                variant="tertiary-neutral"
                size="small"
                className="pointer-events-none"
                onClick={toggleOpen}
                aria-expanded={open}
                aria-label="Detaljer"
                icon={
                    <ChevronDownIcon
                        className={cn('transition-transform group-data-[open=true]/header:rotate-180', OVERGANG)}
                        aria-hidden
                    />
                }
            />
        </Stack>
    );
}

interface ContentProps extends PropsWithChildren {
    className?: string;
}

function Content({ children, className }: ContentProps): ReactElement {
    const { open } = useEkspanderbartVarselContext('EkspanderbartVarsel.Content');

    return (
        <div
            data-open={open}
            aria-hidden={!open}
            className={cn(
                'grid overflow-hidden transition-[grid-template-rows,visibility]',
                open ? 'visible grid-rows-[1fr]' : 'invisible grid-rows-[0fr]',
                OVERGANG,
                className,
            )}
        >
            <div className="min-h-0">{children}</div>
        </div>
    );
}

EkspanderbartVarsel.Header = Header;
EkspanderbartVarsel.Content = Content;

interface EkspanderbartVarselContextValue {
    open: boolean;
    toggleOpen: () => void;
}

const EkspanderbartVarselContext = createContext<EkspanderbartVarselContextValue | null>(null);

function useEkspanderbartVarselContext(komponent: string): EkspanderbartVarselContextValue {
    const context = useContext(EkspanderbartVarselContext);
    if (context === null) {
        throw Error(`<${komponent}> må brukes inne i en <EkspanderbartVarsel>`);
    }
    return context;
}

const IKKE_EKSPANDER_SELEKTOR = 'button, a, input, select, textarea, [role="button"], [data-ikke-ekspander]';

const OVERGANG = 'duration-250 ease-[cubic-bezier(0.2,0,0,1)]';
