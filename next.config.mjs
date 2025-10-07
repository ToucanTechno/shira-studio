/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    pageExtensions: ['tsx', 'ts', 'jsx', 'js'].map(ext => `page.${ext}`),
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://localhost:3001/api/:path*',
            },
        ]
    },
    webpack: (config, { isServer }) => {
        // Exclude backend directory from webpack compilation
        config.watchOptions = {
            ...config.watchOptions,
            ignored: ['**/backend/**', '**/node_modules/**'],
        }
        return config
    },
}

export default nextConfig