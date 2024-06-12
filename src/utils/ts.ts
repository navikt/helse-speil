export type Maybe<T> = T | null;

export function raise(message: string): never {
    throw new Error(message);
}
