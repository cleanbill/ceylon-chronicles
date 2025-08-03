// app/components/PostDetails.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Post, Comment, CommentInput } from '../lib/types';
import { useAuth } from '../lib/AuthContext';
import { getCommentsApi, addCommentApi } from '../lib/api';
import Modal from './Modal';
import { formatDistanceToNow } from 'date-fns';

/**
 * PostDetails component for displaying a single post and its comments.
 * @param {object} props - The component props.
 * @param {Post} props.post - The post object to display.
 * @param {function} props.onBack - Callback function to go back to the post list.
 */
const PostDetails = ({ post, onBack }: { post: Post; onBack: () => void }) => {
    const { user } = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loadingComments, setLoadingComments] = useState(true);
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    // Fetch comments when the component mounts or the post changes
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const fetchedComments = await getCommentsApi(post.id);
                setComments(fetchedComments);
            } catch (error) {
                console.error("Error fetching comments:", error);
            } finally {
                setLoadingComments(false);
            }
        };
        fetchComments();
    }, [post.id]);

    /**
     * Handles the submission of a new comment.
     */
    const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newComment.trim()) {
            setModalMessage('Comment cannot be empty.');
            setModalOpen(true);
            return;
        }

        if (!user) {
            setModalMessage('You must be signed in to post a comment.');
            setModalOpen(true);
            return;
        }

        setIsSubmittingComment(true);
        try {
            const commentInput: CommentInput = {
                postId: post.id,
                author: user.displayName ?? user.email ?? 'Anonymous',
                content: newComment,
            };

            // Optimistically update the UI with the new comment
            const tempComment: Comment = {
                ...commentInput,
                id: 'temp-' + Date.now(), // A temporary ID
                createdAt: new Date(),
            };
            setComments((prevComments) => [...prevComments, tempComment]);
            setNewComment(''); // Clear the input field immediately

            await addCommentApi(commentInput);

            // Re-fetch comments to get the permanent ID from the API,
            // or you could refactor addCommentApi to return the new comment object
            const updatedComments = await getCommentsApi(post.id);
            setComments(updatedComments);

        } catch (error) {
            console.error("Error adding comment:", error);
            setModalMessage('Failed to post comment. Please try again.');
            setModalOpen(true);
            // On error, revert the optimistic UI update
            setComments((prevComments) => prevComments.filter(comment => !comment.id.startsWith('temp-')));
        } finally {
            setIsSubmittingComment(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-extrabold text-gray-900">{post.title}</h1>
                <button
                    onClick={onBack}
                    className="px-4 py-2 text-purple-600 border border-purple-600 rounded-md hover:bg-purple-50 transition-colors duration-200"
                >
                    Back to Posts
                </button>
            </div>

            <div className="text-gray-600 mb-4">
                Posted by <span className="font-semibold">{post.author}</span> on {post.createdAt?.toLocaleString()}
            </div>

            {post.imageUrl && (
                <div className="relative w-full h-80 overflow-hidden rounded-md mb-6">
                    <Image
                        src={post.imageUrl}
                        alt={post.title}
                        layout="fill"
                        objectFit="cover"
                        priority
                        className="rounded-md"
                    />
                </div>
            )}

            <div className="prose max-w-none text-gray-800">
                <p className="text-lg">{post.content}</p>
            </div>

            <hr className="my-8 border-gray-200" />

            {/* Comments Section */}
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Comments</h2>

            {/* Add new comment form */}
            {user ? (
                <form onSubmit={handleCommentSubmit} className="mb-6 space-y-4">
                    <textarea
                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                        rows={3}
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        disabled={isSubmittingComment}
                    ></textarea>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-200 disabled:bg-purple-400"
                        disabled={isSubmittingComment}
                    >
                        {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                    </button>
                </form>
            ) : (
                <p className="text-gray-500 text-center mb-6">Please sign in to post a comment.</p>
            )}

            {loadingComments ? (
                <p className="text-center text-gray-500">Loading comments...</p>
            ) : comments.length > 0 ? (
                <div className="space-y-4">
                    {comments.map((comment) => (
                        <div key={comment.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="flex items-center mb-1">
                                <span className="font-semibold text-gray-800">{comment.author}</span>
                                <span className="text-sm text-gray-500 ml-2">
                                    {formatDistanceToNow(comment.createdAt as Date, { addSuffix: true })}
                                </span>
                            </div>
                            <p className="text-gray-700">{comment.content}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500">No comments yet. Be the first to comment!</p>
            )}

            <Modal isOpen={modalOpen} message={modalMessage} onClose={() => setModalOpen(false)} />
        </div>
    );
};

export default PostDetails;
