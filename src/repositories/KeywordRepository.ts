import { IKeywordRepository } from "@/types/index";
import { arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/app/firebase/config";
import { KEYWORDS_COLLECTION } from "@/app/utils/constants";

export class KeywordRepository implements IKeywordRepository {

    async addKeyword(userId: string, channelId: string, keyword: string): Promise<boolean> {
        try {
            console.log(`AddKeyword: ${keyword} to channel ${channelId}`);

            const keywordRef = doc(db, KEYWORDS_COLLECTION, channelId);
            const keywordDoc = await getDoc(keywordRef);
            // If the keyword channel doesn't exist, create it
            if (!keywordDoc.exists()) {
                await setDoc(keywordRef, {});
                // const wordsCollectionRef = collection(keywordRef, "words");
                // await setDoc(doc(wordsCollectionRef, keyword), {});
            }
            //  same as the other file, we can create a function to get the snapshot and call it in multiple places.
            const wordsCollectionRef = collection(keywordRef, "words");
            // The data inserted into wordsCollectionRef will also be a collection, with keyword as id
            // Get a reference to the specific keyword document
            const keywordDocRef = doc(wordsCollectionRef, keyword);
            const keywordDocSnapshot = await getDoc(keywordDocRef);

            // If the keyword doesn't exist, create it
            if (!keywordDocSnapshot.exists()) {
                await setDoc(keywordDocRef, {
                    tags: [],
                    user_ids: []
                });
            }

            // Update the keyword document with the new user_id and tag
            await updateDoc(keywordDocRef, {
                // tags: arrayUnion("tag1"), // You can modify this to accept tags as a parameter if needed
                tags: [],
                user_ids: arrayUnion(userId)
            });

            return true;

        }
        catch (error) {
            throw new Error("Failed to add keyword." + error);
        }
    }

    async deleteKeyword(userId: string, channelId: string, keyword: string): Promise<boolean> {
        try {
            const keywordRef = doc(db, KEYWORDS_COLLECTION, channelId);
            const keywordDoc = await getDoc(keywordRef);

            // If the keyword channel doesn't exist, throw an error
            if (!keywordDoc.exists()) {
                throw new Error(`Channel ${channelId} does not exist`);
            }

            const wordsCollectionRef = collection(keywordRef, "words");
            const keywordDocRef = doc(wordsCollectionRef, keyword);
            const keywordDocSnapshot = await getDoc(keywordDocRef);

            // If the keyword doesn't exist, throw an error
            if (!keywordDocSnapshot.exists()) {
                throw new Error(`Keyword ${keyword} does not exist`);
            }

            const keywordData = keywordDocSnapshot.data();
            const userIds = keywordData?.user_ids || [];

            // Check if the userId exists in the user_ids array
            if (!userIds.includes(userId)) {
                throw new Error(`User ID ${userId} does not exist in keyword ${keyword}`);
            }

            // Remove the userId from the user_ids array
            await updateDoc(keywordDocRef, {
                user_ids: arrayRemove(userId)
            });

            // Fetch the updated keyword document
            const updatedKeywordDocSnapshot = await getDoc(keywordDocRef);
            const updatedKeywordData = updatedKeywordDocSnapshot.data();

            // List of all the userIds in that keyword
            const updatedUserIds = updatedKeywordData?.user_ids || [];

            // If the user_ids array is empty, delete the keyword document
            if (updatedUserIds.length === 0) {
                await deleteDoc(keywordDocRef);
                // console.log(`Keyword ${keyword} deleted from channel ${channelId} as no user IDs are left.`);
            }
            return true;

        }
        catch (error) {
            throw new Error("Failed to delete keyword." + error);
        }
    }
}