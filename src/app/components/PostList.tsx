// app/components/PostList.tsx
'use client';

import { useState, useEffect } from 'react';
import { getPostsApi } from '../lib/api';
import { Post } from '../lib/types';

/**
 * PostList component to display a list of blog posts.
 * @param {function} onSelectPost - Callback function to select a post.
 */
const PostList = ({ onSelectPost }: { onSelectPost: (post: Post) => void }) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch posts from the API on component mount
    useEffect(() => {
        const loadPosts = async () => {
            try {
                setIsLoading(true);
                const data = await getPostsApi();
                setPosts(data);
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadPosts();
    }, []);

    if (isLoading) {
        return <div className="text-center p-8 text-gray-500" > Loading posts...</div>;
    }

    // Handle the case where there are no posts
    if (posts.length === 0) {
        return <div className="text-center text-gray-500" > No posts found.Start writing! </div>;
    }

    return (
        <div className="space-y-6" >
            {
                posts.map(post => (
                    <div
                        key={post.id}
                        className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-xl transition-shadow duration-200"
                        onClick={() => onSelectPost(post)}
                    >
                        <h2 className="text-2xl font-semibold text-gray-900" > {post.title} </h2>
                        < p className="text-gray-600 mt-2 line-clamp-3" > {post.content} </p>
                        < span className="block mt-4 text-sm text-blue-500 hover:underline" > Read more...</span>
                    </div>
                ))}
        </div>
    );
};

export default PostList;
