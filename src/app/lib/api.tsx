// app/lib/api.tsx
import { db, storage } from './AuthContext';
import { Post, PostInput, Comment, CommentInput } from './types';
import {
    collection,
    doc,
    addDoc,
    getDocs,
    getDoc,
    query,
    serverTimestamp,
    orderBy,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

// Firestore collection reference
const postsCollection = collection(db, 'posts');

/**
 * Creates a new blog post in Firestore and uploads an image to Firebase Storage.
 * @param {PostInput} postInput - The post data.
 * @param {File | null} imageFile - The optional image file.
 */
export const createPostApi = async (postInput: PostInput, imageFile: File | null) => {
    let imageUrl = null;
    if (imageFile) {
        const imageRef = ref(storage, `images/${uuidv4()}-${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef);
    }

    const newPost: Omit<Post, 'id'> = {
        ...postInput,
        imageUrl,
        createdAt: serverTimestamp(),
    };

    await addDoc(postsCollection, newPost);
};

/**
 * Fetches all posts from Firestore, ordered by creation date.
 * @returns {Promise<Post[]>} An array of Post objects.
 */
export const getPostsApi = async (): Promise<Post[]> => {
    const q = query(postsCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
        (doc) =>
        ({
            id: doc.id,
            ...doc.data(),
        } as Post)
    );
};

/**
 * Fetches a single post from Firestore by its ID.
 * @param {string} postId - The ID of the post.
 * @returns {Promise<Post | null>} The post object or null if not found.
 */
export const getPostApi = async (postId: string): Promise<Post | null> => {
    const docRef = doc(db, 'posts', postId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return {
            id: docSnap.id,
            ...docSnap.data(),
        } as Post;
    } else {
        return null;
    }
};

/**
 * A mock data object for comments. In a real app, this would be a Firestore query.
 * The `Record<string, Comment[]>` type annotation allows us to use any string as a key.
 */
const commentsData: Record<string, Comment[]> = {
    'post-1': [
        {
            id: 'comment-1',
            postId: 'post-1',
            author: 'Jane Doe',
            content: 'This is the first comment!',
            createdAt: new Date('2023-01-01'),
        },
        {
            id: 'comment-2',
            postId: 'post-1',
            author: 'John Smith',
            content: 'I agree, great post!',
            createdAt: new Date('2023-01-02'),
        },
    ],
    'post-2': [
        {
            id: 'comment-3',
            postId: 'post-2',
            author: 'Peter Jones',
            content: 'Interesting read.',
            createdAt: new Date('2023-01-03'),
        },
    ],
};

/**
 * Fetches comments for a given post ID.
 * The function now safely handles cases where no comments exist.
 * @param {string} postId - The ID of the post.
 * @returns {Promise<Comment[]>} An array of comments for the post.
 */
export const getCommentsApi = async (postId: string): Promise<Comment[]> => {
    // Return the comments for the postId, or an empty array if the key doesn't exist
    return commentsData[postId] || [];
};

/**
 * Adds a new comment to a post.
 * In a real app, this would add a document to a 'comments' subcollection in Firestore.
 * @param {CommentInput} commentInput - The comment data.
 * @returns {Promise<void>}
 */
export const addCommentApi = async (commentInput: CommentInput) => {
    console.log('Creating comment:', commentInput);
    // This is a mock implementation.
    const newComment: Comment = {
        ...commentInput,
        id: uuidv4(),
        createdAt: new Date(),
    };

    if (!commentsData[commentInput.postId]) {
        commentsData[commentInput.postId] = [];
    }
    commentsData[commentInput.postId].push(newComment);
};
