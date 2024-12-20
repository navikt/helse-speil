/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX,
    experimental: {
        optimizePackageImports: ['@navikt/ds-react', '@navikt/aksel-icons'],
        serverComponentsExternalPackages: ['graphql-yoga', 'graphql', '@grafana/faro-web-tracing'],
    },
    eslint: {
        ignoreDuringBuilds: true,
        dirs: ['src'],
    },
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
