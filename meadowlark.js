const express = require('express');
const expressHandlebars = require('express-handlebars');
const bodyParser = require('body-parser');

const handlers = require('./lib/handlers');
const weatherMiddleware = require('./lib/middleware/weather');

const app = express();

app.engine('handlebars', expressHandlebars({
  defaultLayout: 'main',
  helpers: {
    section(name, options) {
      if (!this._sections) {
        this._sections = {};
      }
      this._sections[name] = options.fn(this);
      return null;
    },
  },
}));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

app.use(weatherMiddleware);

const port = process.env.PORT || 3000;

app.get('/', handlers.home);
app.get('/about', handlers.about);

// handlers for browser-based form submission
app.get('/newsletter-signup', handlers.newsletterSignup);
app.post('/newsletter-signup/process', handlers.newsletterSignupProcess);
app.get('/newsletter-signup/thank-you', handlers.newsletterSignupThankYou);

// handlers for fetch/JSON form submission
app.get('/newsletter', handlers.newsletter);
app.post('/api/newsletter-signup', handlers.api.newsletterSignup);

app.use(handlers.notFound);
app.use(handlers.serverError);

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Express started on http://localhost:${port}`);
    console.log('Press Ctrl-C to terminate.');
  });
} else {
  module.exports = app;
}
