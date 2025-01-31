import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import apiRequest from "../../lib/apiRequest";
import UploadWidget from "../../components/uploadWidget/UploadWidget"; // Adjust the import path according to your project structure
import "./editPost.scss";

const EditPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState({
    title: "",
    price: "",
    description: "",
    income: "",
    school: "",
    bus: "",
    restaurant: "",
    images: [],
  });
  const [value, setValue] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await apiRequest.get(`/posts/${id}`);
        const { title, price, postDetail, images } = response.data;
        setPost({
          title,
          price,
          description: postDetail.desc,
          income: postDetail.income,
          school: postDetail.school,
          bus: postDetail.bus,
          restaurant: postDetail.restaurant,
          images,
        });
        setValue(postDetail.desc);
        setImages(images);
      } catch (err) {
        console.error("Failed to fetch post", err);
      }
    };

    fetchPost();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost({
      ...post,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiRequest.put(`/posts/${id}`, {
        postData: {
          title: post.title,
          price: parseInt(post.price),
          images: images,
        },
        postDetail: {
          desc: value,
          income: post.income,
          school: parseInt(post.school),
          bus: parseInt(post.bus),
          restaurant: parseInt(post.restaurant),
        },
      });
      navigate(`/profile`); // Navigate back to the profile page after updating
    } catch (err) {
      console.error("Failed to update post", err);
      setError("Failed to update post");
    }
  };

  return (
    <div className="editPost">
      <div className="formContainer">
        <h1>Edit Post</h1>
        <div className="wrapper">
          <form onSubmit={handleSubmit}>
            <div className="item">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                name="title"
                type="text"
                value={post.title}
                onChange={handleChange}
              />
            </div>
            <div className="item">
              <label htmlFor="price">Price</label>
              <input
                id="price"
                name="price"
                type="number"
                value={post.price}
                onChange={handleChange}
              />
            </div>
            <div className="item description">
              <label htmlFor="desc">Description</label>
              <ReactQuill theme="snow" onChange={setValue} value={value} />
            </div>
            
            <div className="item">
              <label htmlFor="school">School</label>
              <input
                id="school"
                name="school"
                type="number"
                value={post.school}
                onChange={handleChange}
              />
            </div>
            <div className="item">
              <label htmlFor="bus">Bus</label>
              <input
                id="bus"
                name="bus"
                type="number"
                value={post.bus}
                onChange={handleChange}
              />
            </div>
            <div className="item">
              <label htmlFor="restaurant">Restaurant</label>
              <input
                id="restaurant"
                name="restaurant"
                type="number"
                value={post.restaurant}
                onChange={handleChange}
              />
            </div>
            <button className="sendButton">Update</button>
            {error && <span>{error}</span>}
          </form>
        </div>
      </div>
      <div className="sideContainer">
        {images.map((image, index) => (
          <img src={image} key={index} alt="" />
        ))}
        <UploadWidget
          uwConfig={{
            multiple: true,
            cloudName: "lamadev",
            uploadPreset: "estate",
            folder: "posts",
          }}
          setState={setImages}
        />
      </div>
    </div>
  );
};

export default EditPostPage;
