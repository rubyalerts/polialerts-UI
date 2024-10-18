import { query, where, getDocs, collection } from "firebase/firestore";
import { CATEGORY_COLLECTION } from "@/app/utils/constants";
import { db } from "@/app/firebase/config";
import { Category, ICategoryRepository } from "@/types/index";

export class CategoryRepository implements ICategoryRepository {
    async getCategories(parent: string): Promise<Category[]> {
        const categoriesCollection = collection(db, CATEGORY_COLLECTION);
        const q = query(categoriesCollection, where('parent', '==', parent));
        const categorySnapshot = await getDocs(q);
        const categoryList = categorySnapshot.docs.map(doc => ({
            id: doc.id,
            name: doc.data().name,
            parent: doc.data().parent,
            streaming_source: doc.data().streaming_source,
            tags: doc.data().tags
        }));
        return categoryList;
    }
}