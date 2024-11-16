import { Router } from "express";
import cartsManager from "../managers/cartsManager.js";

const router = Router();
const CartManager = new cartsManager();

// Ruta para obtener las recetas
router.get("/", async (req, res) => {
    try {
        const carts = await CartManager.getAll(req.query);
        res.status(200).json({ status: "success", payload: carts });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});

// Ruta para obtener una receta en específico por su ID
router.get("/:id", async (req, res) => {
    try {
        const cart = await CartManager.getOneById(req.params.id);
        res.status(200).json({ status: "success", payload: cart });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});

// Ruta para crear una receta
router.post("/", async (req, res) => {
    try {
        const cart = await CartManager.insertOne(req.body);
        res.status(201).json({ status: "success", payload: cart });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});

// Ruta para incrementar en una unidad o agregar un ingrediente específico en una receta por su ID
router.post("/:cid/ingredients/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const cart = await CartManager.addOneIngredient(cid, pid, quantity || 1);
        res.status(200).json({ status: "success", payload: cart });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});

export default router;