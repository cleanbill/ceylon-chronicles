// app/components/PostListView.tsx
'use client';

import PostList from './PostList';
import { Post } from '../lib/types';

/**
 * Props for the PostListView component.
 */
interface PostListViewProps {
    onSelectPost: (post: Post) => void;
    onSetView: (view: string) => void;
}

/**
 * Component to display the post list view.
 * @param {function} onSelectPost - Callback to select a post.
 * @param {function} onSetView - Callback to change the main app view.
 */
const PostListView = ({ onSelectPost, onSetView }: PostListViewProps) => {
    return (
        <>
            <div className="flex justify-between items-center mb-6" >
                <h1 className="text-3xl font-bold text-gray-800" > Recent Posts </h1>
                < button
                    onClick={() => onSetView('create')}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-200"
                >
                    Create New Post
                </button>
            </div>
            < PostList onSelectPost={onSelectPost} />
        </>
    );
};

export default PostListView;

