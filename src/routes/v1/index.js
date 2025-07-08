const express = require('express');
const authRoute = require('./auth.route');
const uploadRoute = require('./upload.route');
const userRoute = require('./user.route');
const projectRoute = require('./project.route');
const homeRoute = require('./home.route');
const proposalRoute = require('./proposal.route');
const teamRoute = require('./team.route');
const collectRoute = require('./collect.route');

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
    path: '/projects',
    route: projectRoute,
  },
  {
    path: '/home',
    route: homeRoute,
  },
  {
    path: '/team',
    route: teamRoute,
  },
  {
    path: '/proposal',
    route: proposalRoute,
  },
  {
    path: '/upload',
    route: uploadRoute,
  },
  {
    path: '/collect',
    route: collectRoute,
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
