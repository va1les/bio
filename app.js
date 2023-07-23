const express = require('express');
const app = express();
const port = 3000;

const db = require('./db');
const User = require('./user');
const bcrypt = require('bcrypt');
const session = require('express-session');
const MongoStore = require('connect-mongo'); // Обратите внимание на эту строку

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

const store = MongoStore.create({ // Используем .create() вместо вызова конструктора
  mongoUrl: 'mongodb+srv://va1les:62700va1lesS5121@cluster0.furedqe.mongodb.net/web',
  collectionName: 'sessions',
  ttl: 7 * 24 * 60 * 60,
  autoRemove: 'native',
});

store.on('error', function (error) {
  console.log('Ошибка при работе с хранилищем сессий:', error);
});

app.use('/public', express.static('public'));

app.use(session({
  secret: '3638013edfcfa965a34a3095acfc07b8e9a8282d62f6003007c9d73daa8cef92cb4a160f2f80c9af6c56f10810960308ca68f0f9dae5f885f6da7e3846b1fffa',
  resave: false,
  saveUninitialized: true,
  store: store, // Используем экземпляр MongoStore для хранения сессий
}));

app.get('/', (req, res) => {
  // Проверяем, авторизован ли пользователь
  const user = req.session.user;
  if (user) {
    res.render('reviews', { user });
  } else {
    res.redirect('/login');
  }
});

app.get('/login', (req, res) => {
  // Сбрасываем сообщение об ошибке после отображения
  req.session.errorMessage = null;
  res.render('login', { errorMessage: req.session.errorMessage });
});

app.get('/signup', (req, res) => {
  // Сбрасываем сообщение об ошибке после отображения
  req.session.errorMessage = null;
  res.render('signup', { errorMessage: req.session.errorMessage });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (user) {
    req.session.user = user;
    res.redirect('/');
  } else {
    req.session.errorMessage = 'Неверное имя пользователя или пароль';
    res.redirect('/login');
  }
});

app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      req.session.errorMessage = 'Пользователь с таким именем уже существует';
      res.redirect('/signup');
      return;
    }

    const user = new User({ username, password, admin: false });
    await user.save();
    res.redirect('/login');
  } catch (error) {
    console.error('Ошибка при регистрации пользователя:', error);
    req.session.errorMessage = 'Произошла ошибка при регистрации пользователя';
    res.redirect('/signup');
  }
});

app.use((req, res, next) => {
  res.status(404).render('404');
});

app.listen(port || process.env.PORT, () => {
  console.log(`Сервер запущен на порту ${port}`);
});