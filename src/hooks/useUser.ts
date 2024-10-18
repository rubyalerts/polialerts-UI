// /hooks/useUsers.ts
import { useState } from "react";
import { Channel, User } from "@/types";
import { UserRepository } from "@/repositories/UserRepository";
import { KeywordRepository } from "@/repositories/KeywordRepository";
import { ICreateUserRequestData } from "@/types";

// Hook to deal with user Collection Methods
export const useUser = () => {
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Singleton instances of the repositories
  const userRepository = new UserRepository();
  const keywordRepository = new KeywordRepository();

  const createUser = async (userData: ICreateUserRequestData) => {

    setLoading(true);
    try {
      await userRepository.createUser(userData);
    } catch (error) {
      setError("Failed to create user.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async (userId: string | null | undefined) => {
    setLoading(true);

    if (!userId) return;
    // const userRepository = new UserRepository();
    try {
      const userInfo = await userRepository.getUserById(userId);
      if (!userInfo) return undefined;
      let user = userInfo as User;
      setUserDetails(user);
      return user;
    } catch (error) {
      setError("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  //Add Channel
  const addChannel = async (mainCategory: string, subCategory: string, channelId: string) => {
    setLoading(true);

    // const userRepository = new UserRepository();

    try {
      let channelData = {
        main_category: mainCategory,
        sub_category: subCategory,
        real_time_alert_keywords: [],
        report_alert_keywords: [],
        recipients: [],
        quote_context: 20,
        tags: [],
      };

      if (!userDetails?.id) throw new Error("User not found.");

      // Adding Channel
      await userRepository.addChannel(userDetails?.id, channelId, channelData);
      setLoading(false);


    } catch (error) {
      setLoading(false);
      setError("Failed to add channel.");

    }
  }

  // Get Channels
  const getChannels = async () => {
    setLoading(true);
    // const userRepository = new UserRepository();
    try {
      if (!userDetails?.id) throw new Error("User not found.");
      const channels = await userRepository.getChannels(userDetails?.id);
    } catch (error) {
      setError("Failed to fetch channels.");
    } finally {
      setLoading(false);
    }
  }

  // Update Channel
  const updateChannel = async (channelId: string, updatedChannel: Channel) => {

    setLoading(true);
    // const userRepository = new UserRepository();

    try {
      if (!userDetails?.id) throw new Error("User not found.");

      // Get Channel
      let channel = await userRepository.getChannel(userDetails?.id, channelId);

      let initialRealTimeAlertKeywords = channel.real_time_alert_keywords;

      let newRealTimeAlertKeywords = updatedChannel.real_time_alert_keywords;

      // Find the difference between the two arrays
      let differenceInKeywords = newRealTimeAlertKeywords.filter(x => !initialRealTimeAlertKeywords.includes(x));

      // Which keywords are removed
      let removedKeywords = initialRealTimeAlertKeywords.filter(x => !newRealTimeAlertKeywords.includes(x));



      await userRepository.updateChannel(userDetails?.id, channelId, updatedChannel);

      // If there are removed keywords
      if (removedKeywords.length > 0) {
        // Remove Keywords
        for (let keyword of removedKeywords) {
          await keywordRepository.deleteKeyword(userDetails?.id, channelId, keyword);
        }
      }

      // If there are new keywords
      if (differenceInKeywords.length > 0) {
        // Add New keywords
        for (let keyword of differenceInKeywords) {
          await keywordRepository.addKeyword(userDetails?.id, channelId, keyword);
        }
      }
      setLoading(false);

    } catch (error) {
      setLoading(false);
      setError("Failed to update channel.");
    }
  }

  // Delete Channel
  const deleteChannel = async (channelId: string) => {
    setLoading(true);
    // const userRepository = new UserRepository();
    try {
      if (!userDetails?.id) throw new Error("User not found.");
      await userRepository.deleteChannel(userDetails?.id, channelId);
      console.log("Channel Deleted Successfully!");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError("Failed to delete channel.");
    }
  }

  // Update Profile
  const updateProfile = async (updatedData: Partial<User>, userId: string) => {

    setLoading(true);
    // const userRepository = new UserRepository();

    try {

      if (!userId) throw new Error("User not found.");
      await userRepository.updateProfile(updatedData, userId);
      console.log("Level 1 - updateProfile in useUser");


      setUserDetails((prevState) => {
        if (!prevState) return null; // Handle case when prevState is null

        return {
          ...prevState,
          ...updatedData,
        };
      });
      setLoading(false);

      console.log("Level X - ");



    } catch (error) {
      console.log("Error - updateProfile() in useUser:", error);

      setError("Failed to update profile.");
      setLoading(false);
    }
  };


  return { userDetails, loading, error, createUser, fetchUser, addChannel, deleteChannel, getChannels, updateChannel, updateProfile };
};
