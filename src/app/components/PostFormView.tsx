// app/components/PostFormView.tsx
'use client';

import PostForm from './PostForm';

/**
 * Props for the PostFormView component.
 */
interface PostFormViewProps {
    onBackToList: () => void;
    onPostCreated: () => void;
}

/**
 * Component to display the post creation form view.
 * @param {function} onBackToList - Callback to return to the post list.
 * @param {function} onPostCreated - Callback after a post is successfully created.
 */
const PostFormView = ({ onBackToList, onPostCreated }: PostFormViewProps) => {
    return (
        <>
            <div className="flex justify-between items-center mb-6" >
                <h1 className="text-3xl font-bold text-gray-800" > Create a New Post </h1>
                < button
                    onClick={onBackToList}
                    className="px-4 py-2 text-purple-600 border border-purple-600 rounded-md hover:bg-purple-50 transition-colors duration-200"
                >
                    Cancel
                </button>
            </div>
            < PostForm onPostCreated={onPostCreated} />
        </>
    );
};

export default PostFormView;

