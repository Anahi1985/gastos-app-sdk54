import { getApp, getApps, initializeApp } from "firebase/app";
import { initializeFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

/** Inicializa Firebase App una sola vez durante el ciclo de vida de Metro. */
function getFirebaseApp() {
  if (!isFirebaseConfigured) return null;
  return getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
}

const app = getFirebaseApp();

type FirebaseGlobal = typeof globalThis & {
  __gastosFirestore?: Firestore;
};

type FirestoreSettingsWithStreams = Parameters<typeof initializeFirestore>[1] & {
  useFetchStreams?: boolean;
};

const firebaseGlobal = globalThis as FirebaseGlobal;

const firestoreSettings: FirestoreSettingsWithStreams = {
  useFetchStreams: false,
  experimentalForceLongPolling: true,
  experimentalAutoDetectLongPolling: false,
};

/** Instancia compartida de Cloud Firestore; `null` si falta configuración. */
export const db = app
  ? (firebaseGlobal.__gastosFirestore ??=
      initializeFirestore(app, firestoreSettings))
  : null;
