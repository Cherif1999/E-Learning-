import { Select, Button, Avatar, Badge } from 'antd';

const { Option } = Select;

const CourseCreateForm = ({
  handleSubmit,
  handleImage,
  handleVideo,
  handleChange,
  values,
  setValues,
  preview,
  videoPreview,
  uploadButtonText,
  uploadVideoButtonText,
  handleImageRemove,
  handleVideoRemove,
}) => {
  const children = [];
  for (let i = 9.99; i <= 100.99; i++) {
    children.push(<Option key={i.toFixed(2)}>${i.toFixed(2)}</Option>);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="text"
          name="name"
          className="form-control"
          placeholder="Name"
          value={values.name}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <textarea
          name="description"
          cols="7"
          rows="7"
          value={values.description}
          className="form-control"
          onChange={handleChange}
          placeholder="Description"
        ></textarea>
      </div>

      <div className="form-row">
        <div className="col">
          <div className="form-group">
            <Select
              style={{ width: '100%' }}
              size="large"
              value={values.paid}
              onChange={(v) => setValues({ ...values, paid: v, price: 0 })}
            >
              <Option value={true}>Paid</Option>
              <Option value={false}>Free</Option>
            </Select>
          </div>
        </div>

        {values.paid && (
          <div className="col">
            <div className="form-group">
              <Select
                defaultValue="$9.99"
                style={{ width: '100%' }}
                onChange={(v) => setValues({ ...values, price: v })}
                tokenSeparators={[,]}
                size="large"
              >
                {children}
              </Select>
            </div>
          </div>
        )}
      </div>

      <div className="form-group">
        <input
          type="text"
          name="category"
          className="form-control"
          placeholder="Category"
          value={values.category}
          onChange={handleChange}
        />
      </div>

      <div className="form-row align-items-center">
        {/* Image upload */}
        <div className="col">
          <div className="form-group">
            <label className="btn btn-outline-secondary btn-block text-left">
              {uploadButtonText}
              <input
                type="file"
                name="image"
                onChange={handleImage}
                accept="image/*"
                hidden
              />
            </label>
          </div>
        </div>

        {preview && (
          <div className="col">
            <Badge count="X" onClick={handleImageRemove} className="pointer">
              <Avatar width={200} src={preview} />
            </Badge>
          </div>
        )}

        {/* Video upload */}
        <div className="col">
          <div className="form-group">
            <label className="btn btn-outline-secondary btn-block text-left">
              {uploadVideoButtonText}
              <input
                type="file"
                name="video"
                onChange={handleVideo}
                accept="video/*"
                hidden
              />
            </label>
          </div>
        </div>

        {videoPreview && (
          <div className="col">
            <Badge count="X" onClick={handleVideoRemove} className="pointer">
              {/* Display a placeholder for video preview */}
              <video width="200" controls>
                <source src={videoPreview} type="video/mp4" />
                Your browser does not support HTML5 video.
              </video>
            </Badge>
          </div>
        )}
      </div>

      <div className="row">
        <div className="col">
          <Button
            onClick={handleSubmit}
            disabled={values.loading || values.uploading}
            loading={values.loading}
            type="primary"
            size="large"
            shape="round"
          >
            {values.loading ? 'Saving...' : 'Save & Continue'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CourseCreateForm;
