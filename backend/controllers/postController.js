const { uploadFileToCloudinary } = require("../config/cloudinary");
const Post = require("../model/Post");
const Story = require("../model/story");
const response = require("../utils/responseHandler");

const createPost = async (req, res) => {
  try {
    const userId = req.user.userId;
    // console.log('this is my auth user id',userId);

    const { content } = req.body;
    const file = req.file;
    let mediaUrl = null;
    let mediaType = null;

    if (file) {
      const uploadResult = await uploadFileToCloudinary(file);
      // console.log('upload file', uploadResult)
      mediaUrl = uploadResult?.secure_url;
      mediaType = file.mimetype.startsWith("video") ? "video" : "image";
    }

    //create a new post
    const newPost = await new Post({
      user: userId,
      content,
      mediaUrl,
      mediaType,
      likeCount: 0,
      commentCount: 0,
      shareCount: 0,
    });

    await newPost.save();
    return response(res, 201, "Post created successfully", newPost);
  } catch (error) {
    console.log("error creating post", error);
    return response(res, 500, "Internal server error", error.message);
  }
};

//create story

const createStory = async (req, res) => {
  try {
    const userId = req.user.userId;
    // console.log('this is my auth user id',userId);

    const file = req.file;

    if (!file) {
      return response(res, 400, "File is required to create a story");
    }
    let mediaUrl = null;
    let mediaType = null;

    if (file) {
      const uploadResult = await uploadFileToCloudinary(file);
      // console.log('upload file', uploadResult)
      mediaUrl = uploadResult?.secure_url;
      mediaType = file.mimetype.startsWith("video") ? "video" : "image";
    }

    //create a new story
    const newStory = await new Story({
      user: userId,

      mediaUrl,
      mediaType,
    });

    await newStory.save();
    return response(res, 201, "Story created successfully", newStory);
  } catch (error) {
    console.log("error creating story", error);
    return response(res, 500, "Internal server error", error.message);
  }
};

//get all story
const getAllStory = async (req, res) => {
  try {
    const story = await Story.find()
      .sort({
        createdAt: -1,
      })
      .populate("user", "_id username profilePicture email");

    return response(res, 201, "Get all stories successfully ", story);
  } catch (error) {
    console.log("error getting stories", error);
    return response(res, 500, "internal server error", error.message);
  }
};

//get all posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({
        createdAt: -1,
      })
      .populate("user", "_id username profilePicture email")
      .populate({
        path: "comments.user",
        select: "username, profilePicture",
      });
    return response(res, 201, "Get all posts successfully ", posts);
  } catch (error) {
    console.log("error getting posts", error);
    return response(res, 500, "internal server error", error.message);
  }
};

//get posts by userid
const getPostByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    if (!userId) {
      return response(res, 400, "UserId is required to get user post");
    }

    const posts = await Post.find({ user: userId })
      .sort({
        createdAt: -1,
      })
      .populate("user", "_id username profilePicture email")
      .populate({
        path: "comments.user",
        select: "username, profilePicture",
      });
    return response(res, 201, "Get user posts successfully", posts);
  } catch (error) {
    console.log("error getting posts", error);
    return response(res, 500, "internal server error", error.message);
  }
};

//like post api
const likePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.userId;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return response(res, 404, "Post not found");
    }
    const hasliked = post.likes.includes(userId);
    if (hasliked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
      post.likeCount = Math.max(0, post.likeCount - 1); //ensure likeCount does not become negative
    } else {
      post.likes.push(userId);
      post.likeCount += 1;
    }

    //save the likes in the updated post
    const updatedpost = await post.save();
    return response(
      res,
      201,
      hasliked ? "Post unliked successfully" : "Post liked successfully",
      updatedpost
    );
  } catch (error) {
    console.log(error);
    return response(res, 500, "internal server error", error.message);
  }
};

//post comments by user
const addCommentToPost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.userId;
  const { text } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return response(res, 404, "Post not found");
    }

    post.comments.push({ user: userId, text });
    post.commentCount += 1;

    //save the post with new comments
    await post.save();
    return response(res, 201, "comments addede successfully", post);
  } catch (error) {
    console.log(error);
    return response(res, 500, "internal server error", error.message);
  }
};

//share on post by user
const sharePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.userId;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return response(res, 404, "Post not found");
    }
    const hasUserShared = post.share.includes(userId);
    if (!hasUserShared) {
      post.share.push(userId);
    }
    post.shareCount += 1;

    //save the share in the updated post
    await post.save();
    return response(res, 201, "post shared successfully", post);
  } catch (error) {
    console.log(error);
    return response(res, 500, "internal server error", error.message);
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostByUserId,
  likePost,
  addCommentToPost,
  sharePost,
  createStory,
  getAllStory
};
