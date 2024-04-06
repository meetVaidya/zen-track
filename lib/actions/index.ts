'use server'

import { scrapeAmazonProduct } from "../scraper";

export async function scrapeAndStoreFunction (productURL: string) {
    if (!productURL) {
        return
    }

    try {
        //scrape the product page
        const scrapedProduct = await scrapeAmazonProduct(productURL);

        if (!scrapedProduct) return;

        //store the product in the database
    } catch (error: any) {
        throw new Error(`Failed to scrape the product page: ${error.message}`)
    }
}