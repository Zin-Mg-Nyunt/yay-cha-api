import express from "express";
import prisma from "../prisma/PrismaClient.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: true,
        comments: true,
      },
      orderBy: {
        id: "desc",
      },
      take: 10,
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const post = await prisma.post.findUnique({
      where: { id: Number(id) },
      include: {
        author: true,
        comments: {
          include: {
            author: true,
          },
        },
      },
    });
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/create", async (req, res) => {
  const { body, authorId } = req.body;
  if (!body || !authorId) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const post = await prisma.post.create({
      data: { body, authorId },
    });
    if (!post) {
      return res.status(400).json({ error: "Failed to create post" });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { body, authorId } = req.body;
  if (!body || !authorId) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const post = await prisma.post.update({
      where: { id: Number(id) },
      data: { body, authorId },
    });
    if (!post) {
      return res.status(400).json({ error: "Failed to update post" });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.post.delete({
      where: { id: Number(id) },
    });
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
