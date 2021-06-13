const fortune = require('./fortune');

const VALID_EMAIL_REGEX = new RegExp(
  "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@" +
    '[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?' +
    '(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$'
);


class NewsletterSignup {
  constructor({ name, email }) {
    this.name = name;
    this.email = email;
  }

  async save() {}
}

exports.api = {};

exports.home = (req, res) => {
  res.cookie('signed_monster', 'tom & jerry', {
    signed: true,
    expires: new Date(Date.now() + 5000),
    secure: true,
  });
  req.session.userName = 'banana';

  console.log(req.signedCookies.signed_monster, 'signed cookies');
  res.render('home');
};

exports.about = (req, res) => res.render('about', { fortune: fortune.getFortune() });

// *** these handlers are for browser-submitted forms
exports.newsletterSignup = (req, res) => {
  res.render('newsletter-signup', { csrf: 'CSRF token goes here' });
};
exports.newsletterSignupProcess = (req, res) => {
  console.log(`CSRF token (from hidden form field): ${req.body._csrf}`);
  console.log(`Name (from visible form field): ${req.body.name}`);
  console.log(`Email (from visible form field): ${req.body.email}`);

  const name = req.body.name || '';
  const email = req.body.email || '';

  if (!VALID_EMAIL_REGEX.test(email)) {
    req.session.flash = {
      type: 'danger',
      intro: 'Validation error!',
      message: 'The email address you entered was not valid',
    };
    return res.redirect(303, '/newsletter-signup');
  }
  new NewsletterSignup({ name, email }).save()
    .then(() => {
      req.session.flash = {
        type: 'success',
        intro: 'Thank you!',
        message: 'You have now been signed up for the newsletter.',
      };
      return res.redirect(303, '/newsletter-archive');
    })
    .catch(err => {
      console.error(err);
      req.session.flash = {
        type: 'danger',
        intro: 'Database error!',
        message: 'There was a database error; please try again later.',
      };
      return res.redirect(303, '/newsletter-archive');
    });
};
exports.newsletterSignupThankYou = (req, res) => {
  res.render('newsletter-signup-thank-you');
};
exports.newsletterArchive = (req, res) => {
  res.render('newsletter-archive');
};
// *** end browser-submitted forms handlers

// *** these handlers are for fetch/JSON form handers
exports.newsletter = (req, res) => {
  res.render('newsletter', { csrf: 'CSRF token goes here' });
};
exports.api.newsletterSignup = (req, res) => {
  console.log(`CSRF token (from hidden form field): ${req.body._csrf}`);
  console.log(`Name (from visible form field): ${req.body.name}`);
  console.log(`Email (from visible form field): ${req.body.email}`);
  res.send({ result: 'success' });
};
// *** end fetch/JSON form handlers

exports.vacationPhotoContest = (req, res) => {
  const now = new Date();
  res.render('contest/vacation-photo', {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  });
};
exports.vacationPhotoContestProcess = (req, res, fields, files) => {
  console.log('field data: ', fields);
  console.log('files:', files);
  res.redirect(303, '/contest/vacation-photo-thank-you');
};
exports.vacationPhotoContestProcessThankYou = (req, res) => {
  res.render('contest/vacation-photo-thank-you');
};
exports.vacationPhotoContestAjax = (req, res) => {
  const now = new Date();
  res.render('contest/vacation-photo-ajax', {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  });
};
exports.api.vacationPhotoContest = (req, res, fields, files) => {
  console.log('field data: ', fields);
  console.log('files: ', files);
  res.send({ result: 'success' });
};
exports.api.vacationPhotoContestError = (req, res, message) => {
  res.send({ result: 'error', error: message });
};

exports.notFound = (req, res) => res.render('404');

// Express recognizes the error handler by way of its four
// argumetns, so we have to disable ESLint's no-unused-vars rule
/* eslint-disable no-unused-vars */
exports.serverError = (err, req, res, next) => res.render('500');
/* eslint-enable no-unused-vars */