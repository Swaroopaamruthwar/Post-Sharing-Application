// Create a new post
const router = require("express").Router();
const Post = require("../models/post");
const auth = require("../middleware/authenticateUser");
router.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json({ posts });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});
router.post("/posts", auth, async (req, res) => {
  try {
    const { title, body, image } = req.body;
    const post = new Post({
      title,
      body,
      image,
      user: req.user.id, // get user id from the authenticated user
    });
    await post.save();
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Update a post
router.put("/posts/:postId", auth, async (req, res) => {
  try {
    const { title, body, image } = req.body;
    const post = await Post.findById(req.params.postId);
    console.log(post.user.toString());
    console.log(req.user.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    // check if the authenticated user owns the post
    if (post.user.toString() !== String(req.user.id)) {
      return res.status(403).json({ error: "UnAuthorized" });
    }
    post.title = title;
    post.body = body;
    post.image = image;
    await post.save();
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete a post
router.delete("/posts/:postId", auth, async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;

  try {
    const post = await Post.findOne({ _id: postId });
    if (!post) {
      return res.status(404).send({ message: "Post not found" });
    }
    if (String(post.user) !== String(userId)) {
      return res.status(403).send({ message: "Unauthorized" });
    }
    await Post.findByIdAndDelete(postId);
    res.status(200).send({ message: "Post deleted" });
  } catch (error) {
    res.status(500).send({ message: "Error deleting post", error });
  }
});

module.exports = router;
