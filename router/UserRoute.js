import express from "express";
import prisma from "../prisma/PrismaClient.js";
import bcrypt from "bcrypt";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        posts: true,
        comments: true,
      },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      include: {
        posts: {
          include: {
            author: true,
            comments: true,
          },
        },
        comments: {
          include: {
            author: true,
          },
        },
      },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/create", async (req, res) => {
  const { name, password, username, bio } = req.body;
  if (!name || !password || !username) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: { name, password: hashedPassword, username, bio },
    });
    if (!user) {
      return res.status(400).json({ error: "Failed to create user" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { name, password, username, bio } = req.body;
  if (!name || !password || !username) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: { name, password: hashedPassword, username, bio },
    });
    if (!user) {
      return res.status(400).json({ error: "Failed to update user" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.delete({
      where: { id: Number(id) },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
