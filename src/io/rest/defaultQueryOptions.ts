// The behaviour we are used to from the Apollo cache: cached indefinitely when making the same call,
// until rendering without the call, or until refetching or evicting.
// Used as the queryOptions mutator in orval.config.ts; options from the call site take precedence.
export function withDefaultQueryOptions<T extends object>(options: T): { staleTime: number; gcTime: number } & T {
    return {
        staleTime: Infinity,
        gcTime: 0,
        ...options,
    };
}
