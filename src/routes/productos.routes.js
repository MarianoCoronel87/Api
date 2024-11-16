import { Router } from "express";
import productoManager from "../managers/productoManager.js";
import uploader from "../utils/uploader.js";

const router = Router();
const productManager = new productoManager();

// Ruta para obtener los productoes
router.get("/", async (req, res) => {
    try {
        const productos = await productManager.getAll(req.query);
        res.status(200).json({ status: "success", payload: productos });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});

// Ruta para obtener un productoe por su ID
router.get("/:id", async (req, res) => {
    try {
        const producto = await productManager.getOneById(req.params.id);
        res.status(200).json({ status: "success", payload: producto });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});

// Ruta para crear un productoe, permite la subida de imágenes
router.post("/", uploader.single("file"), async (req, res) => {
    try {
        const producto = await productManager.insertOne(req.body, req.file);
        res.status(201).json({ status: "success", payload: producto });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});

// Ruta para actualizar un productoe por su ID, permite la subida de imágenes
router.put("/:id", uploader.single("file"), async (req, res) => {
    try {
        const producto = await productManager.updateOneById(req.params.id, req.body, req.file);
        res.status(200).json({ status: "success", payload: producto });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});

// Ruta para eliminar un productoe por su ID
router.delete("/:id", async (req, res) => {
    try {
        await productManager.deleteOneById(req.params.id);
        res.status(200).json({ status: "success" });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});

export default router;