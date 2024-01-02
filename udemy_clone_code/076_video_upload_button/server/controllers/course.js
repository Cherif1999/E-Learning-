import multer from 'multer';
import { nanoid } from 'nanoid';
import Course from '../models/course';
import slugify from 'slugify';


const imageStorage = multer.memoryStorage();
const imageUpload = multer({
  storage: imageStorage,
  limits: {
    fileSize: 1024 * 1024 * 5, // Limit file size to 5MB (adjust as needed)
  },
}).single('image');

const videoStorage = multer.memoryStorage();
const videoUpload = multer({
  storage: videoStorage,
  limits: {
    fileSize: 1024 * 1024 * 50, // Limit file size to 50MB (adjust as needed)
  },
}).single('video');

export const uploadImage = (req, res) => {
  imageUpload(req, res, async (err) => {
    try {
      if (err instanceof multer.MulterError || err) {
        return res.status(400).send('Error uploading image');
      }

      if (!req.file) {
        return res.status(400).send('No image uploaded');
      }

      const courseId = req.body.courseId; // Assuming courseId is sent in the request body

      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).send('Course not found');
      }

      course.image.data = req.file.buffer;
      course.image.contentType = req.file.mimetype;
      await course.save();

      res.send('Image uploaded successfully');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error processing image');
    }
  });
};

export const uploadVideo = (req, res) => {
  videoUpload(req, res, async (err) => {
    try {
      if (err instanceof multer.MulterError || err) {
        return res.status(400).send('Error uploading video');
      }

      if (!req.file) {
        return res.status(400).send('No video uploaded');
      }

      const courseId = req.body.courseId; // Assuming courseId is sent in the request body

      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).send('Course not found');
      }

      course.video.data = req.file.buffer;
      course.video.contentType = req.file.mimetype;
      await course.save();

      res.send('Video uploaded successfully');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error processing video');
    }
  });
};
export const create = async (req, res) => {
  try {
    const alreadyExist = await Course.findOne({
      slug: slugify(req.body.name.toLowerCase()),
    });
    if (alreadyExist) return res.status(400).send('Title is taken');

    const course = await new Course({
      slug: slugify(req.body.name),
      instructor: req.user._id,
      ...req.body,
    }).save();

    res.json(course);
  } catch (err) {
    console.log(err);
    return res.status(400).send('Course create failed. Try again.');
  }
};

export const read = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug })
      .populate('instructor', '_id name')
      .exec();
    res.json(course);
  } catch (err) {
    console.log(err);
    res.status(500).send('Error fetching course');
  }
};
