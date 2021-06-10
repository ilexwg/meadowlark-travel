const express = require('express');
const expressHandlebars = require('express-handlebars');

const handlers = require('./lib/handlers');
const weatherMiddleware = require('./lib/middleware/weather');

const app = express();

app.engine('handlebars', expressHandlebars({
  defaultLayout: 'main',
  helpers: {
    section(name, options) {
      if (!this._section) {
        this._section = {};
      }
      this._section[name] = options.fn(this);
      return null;
    },
  },
}));
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));

app.use(weatherMiddleware);

const port = process.env.PORT || 3000;

app.get('/', handlers.home);

app.get('/about', handlers.about);

// custom 404 page
app.use(handlers.notFound);

// custom 500 page
app.use(handlers.serverError);

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Express started on http://localhost:${port}`);
    console.log('Press Ctrl-C to terminate.');
  });
} else {
  module.exports = app;
}
