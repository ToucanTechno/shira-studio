import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// The defineConfig function can accept a function that provides context, like the current mode
export default defineConfig(({ mode }) => {
    // Load environment variables from the .env file in the current directory
    const env = loadEnv(mode, process.cwd(), '');

    return {
        plugins: [react()],
        server: {
            // Use the PORT from the .env file, or default to 5173 if not set
            // parseInt is crucial because environment variables are always strings
            port: parseInt(env.PORT) || 5173,
        }
    }
})