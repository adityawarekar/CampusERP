import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    res.json({
        message: "All students"
    });
});

export default router;