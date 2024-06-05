/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX,
    experimental: {
        optimizePackageImports: ['@navikt/ds-react', '@navikt/aksel-icons', '@navikt/ds-icons'],
        serverComponentsExternalPackages: ['graphql-yoga', 'graphql'],
    },
    eslint: {
        ignoreDuringBuilds: true,
        dirs: ['src'],
    },
};

export default nextConfig;
