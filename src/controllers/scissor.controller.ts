import { Request, Response } from "express";

// @route GET /scissor/homepage
// @desc render homepage
function homepage(req: Request, res: Response) {
    try {
        res.status(200).render('index', { isDashboard: false });
    } catch (err) {
        res.status(500).render('500-page', { isDashboard: false });
        if (err instanceof Error) return console.log(err.message);
        console.log(err);
    }
}
// @route GET /scissor/success
// @desc render signup-success page
function success(req: Request, res: Response) {
    try {
        res.status(200).render('success', { isDashboard: false });
    } catch (err) {
        res.status(500).render('500-page', { isDashboard: false });
        if (err instanceof Error) return console.log(err.message);
        console.log(err);
    }
}
// @route GET /scissor/404-page
// @desc render 404-error page
function clientErrorPage(req: Request, res: Response) {
    try {
        res.status(404).render('404-page', { isDashboard: false });
    } catch (err) {
        res.status(500).render('500-page', { isDashboard: false });
        if (err instanceof Error) return console.log(err.message);
        console.log(err);
    }
}
// @route GET /scissor/500-page
// @desc render 500-error page
function serverErrorPage(req: Request, res: Response) {
  try {
      res.status(404).render('500-page', { isDashboard: false });
  } catch (err) {
      res.status(500).render('500-page', { isDashboard: false });
      if (err instanceof Error) return console.log(err.message);
      console.log(err);
  }
}
// @route GET /scissor/signup
// @desc render signup page
function signupPage(req: Request, res: Response) {
    try {
        res.render('signup', { isDashboard: false });
    } catch (err) {
        res.status(500).render('500-page', { isDashboard: false });
        if (err instanceof Error) return console.log(err.message);
        console.log(err);
    }
}
// @route GET /scissor/login
// @desc render login page
function loginPage(req: Request, res: Response) {
    try {
        res.render('login', { isDashboard: false });
    } catch (err) {
        res.status(500).render('500-page', { isDashboard: false });
        if (err instanceof Error) return console.log(err.message);
        console.log(err);
    }
}

export { homepage, success, clientErrorPage, serverErrorPage, signupPage, loginPage, };