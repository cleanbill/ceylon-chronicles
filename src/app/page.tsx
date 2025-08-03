// app/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { AuthProvider } from './lib/AuthContext';
import Navbar from './components/NavBar';
// Import the new view components
import PostListView from './components/PostListView';
import PostFormView from './components/PostFormView';
import PostDetailView from './components/PostDetailView';
import { Post } from './lib/types';

/**
 * Main client component for the blog application.
 * Manages the application's view state (list, create, post).
 */
const App = () => {
  const [view, setView] = useState('list');
  // FIX: Explicitly define the type for the selectedPost state
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  /**
   * Handles selecting a post to view its details.
   * @param {object} post - The post object to be selected.
   */
  const handleSelectPost = (post: Post) => {
    setSelectedPost(post);
    setView('post');
  };

  /**
   * Navigates back to the main post list view.
   */
  const handleBackToList = () => {
    setSelectedPost(null);
    setView('list');
  };

  /**
   * Handles post creation success and switches back to the list view.
   */
  const handlePostCreated = () => {
    setView('list');
  };

  /**
   * Renders the appropriate view based on the current state.
   * Now uses the new dedicated view components.
   */
  const renderView = () => {
    switch (view) {
      case 'list':
        return <PostListView onSelectPost={handleSelectPost} onSetView={setView} />;
      case 'create':
        return <PostFormView onBackToList={handleBackToList} onPostCreated={handlePostCreated} />;
      case 'post':
        return <PostDetailView selectedPost={selectedPost} onBackToList={handleBackToList} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans antialiased text-gray-900">
      <Navbar />
      <main className="container mx-auto p-4 pt-20 max-w-3xl">
        {renderView()}
      </main>
    </div>
  );
};

// Default export with the AuthProvider wrapping the main App component
const Page = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default Page;
