import paths from "../utils/paths.js";
import { readJsonFile, writeJsonFile, deleteFile } from "../utils/fileHandler.js";
import { generateId } from "../utils/collectionHandler.js";
import { convertToBoolean } from "../utils/converter.js";
import ErrorManager from "./ErrorManager.js";
export default class cartsManager{
    #jsonFilename;
    #carts;
    constructor(){
        this.#jsonFilename="carts.json";
    }
    async #findOneById(id) {
        this.#carts = await this.getAll();
        const cartFound = this.#carts.find((item) => item.id === Number(id));

        if (!cartFound) {
            throw new ErrorManager("ID no encontrado", 404);
        }

        return cartFound;
    }
    async getAll() {
        try {
            this.#carts = await readJsonFile(paths.files, this.#jsonFilename);
            return this.#carts;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }
    async getOneById(id) {
        try {
            const cartFound = await this.#findOneById(id);
            return cartFound;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }
    async insertOne(data, file) {
        try {
            const { title, description, code, price, status, stock, category, thumbnail } = data;

            if (!title || !status || !stock ||!description||!code||!price||!category||!thumbnail ) {
                throw new ErrorManager("Faltan datos obligatorios", 400);
            }

            if (!file?.filename) {
                throw new ErrorManager("Falta el archivo de la imagen", 400);
            }

            const cart = {
                id: generateId(await this.getAll()),
                title,
                description,
                code,
                price,
                category,
                status: convertToBoolean(status),
                stock: Number(stock),
                thumbnail: file?.filename,
            };

            this.#carts.push(cart);
            await writeJsonFile(paths.files, this.#jsonFilename, this.#carts);

            return cart;
        } catch (error) {
            if (file?.filename) await deleteFile(paths.images, file.filename); // Elimina la imagen si ocurre un error
            throw new ErrorManager(error.message, error.code);
        }
    }
}