export type Maybe<T> = T | null;

function raise(message: string): never {
    throw new Error(message);
}
