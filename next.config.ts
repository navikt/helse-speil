import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    reactCompiler: true,
    output: 'standalone',
    // next build typesjekker med TypeScript 6-API-et. Typesjekken gjøres av tsc (TypeScript 7) i CI.
    typescript: {
        ignoreBuildErrors: true,
    },
    assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX,
    experimental: {
        optimizePackageImports: ['@navikt/ds-react', '@navikt/aksel-icons'],
    },
    serverExternalPackages: ['@grafana/faro-web-tracing'],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.sanity.io',
                port: '',
                pathname: `/images/z9kr8ddn/${process.env.SANITY_DATASET}/**`,
                search: '',
            },
        ],
    },
};

export default nextConfig;
