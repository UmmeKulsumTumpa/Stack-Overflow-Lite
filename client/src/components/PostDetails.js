import React, { useState, useEffect } from 'react';

const PostDetails = ({ post }) => {
    const [fileContent, setFileContent] = useState(null);

    useEffect(() => {
        // Fetch file content if a file URL exists
        if (post.file_url) {
            const fetchFileContent = async () => {
                try {
                    const response = await fetch(post.file_url);

                    // Check if the response is okay
                    if (!response.ok) {
                        throw new Error(`Error fetching file: ${response.statusText}`);
                    }

                    // Read file content as text
                    const text = await response.text();
                    setFileContent(text);
                } catch (error) {
                    console.error('Error fetching file content:', error);
                    setFileContent('Error loading file content.');
                }
            };

            fetchFileContent();
        }
    }, [post.file_url]);

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
            <h4 className="text-xl font-semibold text-gray-800 mb-2">{post.title || "Untitled Post"}</h4>
            <p className="text-sm text-gray-500 mb-4">Created at: {new Date(post.createdAt).toLocaleString()}</p>
            {post.content && (
                <p className="text-gray-600 mb-4">{post.content}</p>
            )}
            {fileContent && (
                <div className="bg-gray-100 p-4 rounded mb-4">
                    <h5 className="text-lg font-semibold mb-2">File Content:</h5>
                    <pre className="bg-gray-200 p-4 rounded overflow-auto text-sm">
                        <code>{fileContent}</code>
                    </pre>
                </div>
            )}
        </div>
    );
};

export default PostDetails;
