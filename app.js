require('dotenv').config();
const express    = require('express');
const helmet     = require('helmet');
const rateLimit  = require('express-rate-limit');
const path       = require('path');
const mainRoutes = require('./routes/mainRoutes');

const app = express();

// ── Helmet (security headers) ──────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc:  ["'self'"],
      styleSrc:    ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc:     ["'self'", "https://fonts.gstatic.com"],
      scriptSrc:   ["'self'", "'unsafe-inline'"],
      imgSrc:      ["'self'", "data:", "blob:"],
      formAction:  ["'self'", "https://formspree.io"],
      connectSrc:  ["'self'", "https://formspree.io"],
    },
  },
  xPoweredBy: false,
}));

// ── Rate limiting: 100 req / 15 min ───────────────────────
app.use(rateLimit({
  windowMs:       15 * 60 * 1000,
  max:            100,
  standardHeaders: true,
  legacyHeaders:  false,
  message:        'Too many requests. Please try again later.',
}));

// ── Body parsing ──────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));

// ── Static files ──────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1d',
  etag:   true,
}));

// ── View engine ───────────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ── Routes ────────────────────────────────────────────────
app.use('/', mainRoutes);

// ── 404 ──────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).render('index', {
    page:  'home',
    title: 'Tureko | Sustainable Tourism Workforce',
  });
});

// ── Error handler ─────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong. Please try again later.');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Tureko running on port ${PORT}`));
