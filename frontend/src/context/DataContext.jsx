import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import { getFrames } from '../services/frameService';
import { toast } from 'react-toastify';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [featuredFrames, setFeaturedFrames] = useState([]);
    const [testimonials, setTestimonials] = useState([]);

    const [loading, setLoading] = useState({
        products: false,
        featured: false,
        testimonials: false
    });

    const [lastFetched, setLastFetched] = useState({
        products: 0,
        featured: 0,
        testimonials: 0
    });

    // Cache duration in milliseconds (e.g., 5 minutes)
    const CACHE_DURATION = 5 * 60 * 1000;

    const fetchProducts = useCallback(async (force = false) => {
        const now = Date.now();
        // Return cached data if valid and available OR if we recently fetched (even if empty)
        if (!force && (products.length > 0 || lastFetched.products > 0) && (now - lastFetched.products < CACHE_DURATION)) {
            return products;
        }

        setLoading(prev => ({ ...prev, products: true }));
        try {
            const data = await getFrames(1, 100, '', true);
            const frames = Array.isArray(data.frames) ? data.frames : [];
            setProducts(frames);
            setLastFetched(prev => ({ ...prev, products: Date.now() })); // Update timing
            return frames;
        } catch (error) {
            console.error('Error fetching products:', error);
            // Don't show toast on 429 to avoid spamming user
            if (error.response?.status !== 429) {
                toast.error('Failed to load products');
            }
            return [];
        } finally {
            setLoading(prev => ({ ...prev, products: false }));
        }
    }, [products, lastFetched.products]);

    const fetchFeaturedFrames = useCallback(async (force = false) => {
        const now = Date.now();
        if (!force && (featuredFrames.length > 0 || lastFetched.featured > 0) && (now - lastFetched.featured < CACHE_DURATION)) {
            return featuredFrames;
        }

        setLoading(prev => ({ ...prev, featured: true }));
        try {
            const data = await getFrames(1, 4, '', true);
            const frames = Array.isArray(data.frames) ? data.frames : [];
            const featured = frames.slice(0, 4);
            setFeaturedFrames(featured);
            setLastFetched(prev => ({ ...prev, featured: Date.now() }));
            return featured;
        } catch (error) {
            console.error('Error fetching featured frames:', error);
            return [];
        } finally {
            setLoading(prev => ({ ...prev, featured: false }));
        }
    }, [featuredFrames, lastFetched.featured]);

    const fetchTestimonials = useCallback(async (force = false) => {
        const now = Date.now();
        if (!force && (testimonials.length > 0 || lastFetched.testimonials > 0) && (now - lastFetched.testimonials < CACHE_DURATION)) {
            return testimonials;
        }

        setLoading(prev => ({ ...prev, testimonials: true }));
        try {
            const { data } = await axios.get('/api/feedback');

            const staticTestimonials = [
                {
                    _id: 'static-1',
                    user: { name: 'Sarah Johnson', profilePicture: null },
                    rating: 5,
                    comment: "The service at LensCare is outstanding! I found the perfect frames that match my style perfectly.",
                    createdAt: new Date('2023-09-15').toISOString()
                },
                {
                    _id: 'static-2',
                    user: { name: 'Michael Chen', profilePicture: null },
                    rating: 5,
                    comment: "I've been wearing glasses for 20 years, and these are by far the most comfortable frames I've ever owned.",
                    createdAt: new Date('2023-10-02').toISOString()
                },
                {
                    _id: 'static-3',
                    user: { name: 'Emma Rodriguez', profilePicture: null },
                    rating: 4,
                    comment: "My eye exam was thorough and the doctor took time to explain everything.",
                    createdAt: new Date('2023-08-28').toISOString()
                }
            ];

            if (Array.isArray(data) && data.length > 0) {
                setTestimonials(data);
            } else {
                setTestimonials(staticTestimonials);
            }
            setLastFetched(prev => ({ ...prev, testimonials: Date.now() }));
        } catch (error) {
            console.error('Error fetching testimonials:', error);
            // Fallback is handled by state usually retaining old data or simple error log
        } finally {
            setLoading(prev => ({ ...prev, testimonials: false }));
        }
    }, [testimonials, lastFetched.testimonials]);

    return (
        <DataContext.Provider value={{
            products,
            featuredFrames,
            testimonials,
            loading,
            fetchProducts,
            fetchFeaturedFrames,
            fetchTestimonials
        }}>
            {children}
        </DataContext.Provider>
    );
};
