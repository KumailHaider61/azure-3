
'use server';

/**
 * @fileOverview AI agent that recommends the top video based on user activity.
 *
 * - recommendTopVideo - A function that recommends the top video.
 * - RecommendTopVideoInput - The input type for the recommendTopVideo function.
 * - RecommendTopVideoOutput - The return type for the recommendTopVideo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getVideoById, getVideos } from '@/lib/data';

const RecommendTopVideoInputSchema = z.object({
  userActivity: z
    .string()
    .describe('The past activity of the user, as a JSON string.'),
});
export type RecommendTopVideoInput = z.infer<typeof RecommendTopVideoInputSchema>;

const RecommendTopVideoOutputSchema = z.object({
  videoId: z.string().describe('The ID of the recommended video.'),
  reason: z.string().describe('The reason for the recommendation.'),
});
export type RecommendTopVideoOutput = z.infer<typeof RecommendTopVideoOutputSchema>;

export async function recommendTopVideo(input: RecommendTopVideoInput): Promise<RecommendTopVideoOutput> {
  return recommendTopVideoFlow(input);
}

const getVideoRecommendation = ai.defineTool({
  name: 'getVideoRecommendation',
  description: 'Recommends a video ID based on user activity.',
  inputSchema: z.object({
    userActivity: z
      .string()
      .describe('A description of the past activity of the user.'),
  }),
  outputSchema: z.object({
    videoId: z.string().describe('The ID of the recommended video.'),
    reason: z.string().describe('The reason for the recommendation.'),
  }),
}, async (input) => {
  // In a real app, this tool would query a database to find a video 
  // that matches the user's activity. For now, we'll select a random one.
  console.log('getVideoRecommendation tool called with input:', input);
  
  const allVideos = getVideos(50); // Get all videos from our mock DB
  const randomIndex = Math.floor(Math.random() * allVideos.length);
  const recommendedVideo = allVideos[randomIndex];
  
  return {
    videoId: recommendedVideo.id,
    reason: `Based on your interests, you might enjoy this video: "${recommendedVideo.caption}"`,
  };
});

const prompt = ai.definePrompt({
  name: 'recommendTopVideoPrompt',
  tools: [getVideoRecommendation],
  input: {schema: RecommendTopVideoInputSchema},
  output: {schema: RecommendTopVideoOutputSchema},
  prompt: `Based on the user's past activity, recommend a video. Use the getVideoRecommendation tool to determine the best video to recommend.\n\nUser Activity: {{{userActivity}}}`,
});

const recommendTopVideoFlow = ai.defineFlow(
  {
    name: 'recommendTopVideoFlow',
    inputSchema: RecommendTopVideoInputSchema,
    outputSchema: RecommendTopVideoOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
