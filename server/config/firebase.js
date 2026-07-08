const { initializeApp, getApps } = require('firebase-admin/app');

// Initialize Firebase Admin
// By initializing with the projectId, we can verify tokens from this project
if (!getApps().length) {
  initializeApp({
    projectId: "eldonitor"
  });
}

module.exports = {};
