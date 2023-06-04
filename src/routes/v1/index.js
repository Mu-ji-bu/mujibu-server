const express = require('express');
const authRoute = require('./auth.route');
const uploadRoute = require('./upload.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
// const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/upload',
    route: uploadRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
// if (config.env === 'development') {
// TODO: on prod remove toggle line comment
devRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
// }

module.exports = router;
