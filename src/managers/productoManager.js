import paths from "../utils/paths.js";
import { readJsonFile, writeJsonFile, deleteFile } from "../utils/fileHandler.js";
import { generateId } from "../utils/collectionHandler.js";
import { convertToBoolean } from "../utils/converter.js";
import ErrorManager from "./ErrorManager.js";
export default class productoManager{
    #jsonFilename;
    #productos;
    constructor(){
        this.#jsonFilename="productos.json";
    }
    async #findOneById(id) {
        this.#productos = await this.getAll();
        const ProductoFound = this.#productos.find((item) => item.id === Number(id));

        if (!ProductoFound) {
            throw new ErrorManager("ID no encontrado", 404);
        }

        return ProductoFound;
    }
    async getAll() {
        try {
            this.#productos = await readJsonFile(paths.files, this.#jsonFilename);
            return this.#productos;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }
    async getOneById(id) {
        try {
            const ProductoFound = await this.#findOneById(id);
            return ProductoFound;
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

            const producto = {
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

            this.#productos.push(producto);
            await writeJsonFile(paths.files, this.#jsonFilename, this.#productos);

            return producto;
        } catch (error) {
            if (file?.filename) await deleteFile(paths.images, file.filename); // Elimina la imagen si ocurre un error
            throw new ErrorManager(error.message, error.code);
        }
    }
    async updateOneById(id, data, file) {
        try {
            const { title, description, code, price, status, stock, category } = data;
            const ProductoFound = await this.#findOneById(id);
            const newThumbnails = files?.map((file) => file.filename) || ProductoFound.thumbnails;

            const producto = {
                id: ProductoFound.id,
                title: title || ProductoFound.title,
                description: description || ProductoFound.description,
                code: code || ProductoFound.code,
                price: price !== undefined ? Number(price) : ProductoFound.price,
                status: status !== undefined ? convertToBoolean(status) : ProductoFound.status,
                stock: stock !== undefined ? Number(stock) : ProductoFound.stock,
                category: category || ProductoFound.category,
                thumbnails: newThumbnails.length > 0 ? newThumbnails : ProductoFound.thumbnails,
            };

            const index = this.#productos.findIndex((item) => item.id === Number(id));
            this.#productos[index] = producto;
            await writeJsonFile(paths.files, this.#jsonFilename, this.#productos);

            // Elimina la imagen anterior si es distinta de la nueva
            if (file?.filename && newThumbnail !== ProductoFound.thumbnail) {
                await deleteFile(paths.images, productoFound.thumbnail);
            }

            return producto;
        } catch (error) {
            if (file?.filename) await deleteFile(paths.images, file.filename); // Elimina la imagen si ocurre un error
            throw new ErrorManager(error.message, error.code);
        }
    }
    async deleteOneById (id) {
        try {
            const productoFound = await this.#findOneById(id);

            // Si tiene thumbnail definido, entonces, elimina la imagen del ingrediente
            if (productoFound.thumbnail) {
                await deleteFile(paths.images, productoFound.thumbnail);
            }

            const index = this.#productos.findIndex((item) => item.id === Number(id));
            this.#productos.splice(index, 1);
            await writeJsonFile(paths.files, this.#jsonFilename, this.#productos);
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }
}