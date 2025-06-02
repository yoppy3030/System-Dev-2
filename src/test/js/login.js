const texts = {
  en: { title: "Login", username: "Username", password: "Password", login: "Login" },
  ja: { title: "ログイン", username: "ユーザー名", password: "パスワード", login: "ログイン" },
  my: { title: "လော့ဂ်အင်", username: "အသုံးပြုသူအမည်", password: "လျှို့ဝှက်နံပါတ်", login: "လော့ဂ်အင်လုပ်မည်" },
  zh: { title: "登录", username: "用户名", password: "密码", login: "登录" },
  vi: { title: "Đăng nhập", username: "Tên đăng nhập", password: "Mật khẩu", login: "Đăng nhập" },
  id: { title: "Masuk", username: "Nama pengguna", password: "Kata sandi", login: "Masuk" },
  ko: { title: "로그인", username: "사용자 이름", password: "비밀번호", login: "로그인" },
  th: { title: "เข้าสู่ระบบ", username: "ชื่อผู้ใช้", password: "รหัสผ่าน", login: "เข้าสู่ระบบ" },
  es: { title: "Iniciar sesión", username: "Nombre de usuario", password: "Contraseña", login: "Entrar" },
  fr: { title: "Connexion", username: "Nom d'utilisateur", password: "Mot de passe", login: "Connexion" },
  de: { title: "Anmelden", username: "Benutzername", password: "Passwort", login: "Anmelden" },
  ru: { title: "Войти", username: "Имя пользователя", password: "Пароль", login: "Войти" },
  ar: { title: "تسجيل الدخول", username: "اسم المستخدم", password: "كلمة المرور", login: "دخول" },
  hi: { title: "लॉग इन करें", username: "उपयोगकर्ता नाम", password: "पासवर्ड", login: "लॉग इन करें" },
  ms: { title: "Log masuk", username: "Nama pengguna", password: "Kata laluan", login: "Log masuk" },
  pt: { title: "Entrar", username: "Nome de usuário", password: "Senha", login: "Entrar" },
};

function setLang(lang) {
  document.getElementById("title").innerText = texts[lang].title;
  document.getElementById("username").placeholder = texts[lang].username;
  document.getElementById("password").placeholder = texts[lang].password;
  document.querySelector(".login-box button").innerText = texts[lang].login;
  document.getElementById("lang-popup").style.display = "none";
}

function togglePopup() {
  const popup = document.getElementById("lang-popup");
  popup.style.display = (popup.style.display === "block") ? "none" : "block";
}

function login() {
  alert("Login process will go here.");
}

// Default to English on page load
setLang("en");
