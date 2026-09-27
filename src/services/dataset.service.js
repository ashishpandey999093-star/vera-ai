import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import {
    setStoredContext
} from "../store/context.store.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const datasetPath = path.join(__dirname, "../../dataset");

export const loadMerchants = () => {
    const filePath = path.join(
        datasetPath,
        "merchants_seed.json"
    );

    const data = JSON.parse(
        fs.readFileSync(filePath, "utf-8")
    );

    for (const merchant of data.merchants) {
        setStoredContext(
            "merchant",
            merchant.merchant_id,
            {
                version: 1,
                payload: merchant
            }
        );
    }
};
export const loadCategories = () => {
    const categoriesPath = path.join(
        datasetPath,
        "categories"
    );

    const files = fs.readdirSync(categoriesPath);

    for (const file of files) {
        if (!file.endsWith(".json")) {
            continue;
        }

        const filePath = path.join(
            categoriesPath,
            file
        );

        const category = JSON.parse(
            fs.readFileSync(filePath, "utf-8")
        );

        setStoredContext(
            "category",
            category.slug,
            {
                version: 1,
                payload: category
            }
        );
    }
};
export const loadCustomers = () => {
    const filePath = path.join(
        datasetPath,
        "customers_seed.json"
    );

    const data = JSON.parse(
        fs.readFileSync(filePath, "utf-8")
    );

    for (const customer of data.customers) {
        setStoredContext(
            "customer",
            customer.customer_id,
            {
                version: 1,
                payload: customer
            }
        );
    }
};
export const loadTriggers = () => {
    const filePath = path.join(
        datasetPath,
        "triggers_seed.json"
    );

    const data = JSON.parse(
        fs.readFileSync(filePath, "utf-8")
    );

    for (const trigger of data.triggers) {
        setStoredContext(
            "trigger",
            trigger.id,
            {
                version: 1,
                payload: trigger
            }
        );
    }
};
export const loadDataset = () => {
    loadMerchants();
    loadCategories();
    loadCustomers();
    loadTriggers();

    console.log("Challenge dataset loaded");
};