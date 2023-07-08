"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginPage = exports.signupPage = exports.serverErrorPage = exports.clientErrorPage = exports.success = exports.homepage = void 0;
// @route GET /scissor/homepage
// @desc render homepage
function homepage(req, res) {
    try {
        res.status(200).render('index', { isDashboard: false });
    }
    catch (err) {
        res.status(500).render('500-page', { isDashboard: false });
        if (err instanceof Error)
            return console.log(err.message);
        console.log(err);
    }
}
exports.homepage = homepage;
// @route GET /scissor/success
// @desc render signup-success page
function success(req, res) {
    try {
        res.status(200).render('success', { isDashboard: false });
    }
    catch (err) {
        res.status(500).render('500-page', { isDashboard: false });
        if (err instanceof Error)
            return console.log(err.message);
        console.log(err);
    }
}
exports.success = success;
// @route GET /scissor/404-page
// @desc render 404-error page
function clientErrorPage(req, res) {
    try {
        res.status(404).render('404-page', { isDashboard: false });
    }
    catch (err) {
        res.status(500).render('500-page', { isDashboard: false });
        if (err instanceof Error)
            return console.log(err.message);
        console.log(err);
    }
}
exports.clientErrorPage = clientErrorPage;
// @route GET /scissor/500-page
// @desc render 500-error page
function serverErrorPage(req, res) {
    try {
        res.status(404).render('500-page', { isDashboard: false });
    }
    catch (err) {
        res.status(500).render('500-page', { isDashboard: false });
        if (err instanceof Error)
            return console.log(err.message);
        console.log(err);
    }
}
exports.serverErrorPage = serverErrorPage;
// @route GET /scissor/signup
// @desc render signup page
function signupPage(req, res) {
    try {
        res.render('signup', { isDashboard: false });
    }
    catch (err) {
        res.status(500).render('500-page', { isDashboard: false });
        if (err instanceof Error)
            return console.log(err.message);
        console.log(err);
    }
}
exports.signupPage = signupPage;
// @route GET /scissor/login
// @desc render login page
function loginPage(req, res) {
    try {
        res.render('login', { isDashboard: false });
    }
    catch (err) {
        res.status(500).render('500-page', { isDashboard: false });
        if (err instanceof Error)
            return console.log(err.message);
        console.log(err);
    }
}
exports.loginPage = loginPage;
