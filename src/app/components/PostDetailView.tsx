// app/components/PostDetailView.tsx
'use client';

import React, { useMemo } from 'react';
import PostDetail from './PostDetails';
import { Post } from '../lib/types';

/**
 * Props for the PostDetailView component.
 */
interface PostDetailViewProps {
  selectedPost: Post | null;
  onBackToList: () => void;
}

/**
 * Component to display a single post's detail view.
 * @param {object} selectedPost - The post object to display.
 * @param {function} onBackToList - Callback to return to the post list.
 */
const PostDetailView = ({ selectedPost, onBackToList }: PostDetailViewProps) => {
  // Memoize the selected post to prevent unnecessary re-renders
  const memoizedSelectedPost = useMemo(() => selectedPost, [selectedPost]);

  return memoizedSelectedPost ? (
    <PostDetail post={memoizedSelectedPost} onBack={onBackToList} />
  ) : null;
};

export default React.memo(PostDetailView);