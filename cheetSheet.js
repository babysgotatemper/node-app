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

// Sequelize це ORM (Object-Relational Mapping) для Node.js, який дозволяє вам взаємодіяти з базою даних за допомогою об'єктів.
// https://sequelize.org/master/manual/getting-started.html
// npm install --save sequelize
// npm install --save mysql2 //якщо не встановлено
// у файлі db.js підключаємо модуль sequelize
const Sequelize = require('sequelize');
const sequelize = new Sequelize('node-complete', 'root', '423006Ce!', {
    dialect: 'mysql',
    host: 'localhost',
});
module.exports = sequelize; //повертаємо об'єкт sequelize
// ініціалізуємо моделі у відповідних файлах
const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: Sequelize.STRING,
    email: Sequelize.STRING
});
const Product = sequelize.define('product', { // де product - назва таблиці
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
});
//викликаємо метод findAll() для виконання запитів до бази даних
Product.findAll() // {where: {id: 1}} - вказуємо параметри для запиту
Product.findByPk(id) //пошук по первинному ключу
    .then(product => {
        console.log(product); // виконуємо дії з результатом
        product.save(); //зберігаємо дані в базі даних як новий запис або оновлюємо існуючий
        product.destroy(); //видаляємо запис з бази даних
    })
    .catch()
// в app.js створюємо з'єднання з базою даних
const sequelize = require('./util/database');
// вказуємо, що моделі User і Product використовують з'єднання з базою даних
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' }); //зв'язок один до багатьох
User.hasMany(Product); //зв'язок багато до одного
User.hasOne(Cart); //зв'язок один до одного
//Cart.belongsTo(User); //зв'язок один до одного.
Cart.belongsToMany(Product, { through: CartItem }); //зв'язок багато до багатьох
Product.belongsToMany(Cart, { through: CartItem });
User.createProduct() //створюємо метод для створення продукту для користувача

sequelize
    .sync() //створює таблиці в базі даних
    // .sync({ force: true }) //видаляє таблиці і створює нові. використовувати обережно на продакшені
    .then(result => {
        console.log(result);
    })
    .catch(err => {
        console.log(err);
    });

//
// exports.getOrders = (req, res, next) => {
//     req.user
//         .getOrders({include: ['products']}) // products - назва моделі в моделі Order (Order.belongsToMany(Product, { through: OrderItem }))
// таким чином ми отримуємо всі замовлення користувача з продуктами

////////////////////

// MongoDB
// https://www.mongodb.com/what-is-mongodb //документація
// https://www.mongodb.com/try/download/community //скачати MongoDB локально або використовувати MongoDB Atlas
// https://www.mongodb.com/try/start/commerce //створити базу даних
// створити новий проект і кластер
// створити нового користувача для доступу до бази з роллю readWrite
// налаштувати IP адреси для доступу до бази даних
// https://www.mongodb.com/docs/manual/crud/ //операції CRUD (Create, Read, Update, Delete)

// підключення до MongoDB з Node.js
// npm install --save mongodb
const mongodb = require('mongodb');
const {static} = require("express");
const MongoClient = mongodb.MongoClient;
// url - адреса бази даних з користувачем і паролем для доступу до бази даних з роллю readWrite
MongoClient.connect(
    'mongodb+srv://ReadWrite:111111Qq@node-app.bw0qh.mongodb.net/?retryWrites=true&w=majority&appName=Node-app')
    .then(client => {
        console.log('Connected!');
        client.close();
    })
    .catch(err => {
        console.log(err);
    });
// або з колбеком
let _db;
const mongoConnect = callback => { //функція підключення до бази даних
    MongoClient.connect(
        'mongodb+srv://ReadWrite:111111Qq@node-app.bw0qh.mongodb.net/?retryWrites=true&w=majority&appName=Node-app'
    )
        .then(client => {
            console.log('Connected!');
            _db = client.db(); //підключаємося до бази і зберігаємо з'єднання в змінну для подальшого використання без перепідключення
            callback(client);
            client.close();
        })
        .catch(err => {
            console.log(err);
        });
    }

const getDb = () => { // функція для отримання з'єднання з базою даних без перепідключення
    if (_db) {
        return _db;
    }
    throw 'No database found!';
}
module.exports = mongoConnect;

// далі потрібно створити клас який буде взаємодіяти з базою даних
// models/product.js
const getDb = require('../util/database').getDb; //підключаємо функцію для отримання з'єднання з базою даних
const db = getDb(); //отримуємо з'єднання з базою даних
class Product {
    constructor(title, price, imageUrl, description) {
        this.title = title;
        this.price = price;
        this.imageUrl = imageUrl;
        this.description = description;
    }
    save() {
        return db.collection('products').insertOne(this); // зберігаємо дані в базі даних
        // return db.collection('products').insertMany([this]); // зберігаємо багато записів в базі даних
    }
}

// app.js
const mongoConnect = require('./util/database').mongoConnect;
mongoConnect(client => { // підключаємося до бази даних і запускаємо сервер
    console.log(client);
    app.listen(3000);
});

// запит на отримання даних з бази даних
static fetchAll() {
    const db = getDb();
    return db.collection('products')
        .find()
        .toArray(); // коли знаємо що там array. Краще працювати з пагінацією
}

// робота з id
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;
const id = new ObjectId(this._id); // конвертуємо id в ObjectId. Формат в якому зберігається id в MongoDB

///////////////
//Compass це адмінка для MongoDB яка дозволяє візуально працювати з базою даних
// https://www.mongodb.com/products/tools/compass
// після встановлення відкриваємо його і підключаємося до бази даних
// вставляємо стрічку підключення яку ми використовуємо в нашому проекті (у файлі database.js або на сайті MongoDB)
// якщо її скоіювати а потім перезапустити Compass то вона автоматично підключиться до бази даних

const db = getDb();
return db
    .collection('products')
    .find({ _id: { $in: productIds } }) // $in - оператор, який дозволяє вибрати декілька значень


/////////////// Useful resource:
//
//     MongoDB Official Docs:
//     https://docs.mongodb.com/manual/core/security-encryption-at-rest/https://docs.mongodb.com/manual/
//
//     SQL vs NoSQL:
//     https://academind.com/learn/web-dev/sql-vs-nosql/
//
//     Learn more about MongoDB:
//     https://academind.com/learn/mongodb

