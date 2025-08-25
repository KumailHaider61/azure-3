
// --- DATABASE SIMULATION ---
// IMPORTANT: This file simulates a database for prototype purposes.
// All data is stored in-memory and will be lost on server restart.
// For a production deployment on a platform like Azure, you would:
//
// 1. **Set up a real database**: Create a managed database service on Azure 
//    (e.g., Azure Cosmos DB, Azure Database for PostgreSQL).
//
// 2. **Install a database client**: Add a client library to package.json
//    (e.g., `@azure/cosmos` for Cosmos DB).
//
// 3. **Replace the logic below**: Rewrite the functions in this file 
//    (getUserByEmail, getVideos, etc.) to query your actual Azure database
//    instead of reading from the in-memory arrays.
//
// 4. **Manage connections**: Use environment variables to securely store
//    your database connection string.

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Should not be sent to client in a real app
  avatarUrl: string;
  bio: string;
  following: number;
  followers: string;
  likes: string;
  likedVideos: string[];
}

export interface Comment {
  id: string;
  user: {
    name: string;
    avatarUrl: string;
  };
  text: string;
}

export interface Video {
  id: string;
  userId: string;
  user: { // Denormalized for convenience
    name: string;
    avatarUrl: string;
  };
  videoUrl: string;
  caption: string;
  likes: number;
  comments: number;
  shares: number;
  commentsData: Comment[];
}

// In-memory data store (The "Whiteboard" - to be replaced)
const users: User[] = [
  { 
    id: 'user1',
    name: 'SynthRiders',
    email: 'synth@example.com',
    password: 'password123',
    avatarUrl: 'https://placehold.co/40x40/4B0082/FFFFFF.png?text=SR',
    bio: 'Just a synthwave rider in a digital world. 🚀',
    following: 124,
    followers: "4.1M",
    likes: "23.6M",
    likedVideos: ['vid1', 'vid3'],
  },
  { 
    id: 'user2',
    name: 'CyberClips',
    email: 'cyber@example.com',
    password: 'password123',
    avatarUrl: 'https://placehold.co/40x40/BF00FF/FFFFFF.png?text=CC',
    bio: 'Bringing you the future, one clip at a time.',
    following: 543,
    followers: "1.2M",
    likes: "10.1M",
    likedVideos: [],
  },
  { 
    id: 'user3',
    name: 'GlitchGrooves',
    email: 'glitch@example.com',
    password: 'password123',
    avatarUrl: 'https://placehold.co/40x40/FF69B4/FFFFFF.png?text=GG',
    bio: 'Finding the beauty in the breakdown.',
    following: 89,
    followers: "780K",
    likes: "5.5M",
    likedVideos: ['vid2', 'vid4', 'vid5'],
  },
  { 
    id: 'user4',
    name: 'NeonVibes',
    email: 'neon@example.com',
    password: 'password123',
    avatarUrl: 'https://placehold.co/40x40/00FFFF/000000.png?text=NV',
    bio: 'Bright lights, bigger city.',
    following: 200,
    followers: "950K",
    likes: "8.2M",
    likedVideos: [],
  },
  {
    id: 'user5',
    name: 'FutureFunk',
    email: 'funk@example.com',
    password: 'password123',
    avatarUrl: 'https://placehold.co/40x40/FFD700/000000.png?text=FF',
    bio: 'Retro sounds, future funk.',
    following: 310,
    followers: "2.5M",
    likes: "15.9M",
    likedVideos: ['vid1'],
  },
];

const captions = [
  'Dropping the beat on this fine day! 🔥',
  'Just vibes ✨',
  'Wait for it... 🤯',
  'This took way too long to edit lol',
  'Can you relate? 😂 #fyp',
  'New dance challenge alert! 🚨',
  'Living my best life.',
  'Sound on for this one 🔊',
  'A day in the life.',
  'Tutorial time!',
  'This synth solo is out of this world 🪐',
  'Cyberpunk dreams and neon streams.',
  'Glitching through the matrix.',
  'Future funk forever.',
  'Retro vibes for modern times.'
];

const videoUrls = [
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4"
  ];

const commentsText = [
  'This is awesome!',
  'Love this!',
  'So cool!',
  'Wow!',
  'Great video!',
  'So true 😂',
  'First!',
  'What song is this?',
];

const generateComments = (videoIndex: number) => {
  const commentCount = (videoIndex + users.length) % 5; // 0 to 4 comments
  const comments: Comment[] = [];
  for (let i = 0; i < commentCount; i++) {
    const user = users[(videoIndex + i) % users.length];
    comments.push({
      id: `comment${videoIndex}-${i}`,
      user: {
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
      text: commentsText[(videoIndex + i) % commentsText.length],
    });
  }
  return comments;
};


const allVideos: Video[] = Array.from({ length: 50 }, (_, i) => {
  const user = users[i % users.length];
  const commentsData = generateComments(i);
  return {
    id: `vid${i + 1}`,
    userId: user.id,
    user: {
      name: user.name,
      avatarUrl: user.avatarUrl,
    },
    videoUrl: videoUrls[i % videoUrls.length],
    caption: captions[i % captions.length],
    likes: Math.floor(Math.random() * 1000000),
    comments: commentsData.length + Math.floor(Math.random() * 5),
    shares: Math.floor(Math.random() * 20000),
    commentsData: commentsData,
  };
});


// In-memory data store (The "Whiteboard" - to be replaced)
const data = {
    users,
    videos: allVideos,
};

// --- Data Access Functions ---
// Replace these functions with your actual database queries.

export function getUserByEmail(email: string): User | undefined {
    return data.users.find(u => u.email === email);
}

export function getUserById(id: string): User | undefined {
    return data.users.find(u => u.id === id);
}

export function updateUser(updatedUser: User) {
    const userIndex = data.users.findIndex(u => u.id === updatedUser.id);
    if (userIndex !== -1) {
        data.users[userIndex] = updatedUser;
    }
}

export function addUser(user: Omit<User, 'id' | 'following' | 'followers' | 'likes' | 'likedVideos'>): User {
    const newUser: User = {
        ...user,
        id: `user${data.users.length + 1}`,
        following: 0,
        followers: '0',
        likes: '0',
        likedVideos: [],
    };
    data.users.push(newUser);
    return newUser;
}

export function addVideo(video: Omit<Video, 'id' | 'user' | 'likes' | 'comments' | 'shares' | 'commentsData'>): Video {
    const user = getUserById(video.userId);
    if (!user) {
        throw new Error("User not found");
    }

    const newVideo: Video = {
        ...video,
        id: `vid${data.videos.length + 1}`,
        user: {
            name: user.name,
            avatarUrl: user.avatarUrl,
        },
        likes: 0,
        comments: 0,
        shares: 0,
        commentsData: [],
    };
    // Add to the beginning of the array so it shows up first
    data.videos.unshift(newVideo);
    return newVideo;
}


export function getVideos(count: number, start = 0): Video[] {
  return data.videos.slice(start, start + count);
}

export function getVideoById(id: string): Video | undefined {
  return data.videos.find(v => v.id === id);
}

export function getUserVideos(userId: string): Video[] {
    return data.videos.filter(v => v.userId === userId);
}
