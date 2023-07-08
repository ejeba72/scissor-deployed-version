// NOTE: Both the redirect endpoint and views endpoints share this route.
import { Router } from 'express';
import { getRedirect, homepageRedirect } from '../controllers/redirect.controller';

const router = Router();
router.get('', homepageRedirect);
router.get('/:code', getRedirect);

export { router as redirectRoute };