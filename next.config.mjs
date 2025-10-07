/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    pageExtensions: ['tsx', 'ts', 'jsx', 'js'].map(ext => `page.${ext}`),
    typescript: {
        // Skip type checking during build - Vercel was trying to check backend files
        ignoreBuildErrors: false,
        tsconfigPath: './tsconfig.json',
    },
    eslint: {
        // Only run ESLint on specific directories during production builds
        dirs: ['app', 'src'],
    },
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