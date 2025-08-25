
"use client";

import { addUser, getUserByEmail, User, updateUser } from './data';

const SESSION_KEY = 'echo_chamber_session';

// --- Session Management (using localStorage for simulation) ---

export function getSessionUser(): User | null {
  if (typeof window === 'undefined') {
    return null;
  }
  const sessionData = localStorage.getItem(SESSION_KEY);
  if (!sessionData) {
    return null;
  }
  try {
    const user = JSON.parse(sessionData);
    // In a real app, you'd validate this session with a backend
    // For our simulation, we re-fetch from our "DB" to get the latest data
    return getUserByEmail(user.email) || null;
  } catch (error) {
    return null;
  }
}

function createSession(user: User) {
  if (typeof window === 'undefined') return;
  // Omit password before storing in session
  const { password, ...sessionUser } = user;
  localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
}

export function logout() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_KEY);
}


// --- Authentication Logic ---

export function login(email: string, password_input: string): User | null {
  const user = getUserByEmail(email);

  if (!user || user.password !== password_input) {
    return null;
  }
  
  createSession(user);
  return user;
}

export function signup(name: string, email: string, password_input: string): User | null {
  if (getUserByEmail(email)) {
    // User already exists
    return null;
  }

  const newUser = addUser({
    name,
    email,
    password: password_input,
    avatarUrl: `https://placehold.co/40x40/808080/FFFFFF.png?text=${name.substring(0, 2)}`,
    bio: 'New to Echo Chamber!',
  });
  
  createSession(newUser);
  return newUser;
}

// --- User Profile Updates ---
export function updateProfile(updatedData: User): User | null {
    const user = getSessionUser();
    if (!user || user.id !== updatedData.id) return null;

    const updatedUser = { ...user, ...updatedData };
    updateUser(updatedUser);
    // Re-create session to persist the change
    createSession(updatedUser);
    return updatedUser;
}


// --- Interaction Logic ---

export function isVideoLiked(videoId: string): boolean {
    const user = getSessionUser();
    return user?.likedVideos.includes(videoId) ?? false;
}

export function toggleLikeVideo(videoId: string): boolean {
    const user = getSessionUser();
    if (!user) return false;

    const liked = isVideoLiked(videoId);
    let updatedLikedVideos;

    if (liked) {
        updatedLikedVideos = user.likedVideos.filter(id => id !== videoId);
    } else {
        updatedLikedVideos = [...user.likedVideos, videoId];
    }
    
    const updatedUser = { ...user, likedVideos: updatedLikedVideos };
    updateUser(updatedUser);
    // Re-create session to persist the change
    createSession(updatedUser);

    return !liked;
}
