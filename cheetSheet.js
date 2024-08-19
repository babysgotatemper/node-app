https://nodejs.org/en/learn/getting-started/introduction-to-nodejs
https://nodejs.org/dist/latest/docs/api/

const server = http.createServer((req, res) => {
    console.log(req.url, req.method, req.headers);
    const url = req.url;
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head>Node JS</head>');
    res.write('<body><h1>Hello from Node JS Server</h1></body>');
    res.write('</html>');
    res.end(); //закінчуємо відповідь, якщо не закінчити, то сервер буде чекати відповіді
    process.exit(); //зупиняємо сервер
});

server.listen(3000); //port 3000

https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick
https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop


/// Запис у файл
const fs = require('fs'); 
const message = 'Hello from Node.js!';
fs.writeFileSync('hello.txt', message); //блокує виконання коду, поки не виконається запис у файл
fs.writeFile('hello.txt', message, () => {
    console.log('File is written!');
}); //не блокує виконання коду, виконується асинхронно

/// Exporting and importing
// Exporting, створити новий js файл
const requstHandler = (req, res) => {};
module.exports = requstHandler;
// Importing, в іншому файлі підключаємо модуль
const routes = require('./routes');
const server1 = http.createServer(routes);

/// Для експорту більше однієї функції
module.exports = {
    handler: requestHandler,
    some: someFunction
}

/// NPM
//npm init //створити package.json 

// "scripts": { // в package.json
//     "test": "echo \"Error: no test specified\" && exit 1",
//     "start": "node app.js" //команда запуск сервера
//   },

//npm install nodemon --save-dev //встановити nodemon для автоматичного перезапуску сервера
npm start // запуск сервера через консоль

start - зарезервоване слово 
для того щоб прописати в package.json власні команди
npm run назва_команди
//
//npm install nodemon --save-dev //встановити nodemon, devDependencies для перезапуску сервера
//
// "scripts": { // в package.json
//     "test": "echo \"Error: no test specified\" && exit 1",
//     "start": "nodemon app.js" //команда запуск сервера
//   },


/// Debugging
https://code.visualstudio.com/docs/nodejs/nodejs-debugging
// menu run -> start debugging || F5
// встановити точку зупинки на коді (натиснути на номер рядка)
// перезапустити сервер
// відкрити консоль debug console
// відкрити консоль terminal
// в debug console можна виконувати команди js (наприклад, console.log())

// перезапустити debugger сервер
// menu run -> add configuration -> Node.js -> вибрати файл який потрібно відлагоджувати
"configurations": [
    {
        ...
        "restart": true,
        "runtimeExecutable": "nodemon", // sudo npm install -g nodemon
        "console": "integratedTerminal", // для відображення консолі відлагоджування в терміналі
    }
]

https://nodejs.org/en/learn/getting-started/debugging
https://code.visualstudio.com/docs/nodejs/nodejs-debugging


/// Express
https://expressjs.com/en/starter/installing.html
// middleware - функція, яка обробляє запити
// npm instal --save express
const express = require('express');
const app = express();
app.use((req, res, next) => {
    console.log('In the middleware!');
    next(); //переходимо до наступного middleware
});
app.use((req, res, next) => {
    console.log('In another middleware!');
    res.send('<h1>Hello from Express!</h1>'); //дозволяє відправити відповідь
    // content-type: text/html встановлюється автоматично
});
const server2 = http.createServer(routes);
server2.listen(3000);

//
// замість 
const server3 = http.createServer(routes);
server2.listen(3000);
//можна використати
app.listen(3000); //використовується внутрішньо http.createServer(routes).listen(3000);


/// Routing Express 
https://expressjs.com/en/4x/api.html#req
app.use('/add-product', (req, res, next) => {
    res.send('<h1>Add Product</h1>');
    //next(); не викликаємо next, бо це останній middleware
});

///
//npm i --save body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false})); //реєструємо middleware для обробки даних з форми POST

app.use('/add-product', (req, res, next) => {
    res.send('<form action="/product" method="POST"><input type="text" name="title"><button type="submit">Add Product</button></form>');
});
//замість use можна використовувати get post put delete
app.post('/product', (req, res, next) => {
    console.log(req.body); //без bodyParser не буде доступний req.body
    res.redirect('/');
});

// app.use() використовується для реєстрації проміжних обробників (middleware) та маршрутів. Він обробляє всі HTTP-методи (GET, POST, PUT, DELETE тощо) для вказаного шляху або для всіх шляхів, якщо шлях не вказано.
// app.get() використовується для обробки HTTP GET запитів до вказаного шляху. Це специфічний метод для обробки запитів типу GET, який зазвичай використовується для отримання даних з сервера.

// тому при перенесенні методу в оремий файл, потрібно використовувати app.get() або app.post() замість app.use()
// routes/назва_файлу.js
const express = require('express');
const router = express.Router();

router.get('/some-route', (req, res, next) => {});
router.post('/some-route', (req, res, next) => {});
module.exports = router;

// 404
// потрібно вказати middleware, який буде обробляти всі запити, які не були оброблені раніше
// res.status(...).send(...) методи модна чейнити
app.use((req, res, next) => {
    res.status(404).send('<h1>Page not found</h1>');
})

// сегменти шляху (route segments)
app.get('/product/:productId', (req, res, next) => {
    console.log(req.params); //{ productId: 'product1' }
    res.redirect('/');
});
// або
const productRoutes = require('./routes/product');
app.use('/product', productRoutes)

// HTML file 
// views/shop.html
const path = require('path'); //вбудований модуль node.js для роботи з шляхами до файлів 
// __dirname - вбудована змінна, яка містить шлях до поточної директорії
// path.join() - метод, який об'єднує шляхи до файлів
// '../' - перехід на один рівень вище, '..' - перехід на батьківський каталог
router.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, '../', 'views', 'shop.html'));
});

// чистіший метод для вказання шляху
// utils/path.js
const path = require('path');
module.exports = path.dirname(process.mainModule.filename); //повертає шлях до головного модуля, який запускається в node.js
// у файлі
const rootDir = require('../utils/path');
router.get('/add-product', (req, res, next) => {
    //res.sendFile(path.join(__dirname, '../', 'views', 'add-product.html')); було
    res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
});

// public folder
// public folder - папка, в якій зберігаються статичні файли (css, js, images).
// app.use(express.static(path.join(__dirname, 'public'))); //вказуємо шлях до папки
// в html файлі вказуємо шлях до статичних файлів
// <link rel="stylesheet" href="/css/main.css"> //вказуємо шлях відносно кореня сайту



/// Template Engine
/// EJS(<p><%= name %></p>), Pug(p #{name}), Handlebars (<p>{{ name }}</p>)
// npm install --save ejs pug express-handlebars

// Pug 
https://pugjs.org/api/getting-started.html
// замість  // res.sendFile(path.join(rootDir, 'views', 'shop.html'));
res.render('shop', {prods: adminData.products, docTitle: 'Shop'});

// Handlebars
https://handlebarsjs.com/guide/
// npm install --save express-handlebars
const expressHbs = require('express-handlebars');
app.engine('hbs', expressHbs({layoutsDir: 'views/layouts/', defaultLayout: 'main-layout', extname: 'hbs'})); 
app.set('view-engine', 'hbs'); //вказуємо, що використовуємо hbs
app.set('views', 'views'); //вказуємо шлях до папки з шаблонами
//hbs далі використовується як розширення файлів

// EJS іде з коробки
app.set('view engine', 'ejs');
app.set('views', 'views'); //вказуємо шлях до папки з шаблонами
// .ejs розширення файлів

// MVC
// https://developer.mozilla.org/en-US/docs/Glossary/MVC

// Routing
// https://expressjs.com/en/guide/routing.html


/// Database connection
// https://www.w3schools.com/sql/
// https://github.com/sidorares/node-mysql2

// npm install --save mysql2
// створюємо файл db.js
const mysql = require('mysql2'); //підключаємо модуль mysql
const pool = mysql.createPool({ //створюємо пул з'єднань з базою даних
    host: 'localhost', // host name or ip address
    user: 'root', // default user name
    database: 'node-complete', //назва бази даних яку ми створили в mysql workbench
    password: '423006Ce!',
});
module.exports = pool.promise(); //повертаємо об'єкт, який містить метод promise()
//підключаємо модуль db.js в основний файл
const db = require('../util/database');
db.execute('SElECT * FROM products').then().catch() //викликаємо метод execute() для виконання запитів до бази даних
// * - означає всі поля, можна вказати конкретні поля через кому
db.execute('INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)', [title, price, imageUrl, description])
//викликаємо метод execute() для виконання запитів до бази даних
db.execute('Select * FROM products WHERE id = ?', [id]) //вказуємо параметри для запиту в масиві [id] - параметр



