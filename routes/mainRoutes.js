const express = require('express');
const router  = express.Router();

router.get('/', (req, res) =>
  res.render('index', { page: 'home', title: 'Tureko' }));

router.get('/services', (req, res) =>
  res.render('services', { page: 'services', title: 'Services | Tureko' }));

router.get('/contact', (req, res) =>
  res.render('contact', { page: 'contact', title: 'Request a Quote | Tureko' }));

router.get('/careers', (req, res) =>
  res.render('careers', { page: 'careers', title: 'Careers | Tureko' }));

router.get('/commitment', (req, res) =>
  res.render('commitment', { page: 'commitment', title: 'Climate Commitment | Tureko' }));

module.exports = router;
