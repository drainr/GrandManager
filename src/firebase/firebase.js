import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

const getEnv = (primaryKey, fallbackKey) => {
  const primaryValue = import.meta.env[primaryKey];
  const fallbackValue = fallbackKey ? import.meta.env[fallbackKey] : undefined;
  return primaryValue ?? fallbackValue;
};

const firebaseConfig = {
  apiKey: getEnv("VITE_FIREBASE_API_KEY", "VITE_API_KEY"),
  authDomain: getEnv("VITE_FIREBASE_AUTH_DOMAIN", "VITE_AUTH_DOMAIN"),
  projectId: getEnv("VITE_FIREBASE_PROJECT_ID", "VITE_PROJECT_ID"),
  storageBucket: getEnv("VITE_FIREBASE_STORAGE_BUCKET", "VITE_STORAGE_BUCKET"),
  messagingSenderId: getEnv("VITE_FIREBASE_MESSAGING_SENDER_ID", "VITE_MESSAGING_SENDER_ID"),
  appId: getEnv("VITE_FIREBASE_APP_ID", "VITE_APP_ID"),
  measurementId: getEnv("VITE_FIREBASE_MEASUREMENT_ID", "VITE_MEASUREMENT_ID"),
};

const requiredConfigKeys = ["apiKey", "authDomain", "projectId", "storageBucket", "messagingSenderId", "appId"];
const missingConfigKeys = requiredConfigKeys.filter((key) => !firebaseConfig[key]);

if (missingConfigKeys.length > 0) {
  console.warn(`Missing Firebase env values: ${missingConfigKeys.join(", ")}`);
}

export const app = initializeApp(firebaseConfig);

export let analytics = null;

if (typeof window !== "undefined") {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {
      analytics = null;
    });
}
