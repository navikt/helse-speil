import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    output: 'standalone',
    assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX,
    experimental: {
        optimizePackageImports: ['@navikt/ds-react', '@navikt/aksel-icons'],
    },
    serverExternalPackages: ['graphql-yoga', 'graphql', '@grafana/faro-web-tracing'],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.sanity.io',
                port: '',
                pathname: '/images/z9kr8ddn/production/**',
                search: '',
            },
        ],
    },
};

export default nextConfig;
