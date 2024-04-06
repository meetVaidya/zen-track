'use client';

import { scrapeAndStoreFunction } from '@/lib/actions';
import { url } from 'inspector';
import React, { FormEvent } from 'react';
import { useState } from 'react';

const isValidAmazonProductURL = (url: string) => {
    try {
        const parsedURL = new URL(url);
        const hostname = parsedURL.hostname;

        if (
            hostname.includes('amazon.com') ||
            hostname.includes('amazon.') ||
            hostname.endsWith('amazon')
        ) {
            return true;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
    return false;
};

const Searchbar = () => {
    const [searchPrompt, setSearchPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(searchPrompt);

        const isValidLink = isValidAmazonProductURL(searchPrompt);
        if (!isValidLink) {
            alert('Invalid Amazon product URL');
            return;
        }

        try {
            setIsLoading(true);

            //scrape the product page
            const product = await scrapeAndStoreFunction(searchPrompt);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className="flex flex-wrap gap-4 mt-12" onSubmit={handleSubmit}>
            <input
                type="text"
                value={searchPrompt}
                onChange={(e) => setSearchPrompt(e.target.value)}
                placeholder="Enter product link..."
                className="searchbar-input"
            />
            <button type="submit" className="searchbar-btn" disabled={searchPrompt === ''}>
                {isLoading ? 'Loading...' : 'Track'}
            </button>
        </form>
    );
};

export default Searchbar;
