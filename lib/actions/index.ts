'use server';

import { revalidatePath } from 'next/cache';
import Product from '../models/product.models';
import { connectToDB } from '../mongoose';
import { scrapeAmazonProduct } from '../scraper';
import { getHighestPrice, getLowestPrice } from '../utils';

export async function scrapeAndStoreFunction(productURL: string) {
    if (!productURL) {
        return;
    }

    try {
        connectToDB();

        //scrape the product page
        const scrapedProduct = await scrapeAmazonProduct(productURL);

        if (!scrapedProduct) return;

        let product = scrapedProduct;

        const existingProduct = await Product.findOne({
            url: scrapedProduct.url,
        });

        if (existingProduct) {
            const updatedPriceHistory: any = [
                ...existingProduct.priceHistory,
                { price: scrapedProduct.currentPrice },
            ];

            product = {
                ...scrapedProduct,
                priceHistory: updatedPriceHistory,
                lowestPrice: getLowestPrice(updatedPriceHistory),
                highestPrice: getHighestPrice(updatedPriceHistory),
                averagePrice: getAveragePrice(updatedPriceHistory),
            };
        }

        const newProduct = await Product.findOneAndUpdate(
            { url: scrapedProduct.url },
            product,
            { upsert: true, new: true }
        );

        revalidatePath(`product/${newProduct._id}`);
    } catch (error: any) {
        throw new Error(`Failed to scrape the product page: ${error.message}`);
    }
}

export async function getProductByID(productID: string) {
    try {
        connectToDB();

        const products = await Product.findOne({ _id: productID });

        if (!products) return null;

        return products;
    } catch (error) {}
}
