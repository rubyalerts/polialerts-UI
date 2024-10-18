import { Channel, User } from "@/types"
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, DocumentSnapshot, QueryDocumentSnapshot, DocumentData, CollectionReference } from "firebase/firestore";
import { db } from "@/app/firebase/config";
import { PRO_SUBSCRIPTION, USERS_COLLECTION, SUBSCRIPTION_TYPES_COLLECTION } from "@/app/utils/constants";
import { ICreateUserRequestData, IAddChannelRequestData, IUserRepository, SubscriptionDetails } from "@/types";

export class UserRepository implements IUserRepository {

  async createUser(userData: ICreateUserRequestData): Promise<boolean> {

    try {
      // Add a new document with a generated id.
      await setDoc(doc(db, USERS_COLLECTION, userData.id), {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        channels: [],
        subscription_type: PRO_SUBSCRIPTION,
      });

      return true;
    }
    catch (error) {
      console.error("Error creating user: ", error)
      throw error;
    }
  }

  //Fetch All Users
  async getUsers(): Promise<User[]> {
    const usersCollection = collection(db, USERS_COLLECTION);
    const userSnapshot = await getDocs(usersCollection);
    const userList = userSnapshot.docs.map(doc => ({
      id: doc.id,
      firstName: doc.data().firstName,
      lastName: doc.data().lastName,
      email: doc.data().email,
      channels: doc.data().channels,
      subscription_type: doc.data().subscription_type,
      subscriptionDetails: doc.data().subscriptionDetails,
    }))
    // Please specify the return type of this function
    return userList;
  }

  //Fetch User By Id
  // Please specify the return type of this function
  async getUserById(userId: string): Promise<User | undefined> {

    const userCollection = collection(db, USERS_COLLECTION);
    const userSnapshot = await getDocs(userCollection);
    const doc = userSnapshot.docs.find(doc => doc.id === userId);

    if (!doc) {
      return undefined;
    }

    // get subscription info
    const subscription_type = doc?.data().subscription_type;
    const subscriptionDetailsCollection = collection(db, SUBSCRIPTION_TYPES_COLLECTION);
    const subscriptionDetailsSnapshot = await getDocs(subscriptionDetailsCollection);
    const subscriptionDetailsDoc = subscriptionDetailsSnapshot.docs.find(doc => doc.id === subscription_type);
    const subscriptionDetailsData = subscriptionDetailsDoc?.data();

    const subscriptionDetails: SubscriptionDetails = {
      channels_limit: subscriptionDetailsData?.channels_limit,
      name: subscriptionDetailsData?.name,
      recipients_limit: subscriptionDetailsData?.recipients_limit,
      report_alert_keywords_limit: subscriptionDetailsData?.report_alert_keywords_limit,
    }

    const channelsCollectionRef = collection(doc.ref, "channels");
    const channelsSnapshot = await getDocs(channelsCollectionRef);
    const channels = channelsSnapshot.docs.map(doc => {
      return {
        id: doc.id,
        main_category: doc.data().main_category,
        sub_category: doc.data().sub_category,
        real_time_alert_keywords: doc.data().real_time_alert_keywords,
        report_alert_keywords: doc.data().report_alert_keywords,
        recipients: doc.data().recipients,
        quote_context: doc.data().quote_context,
        tags: doc.data().tags,
      }
    }
    );

    const user: User = {
      id: doc?.id,
      firstName: doc?.data().firstName,
      lastName: doc?.data().lastName,
      email: doc?.data().email,
      phoneNo: doc?.data().phoneNo,
      street: doc?.data().street,
      city: doc?.data().city,
      country: doc?.data().country,
      channels: channels,
      postalCode: doc?.data().postalCode,
      subscription_type: doc?.data().subscription_type,
      subscriptionDetails: subscriptionDetails,
    }

    return user;
  }

  //Add Channel
  async addChannel(userId: string, channelId: string, channelData: IAddChannelRequestData): Promise<boolean> {
    try {

      const channelsCollectionRef = await this.getChannelsCollectionRef(userId);
      // Check if a channel with the given channelId already exists
      const userChannelDocRef = doc(channelsCollectionRef, channelId);
      const channelDoc = await getDoc(userChannelDocRef);

      if (channelDoc.exists()) {
        // Channel with the given channelId exists
        throw new Error("Channel already exists");
      }

      // Add the new channel document to the channels collection
      const newChannelDocRef = doc(channelsCollectionRef, channelId);
      await setDoc(newChannelDocRef, channelData);

      return true;

    } catch (error) {
      throw error;
    }
  }

  // Get Channel
  async getChannel(userId: string, channelId: string): Promise<Channel> {
    try {

      const channelDoc = await this.getChannelSnapshot(userId, channelId);

      const channelData = channelDoc.data();

      return {
        id: channelDoc.id,
        main_category: channelData.main_category,
        sub_category: channelData.sub_category,
        real_time_alert_keywords: channelData.real_time_alert_keywords,
        report_alert_keywords: channelData.report_alert_keywords,
        recipients: channelData.recipients,
        quote_context: channelData.quote_context,
        tags: channelData.tags,
      };

    } catch (error) {
      throw error;
    }
  }

  // Get Channels
  async getChannels(userId: string): Promise<Channel[]> {
    try {

      const channelsCollectionRef = await this.getChannelsCollectionRef(userId);

      // Fetch all channels
      const channelsSnapshot = await getDocs(channelsCollectionRef);
      const channels = channelsSnapshot.docs.map(doc => {
        return {
          id: doc.id,
          main_category: doc.data().main_category,
          sub_category: doc.data().sub_category,
          real_time_alert_keywords: doc.data().real_time_alert_keywords,
          report_alert_keywords: doc.data().report_alert_keywords,
          recipients: doc.data().recipients,
          quote_context: doc.data().quote_context,
          tags: doc.data().tags,
        }
      }
      );

      const channelsData: Channel[] = channels.map(channel => {
        return {
          id: channel.id,
          main_category: channel.main_category,
          sub_category: channel.sub_category,
          real_time_alert_keywords: channel.real_time_alert_keywords,
          report_alert_keywords: channel.report_alert_keywords,
          recipients: channel.recipients,
          quote_context: channel.quote_context,
          tags: channel.tags,
        }
      });

      return channelsData;

    } catch (error) {
      throw error;
    }
  }

  // Update Channel
  // types
  async updateChannel(userId: string, channelId: string, updatedChannel: Channel): Promise<boolean> {
    try {

      // Get a reference to the user's channels collection
      const channelsCollectionRef = await this.getChannelsCollectionRef(userId);

      // Get a reference to the specific channel document
      // Rename this to something like userChannelDocRef, as this is making referance to the user's channel document
      const userChannelDocRef = doc(channelsCollectionRef, channelId);


      // async getChannelSnapshot(userId: string, channelId: string): Promise<DocumentSnapshot<Channel>> {

      const channelDoc = await getDoc(userChannelDocRef);
      if (!channelDoc.exists()) {
        throw new Error("Channel not found");
      }

      // Get the current channel data
      const existingChannel = channelDoc.data();

      // Update the channel data with the new values
      existingChannel.real_time_alert_keywords = updatedChannel.real_time_alert_keywords;
      existingChannel.report_alert_keywords = updatedChannel.report_alert_keywords;
      existingChannel.recipients = updatedChannel.recipients;
      existingChannel.quote_context = updatedChannel.quote_context;
      existingChannel.tags = updatedChannel.tags;

      // Save the updated channel object back to the channels collection
      await updateDoc(userChannelDocRef, existingChannel);

      return true;

    } catch (error) {
      throw error;
    }
  }

  // Delete Channel
  async deleteChannel(userId: string, channelId: string): Promise<boolean> {
    try {

      // Get a reference to the channel document
      const channelDoc = await this.getChannelSnapshot(userId, channelId);

      // Delete the channel document from the channels collection
      await deleteDoc(channelDoc.ref);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // update Profile
  async updateProfile(updatedData: Partial<User>, userId: string): Promise<boolean> {
    try {

      // Get a reference to the user's document
      const userDocRef = doc(db, USERS_COLLECTION, userId);
      await updateDoc(userDocRef, updatedData);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Private method to get the channel snapshot
  private async getChannelSnapshot(userId: string, channelId: string): Promise<QueryDocumentSnapshot<DocumentData, DocumentData>> {

    const channelsCollectionRef = await this.getChannelsCollectionRef(userId);

    // Get a reference to the specific channel document
    const userChannelDocRef = doc(channelsCollectionRef, channelId);

    // Fetch the channel document
    const channelDoc = await getDoc(userChannelDocRef);
    if (!channelDoc.exists()) {
      throw new Error("Channel not found");
    }

    return channelDoc;
  }

  private async getChannelsCollectionRef(userId: string): Promise<CollectionReference<DocumentData, DocumentData>> {
    // Get a reference to the user's document
    const userDocRef = doc(db, USERS_COLLECTION, userId);

    // Fetch the user's document
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
      throw new Error("User document does not exist");
    }

    const channelsCollectionRef = collection(userDocRef, 'channels');
    return channelsCollectionRef;
  }

}
