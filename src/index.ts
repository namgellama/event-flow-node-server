import express, { Request, Response } from "express";

const app = express();

const PORT = 8000;

app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({
        status: "ok",
    });
});

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});
