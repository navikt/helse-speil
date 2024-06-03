/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    experimental: {
        optimizePackageImports: ['@navikt/ds-react', '@navikt/aksel-icons'],
    },
    eslint: {
        ignoreDuringBuilds: true,
        dirs: ['src'],
    },
};

export default nextConfig;
