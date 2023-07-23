// db.js
const mongoose = require('mongoose');

const connectionString = 'mongodb+srv://va1les:62700va1lesS5121@cluster0.furedqe.mongodb.net/web'; // Убедитесь, что имя базы данных соответствует вашей базе данных MongoDB
mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (error) => console.error('Ошибка подключения к MongoDB:', error));
db.once('open', () => console.log('Подключение к MongoDB установлено.'));
