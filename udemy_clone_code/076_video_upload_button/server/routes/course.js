import express from 'express';
const router = express.Router();

// middleware
import { requireSignin, isInstructor } from '../middlewares';

// controllers
import { uploadImage, uploadVideo , create, read } from '../controllers/course';

// image
router.post('/course/upload-image', uploadImage);

// router.delete("/course/remove-image", removeImage)

// video
router.post('/course/upload-video', uploadVideo);

//router.delete("/course/remove-video", removeVideo);

// course
router.post('/course', requireSignin, isInstructor, create);
router.get('/course/:slug', read);

module.exports = router;
