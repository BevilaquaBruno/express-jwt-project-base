const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

var corsOption = {
  origin: 'htpp://localhost:8081'
}

app.use(cors(corsOption));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = require('./app/models');
const dbConfig = require('./app/config/db.config');
const Role = db.Role;

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    console.log('MongoDb initialized');
    initial();
  }).catch(err => {
    console.error('Connection error', err);
    process.exit();
  });

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && !count === 0) {
      new Role({
        name: 'user'
      }).save(err => {
        if (err) {
          console.log('Error', err);
        }
        console.log('User added in role collection');
      });

      new Role({
        name: 'moderator'
      }).save(err => {
        if (err) {
          console.log('Error', err);
        }

        console.log('moderator added in role colletion');
      });

      new Role({
        name: 'admin'
      }).save(err => {
        if (err) {
          console.log('Error', err);
        }

        console.log('admin added in role collection');
      });
    }
  });
}

app.get('/', function (req, res) {
  res.json({ message: 'teste' })
});

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

const PORT  = process.env.PORT || 8080;
app.listen(PORT, function () {
  console.log(`Listening in localhost:${PORT}`);
});