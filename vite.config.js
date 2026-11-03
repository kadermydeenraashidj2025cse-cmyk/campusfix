import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const fallbackConfig = {
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "gen-lang-client-0835009610",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:926501151430:web:e89b94eb822489a252adc7",
  apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyA7tyAmdYsKnHF9ryezQD-0s8_YFFHlNbU",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "gen-lang-client-0835009610.firebaseapp.com",
  firestoreDatabaseId: process.env.VITE_FIREBASE_DATABASE_ID || "ai-studio-campusfix-48928767-3dbe-4a57-81cc-0412ed7db4b8",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "gen-lang-client-0835009610.firebasestorage.app",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "926501151430",
  measurementId: "",
  oAuthClientId: "926501151430-7etk99p529dh907859halb4l60d2887a.apps.googleusercontent.com",
  recaptchaSiteKey: ""
}

function firebaseConfigPlugin() {
  const virtualId = '\0virtual:firebase-applet-config.json'
  return {
    name: 'vite-plugin-firebase-applet-config',
    resolveId(source) {
      if (source.endsWith('firebase-applet-config.json')) {
        const rootFile = path.resolve(__dirname, 'firebase-applet-config.json')
        const srcFile = path.resolve(__dirname, 'src', 'firebase-applet-config.json')
        if (fs.existsSync(rootFile)) return rootFile
        if (fs.existsSync(srcFile)) return srcFile
        return virtualId
      }
      return null
    },
    load(id) {
      if (id === virtualId) {
        return JSON.stringify(fallbackConfig)
      }
      return null
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), firebaseConfigPlugin()],
  server: {
    host: '0.0.0.0',
    hmr: false,
  },
})
