import { createHash } from 'node:crypto';

// Navnebasert UUID (versjon 5, RFC 9562): SHA-1 av namespace + navn. Gir samme UUID for samme input, så
// personPseudoId-ene i mocken er stabile på tvers av omstarter.
export function uuidV5(name: string, namespace: string): string {
    const namespaceBytes = Buffer.from(namespace.replaceAll('-', ''), 'hex');
    const bytes = createHash('sha1').update(namespaceBytes).update(name, 'utf8').digest().subarray(0, 16);

    bytes[6] = (bytes[6]! & 0x0f) | 0x50;
    bytes[8] = (bytes[8]! & 0x3f) | 0x80;

    const hex = bytes.toString('hex');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
