// app/components/Modal.tsx
'use client';

/**
 * Simple, reusable modal component.
 * Replaces browser's alert() for a better user experience.
 * @param {boolean} isOpen - Whether the modal is open.
 * @param {string} message - The message to display.
 * @param {function} onClose - Callback function to close the modal.
 */
const Modal = ({ isOpen, message, onClose }: { isOpen: boolean, message: string, onClose: () => void }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" >
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4" >
                <h3 className="text-xl font-bold text-gray-800" > Notice </h3>
                < p className="mt-4 text-gray-600" > {message} </p>
                < div className="mt-6 flex justify-end" >
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-200"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
