import React, { useState, useEffect } from 'react';

const PostDetails = ({ post }) => {
    const [fileContent, setFileContent] = useState(null);

    useEffect(() => {
        // If there is a code snippet file URL, fetch its content
        if (post.code_snippet_url) {
            const fetchFileContent = async () => {
                try {
                    const response = await fetch(post.code_snippet_url);
                    const text = await response.text();
                    setFileContent(text);
                } catch (error) {
                    console.error('Error fetching code snippet:', error);
                }
            };

            fetchFileContent();
        }
    }, [post.code_snippet_url]);

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
            <h4 className="text-xl font-semibold text-gray-800 mb-2">{post.title || "Untitled Post"}</h4>
            <p className="text-sm text-gray-500 mb-4">Created at: {new Date(post.createdAt).toLocaleString()}</p>
            {post.content && (
                <p className="text-gray-600 mb-4">{post.content}</p>
            )}
            {fileContent && (
                <div className="bg-gray-100 p-4 rounded mb-4">
                    <h5 className="text-lg font-semibold mb-2">Code Snippet:</h5>
                    <pre className="bg-gray-200 p-4 rounded overflow-auto text-sm">
                        <code>{fileContent}</code>
                    </pre>
                </div>
            )}
        </div>
    );
};

export default PostDetails;
