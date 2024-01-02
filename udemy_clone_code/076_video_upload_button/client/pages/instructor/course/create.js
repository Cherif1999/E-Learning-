import { useState } from "react";
import axios from "axios";
import InstructorRoute from "../../../components/routes/InstructorRoute";
import CourseCreateForm from "../../../components/forms/CourseCreateForm";
import Resizer from "react-image-file-resizer";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { FastBackwardFilled } from "@ant-design/icons";

const CourseCreate = () => {
  // state
  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "9.99",
    uploading: false,
    paid: true,
    category: "",
    loading: false,
  });
  const [image, setImage] = useState({});
  const [video, setVideo] = useState({});
  const [preview, setPreview] = useState("");
  const [uploadButtonText, setUploadButtonText] = useState("Upload Image");

  // router
  const router = useRouter();

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    let file = e.target.files[0];
    setPreview(window.URL.createObjectURL(file));
    setUploadButtonText(file.name);
    setValues({ ...values, loading: true });
    // resize
    Resizer.imageFileResizer(file, 720, 500, "JPEG", 100, 0, async (uri) => {
      try {
        let { data } = await axios.post("/api/course/upload-image", {
          image: uri,
        });
        console.log("IMAGE UPLOADED", data);
        // set image in the state
        setImage(data);
        setValues({ ...values, loading: false });
      } catch (err) {
        console.log(err);
        setValues({ ...values, loading: false });
        toast("Image upload failed. Try later.");
      }
    });
  };

  const handleVideo = (e) => {
    let file = e.target.files[0];
    setPreview(window.URL.createObjectURL(file));
    setUploadButtonText(file.name);
    setValues({ ...values, loading: true });

    // Handle video upload
    const formData = new FormData();
    formData.append('video', file);

    axios.post("/api/course/upload-video", formData)
      .then(response => {
        console.log("VIDEO UPLOADED", response.data);
        // Set video in the state
        setVideo(response.data);
        setValues({ ...values, loading: false });
      })
      .catch(error => {
        console.error(error);
        setValues({ ...values, loading: false });
        toast("Video upload failed. Try later.");
      });
  };

  const handleImageRemove = async () => {
    try {
      setValues({ ...values, loading: true });
      const res = await axios.post("/api/course/remove-image", { image });
      setImage({});
      setPreview("");
      setUploadButtonText("Upload Image");
      setValues({ ...values, loading: false });
    } catch (err) {
      console.log(err);
      setValues({ ...values, loading: false });
      toast("Image removal failed. Try later.");
    }
  };
  const handleVideoRemove = async ()=> {
    try{
      setValues({...values, loading : true});
      const res = await axios.post("/api/cours/reemove-video", {video});
      setVideo({});
      setPreview("");
      setUploadButtonText("upload video");
      setValues({...values, loading : false})
    } catch (err) {
      console.log(err);
      setValues({...values, loading : false})
      toast("video removal failed. try again.")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/course", {
        ...values,
        image,
        video,
      });
      toast("Great! Now you can start adding lessons");
      router.push("/instructor");
    } catch (err) {
      toast(err.response.data);
    }
  };

  return (
    <InstructorRoute>
      <h1 className="jumbotron text-center square">Create Course</h1>
      <div className="pt-3 pb-3">
        <CourseCreateForm
          handleSubmit={handleSubmit}
          handleImage={handleImage}
          handleVideo={handleVideo} 
          handleChange={handleChange}
          values={values}
          setValues={setValues}
          preview={preview}
          uploadButtonText={uploadButtonText}
          handleImageRemove={handleImageRemove}
        />
      </div>
      <pre>{JSON.stringify(values, null, 4)}</pre>
      <hr />
      <pre>{JSON.stringify(image, null, 4)}</pre>
      <hr />
      <pre>{JSON.stringify(video, null, 4)}</pre>
    </InstructorRoute>
  );
};

export default CourseCreate;
