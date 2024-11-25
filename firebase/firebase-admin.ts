import admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";

if (!admin.apps.length) {
  admin.initializeApp({
    

    databaseURL: "http://localhost:3000", // Use o URL do projeto Firebase
  });
}

export const adminAuth = admin.auth();
export {
  getAuth
  
} 