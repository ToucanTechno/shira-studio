/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
    typescript: {
        // Skip type checking during build - Vercel was trying to check backend files
        ignoreBuildErrors: false,
        tsconfigPath: './tsconfig.json',
    },
    eslint: {
        // Only run ESLint on specific directories during production builds
        dirs: ['app', 'src'],
    },
    env: {
        // Make API_URL available to the client
        API_URL: process.env.API_URL,
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