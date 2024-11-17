// Инициализация Firebase (если она не была сделана ранее в другом месте)
const firebaseConfig = {
  apiKey: "AIzaSyBaqNG8rvWzefiAOL7fm0Iq-XU6IQR8BhA",
  authDomain: "culinary-diary-site.firebaseapp.com",
  projectId: "culinary-diary-site",
  storageBucket: "culinary-diary-site.appspot.com",
  messagingSenderId: "717923230990",
  appId: "1:717923230990:web:7b387924f6d4b75970635f",
  measurementId: "G-WZ83X6KJ75",
  databaseURL: "https://culinary-diary-site-default-rtdb.firebaseio.com" // URL для Realtime Database
};

// Инициализация Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth(); // Инициализация аутентификации

// Функция для авторизации через Google
function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider).then((result) => {
    const user = result.user;
    console.log("User signed in:", user);
    // Можешь добавить дополнительные действия после успешного входа
  }).catch((error) => {
    console.error("Error signing in:", error);
  });
}

// Функция для выхода из аккаунта
function signOutUser() {
  auth.signOut().then(() => {
    console.log("User signed out");
    // Можешь добавить действия после выхода (например, обновление UI)
  }).catch((error) => {
    console.error("Error signing out:", error);
  });
}

// Слушаем изменения состояния авторизации
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log("User is signed in:", user);
  } else {
    console.log("No user signed in");
  }
});

// Подключение кнопки входа через Google
document.getElementById("googleSignInBtn").addEventListener("click", signInWithGoogle);

// Подключение кнопки выхода
document.getElementById("googleSignOutBtn").addEventListener("click", signOutUser);
