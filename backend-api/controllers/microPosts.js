import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

// This is a simple example for providing basic CRUD routes for
// a resource/model. It provides the following:
//    GET    /api/micro_posts
//    POST   /api/micro_posts
//    GET    /api/micro_posts/:id
//    PUT    /api/micro_posts/:id
//    DELETE /api/micro_posts/:id
//
// The full URL's for these routes are composed by combining the
// prefixes used to load the controller files.
//    /api comes from the file /app.js
//    /micro_posts comes from the file /controllers/index.js

router.get("/", async (req, res) => {
  const allPosts = await prisma.microPost.findMany();
  res.json(allPosts);
});

router.post("/", async (req, res) => {
  let { content } = req.body;

  try {
    const newPost = await prisma.microPost.create({ data: { content } });
    res.status(201).json(newPost);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const post = await prisma.microPost.findUnique({ where: { id } });
    if (!post) {
      return res.sendStatus(404);
    }
    res.json(post);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    const updatedPost = await prisma.microPost.update({
      data: { content },
      where: { id },
    });
    res.json(updatedPost);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.microPost.delete({ where: { id } });
    res.sendStatus(204);
  } catch (err) {
    res.status(400).json(err);
  }
});

export default router;
