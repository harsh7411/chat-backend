
import "dotenv/config";
import { initializeApp, cert, getApps, type App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import path from "node:path";

const serviceAccountPath = path.resolve(
  process.cwd(),
  "secrets",
  "firebase-service-account.json"
);

let firebaseApp: App;

if (getApps().length === 0) {
  firebaseApp = initializeApp({
    credential: cert(serviceAccountPath),
  });
} else {
  firebaseApp = getApps()[0]!;
}

export const firestore = getFirestore(firebaseApp);
export { firebaseApp };
