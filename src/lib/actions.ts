"use server";

import { recommendTopVideo } from "@/ai/flows/recommend-top-video";

export async function getRecommendedVideo() {
  // In a real application, this would be dynamically generated
  // based on the logged-in user's recent activity.
  const mockUserActivity = {
    watchedVideos: ["vid3", "vid5", "vid12"],
    likedCategories: ["Dance", "Comedy"],
    followedCreators: ["SynthRiders"],
  };

  try {
    const recommendation = await recommendTopVideo({
      userActivity: JSON.stringify(mockUserActivity, null, 2),
    });
    return recommendation;
  } catch (error) {
    console.error("Error getting video recommendation:", error);
    return {
      error: "Failed to get recommendation. Please try again.",
    };
  }
}
