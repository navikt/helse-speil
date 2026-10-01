// Orval 8 validates that keys under `components` match the OpenAPI regex ^[a-zA-Z0-9.\-_]+$ before generating,
// but Spesialist uses ÆØÅ in schema names. The transformer therefore encodes invalid characters as ASCII tokens
// (`å` -> `Qxe5Q`), and they are restored in the generated files afterwards. Tokens only contain [A-Za-z0-9],
// so Orval's pascal()/camel() leave them untouched in the type names.
// See https://github.com/orval-labs/orval/issues/3112

const componentSections = [
    'schemas',
    'responses',
    'parameters',
    'examples',
    'requestBodies',
    'headers',
    'securitySchemes',
    'links',
    'callbacks',
    'pathItems',
] as const;

const tokenRegex = /Qx([0-9a-f]+)Q/g;

export function encodeComponentKey(key: string): string {
    if (/^[^a-zA-Z0-9.\-_]/.test(key)) {
        // camel() lowercases the first character, after which the token is no longer recognised
        throw new Error(`Component key "${key}" cannot start with a character outside [a-zA-Z0-9.\\-_]`);
    }
    return [...key].map((char) => (/[a-zA-Z0-9.\-_]/.test(char) ? char : toToken(char))).join('');
}

export function decodeComponentKeys(text: string): string {
    return text.replace(tokenRegex, (_, hex: string) => String.fromCodePoint(parseInt(hex, 16)));
}

export function encodeComponentKeysInSpec<T extends object>(spec: T): T {
    const components = (spec as { components?: Record<string, unknown> }).components;
    const schemaNames = new Set(Object.keys((components?.schemas as object | undefined) ?? {}));

    const encoded = encodeRefs(spec, schemaNames) as T & { components?: Record<string, unknown> };
    if (!encoded.components) return encoded;

    const encodedComponents: Record<string, unknown> = { ...encoded.components };
    for (const section of componentSections) {
        const content = encodedComponents[section];
        if (content && typeof content === 'object') {
            encodedComponents[section] = Object.fromEntries(
                Object.entries(content).map(([key, value]) => [encodeComponentKey(key), value]),
            );
        }
    }
    return { ...encoded, components: encodedComponents };
}

function toToken(char: string): string {
    return `Qx${char.codePointAt(0)!.toString(16)}Q`;
}

function encodeRefs(node: unknown, schemaNames: Set<string>): unknown {
    if (Array.isArray(node)) return node.map((element) => encodeRefs(element, schemaNames));
    if (!node || typeof node !== 'object') return node;

    return Object.fromEntries(
        Object.entries(node).map(([key, value]) => {
            if (key === '$ref' && typeof value === 'string') return [key, encodeRef(value)];
            if (key === 'discriminator' && value && typeof value === 'object') {
                return [key, encodeDiscriminator(value as Record<string, unknown>, schemaNames)];
            }
            return [key, encodeRefs(value, schemaNames)];
        }),
    );
}

function encodeDiscriminator(node: Record<string, unknown>, schemaNames: Set<string>) {
    const discriminator = encodeRefs(node, schemaNames) as Record<string, unknown>;
    const mapping = discriminator.mapping;
    if (!isStringMap(mapping)) return discriminator;
    // The mapping keys are discriminator values sent over the wire, and must not be encoded
    return {
        ...discriminator,
        mapping: Object.fromEntries(
            Object.entries(mapping).map(([value, ref]) => [
                value,
                ref.startsWith('#/') || !schemaNames.has(ref) ? encodeRef(ref) : encodeComponentKey(ref),
            ]),
        ),
    };
}

function encodeRef(ref: string): string {
    const match = ref.match(/^(#\/components\/[^/]+\/)(.+)$/);
    if (!match) return ref;
    const [, prefix = '', key = ''] = match;
    return prefix + encodeComponentKey(safeDecodeURIComponent(key));
}

function isStringMap(value: unknown): value is Record<string, string> {
    return (
        !!value &&
        typeof value === 'object' &&
        !Array.isArray(value) &&
        Object.values(value).every((v) => typeof v === 'string')
    );
}

function safeDecodeURIComponent(value: string): string {
    try {
        return decodeURIComponent(value);
    } catch {
        return value;
    }
}
