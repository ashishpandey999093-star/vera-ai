import { getStoredContext } from "../store/context.store.js";

export const buildTickContext = (triggerId) => {
    // 1. Get the trigger
    const trigger = getStoredContext("trigger", triggerId);

    if (!trigger) {
        return {
            error: "trigger_not_found"
        };
    }

    // 2. Get merchant ID from trigger
    const merchantId = trigger.payload?.merchant_id;
    if (!merchantId) {
        return {
            error: "merchant_id_missing"
        };
    }

    // 3. Get merchant
    const merchant = getStoredContext("merchant", merchantId);

    if (!merchant) {
        return {
            error: "merchant_not_found"
        };
    }

    // 4. Get category ID from merchant
    const categorySlug = merchant.payload?.category_slug;

    if (!categorySlug) {
        return {
            error: "category_missing"
        };
    }

    // 5. Get category
    const category = getStoredContext("category", categorySlug);

    if (!category) {
        return {
            error: "category_not_found"
        };
    }

    // 6. Customer is optional
    const customerId = trigger.payload?.customer_id;
    let customer = null;

    if (customerId) {
        customer = getStoredContext("customer", customerId);

        if (!customer) {
            return {
                error: "customer_not_found"
            };
        }
    }

    // 7. Return everything Vera needs
    return {
        trigger: trigger.payload,
        merchant: merchant.payload,
        category: category.payload,
        customer: customer?.payload ?? null
    };
};