
import { useState } from 'react';
import { Category } from '@/types';
import { CategoryRepository } from '@/repositories/CategoryRepository';
export const useCategory = () => {

    const [subCategories, setSubCategories] = useState<Category[]>([]);
    const [mainCategories, setMainCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const categoryRepository = new CategoryRepository();


    const fetchMainCategories = async (parent: string) => {
        setLoading(true);

        try {
            const data = await categoryRepository.getCategories(parent);
            setMainCategories(data);
        } catch (error) {
            setError("Failed to fetch categories.");
        } finally {
            setLoading(false);
        }
    };

    const fetchSubCategories = async (parent: string) => {
        setLoading(true);

        try {
            const data = await categoryRepository.getCategories(parent);
            setSubCategories(data);
        } catch (error) {
            setError("Failed to fetch categories.");
        } finally {
            setLoading(false);
        }
    };

    return { mainCategories, subCategories, loading, error, fetchMainCategories, fetchSubCategories };

};
