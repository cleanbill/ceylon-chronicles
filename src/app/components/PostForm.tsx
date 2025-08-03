// app/components/PostForm.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '../lib/AuthContext';
import { createPostApi } from '../lib/api';
import Modal from './Modal';
import { PostInput } from '../lib/types';
import React from 'react';

/**
 * PostForm component for creating new blog posts.
 * @param {function} onPostCreated - Callback function to run after a post is created.
 */
const PostForm = ({ onPostCreated }: { onPostCreated: () => void }) => {
    const { user } = useAuth();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    // If user is not logged in, show a message instead of the form
    if (!user) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <p className="text-gray-600">Please sign in to create a new post.</p>
            </div>
        );
    }

    /**
     * Handles the form submission for a new post.
     * @param {object} e - The form event.
     */
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            setModalMessage('Title and content cannot be empty.');
            setModalOpen(true);
            return;
        }

        setIsSubmitting(true);
        try {
            // Use nullish coalescing to ensure 'author' is always a string
            const postInput: PostInput = {
                userId: user.uid,
                author: user.displayName ?? user.email ?? 'Anonymous',
                title,
                content,
            };

            await createPostApi(postInput, imageFile);
            setTitle('');
            setContent('');
            setImageFile(null);
            onPostCreated(); // Call the callback to switch back to the list view
        } catch (error) {
            console.error("Error adding post:", error);
            setModalMessage('Failed to create post. Please try again.');
            setModalOpen(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    /**
     * Handles the file input change event.
     * @param {object} e - The file input event.
     */
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-900">Create a New Post</h2>
            <p className="text-gray-500 text-sm mb-4">Posting as: {user.displayName || user.email}</p>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
                        rows={10}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-purple-500 focus:border-purple-500"
                        required
                    ></textarea>
                </div>
                <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                        Image (Optional)
                    </label>
                    <input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-purple-50 file:text-purple-700
              hover:file:bg-purple-100"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors duration-200 disabled:bg-green-400"
                >
                    {isSubmitting ? 'Submitting...' : 'Create Post'}
                </button>
            </form>
            <Modal isOpen={modalOpen} message={modalMessage} onClose={() => setModalOpen(false)} />
        </div>
    );
};

export default PostForm;
