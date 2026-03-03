import { Router, type Request, type Response } from "express";
const router = Router();

router.get("/users", (req: Request, res: Response) => {
  try {
  } catch (e: unknown) {
    res.status(500).json("Falha ao obter usuários: " + e);
  }
});
