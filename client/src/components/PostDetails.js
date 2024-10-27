import React, { useState, useEffect } from 'react';

const PostDetails = ({ post }) => {
    const [fileContent, setFileContent] = useState(null);
    const [codeSnippetContent, setCodeSnippetContent] = useState(null);
    const [isFileExpanded, setIsFileExpanded] = useState(false);
    const [isSnippetExpanded, setIsSnippetExpanded] = useState(false);

    useEffect(() => {
        if (post.file_url) {
            const fetchFileContent = async () => {
                try {
                    const response = await fetch(post.file_url);

                    if (!response.ok) {
                        throw new Error(`Error fetching file: ${response.statusText}`);
                    }

                    const text = await response.text();
                    setFileContent(text);
                } catch (error) {
                    console.error('Error fetching file content:', error);
                    setFileContent('Error loading file content.');
                }
            };

            fetchFileContent();
        }

        if (post.code_snippet_url) {
            const fetchCodeSnippetContent = async () => {
                try {
                    const response = await fetch(post.code_snippet_url);

                    if (!response.ok) {
                        throw new Error(`Error fetching code snippet: ${response.statusText}`);
                    }

                    const text = await response.text();
                    setCodeSnippetContent(text);
                } catch (error) {
                    console.error('Error fetching code snippet:', error);
                    setCodeSnippetContent('Error loading code snippet.');
                }
            };

            fetchCodeSnippetContent();
        }
    }, [post.file_url, post.code_snippet_url]);

    const limitContent = (content, length = 300) => {
        return content.length > length ? content.substring(0, length) + '...' : content;
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
            <h4 className="text-xl font-semibold text-gray-800 mb-2">{post.title || "Untitled Post"}</h4>
            <p className="text-sm text-gray-500 mb-4">Created at: {new Date(post.createdAt).toLocaleString()}</p>
            {post.content && (
                <p className="text-gray-600 mb-4">{post.content}</p>
            )}
            {codeSnippetContent && (
                <div className="bg-gray-100 p-4 rounded mb-4">
                    <h5 className="text-lg font-semibold mb-2">Code Snippet:</h5>
                    <pre className={`bg-gray-200 p-4 rounded overflow-auto text-sm ${isSnippetExpanded ? '' : 'max-h-100'}`}>
                        <code>
                            {isSnippetExpanded ? codeSnippetContent : limitContent(codeSnippetContent)}
                        </code>
                    </pre>
                    <button
                        onClick={() => setIsSnippetExpanded(!isSnippetExpanded)}
                        className="mt-2 text-blue-500 hover:underline"
                    >
                        {isSnippetExpanded ? 'Collapse' : 'Expand'}
                    </button>
                </div>
            )}
            {fileContent && (
                <div className="bg-gray-100 p-4 rounded mb-4">
                    <h5 className="text-lg font-semibold mb-2">File Content:</h5>
                    <pre className={`bg-gray-200 p-4 rounded overflow-auto text-sm ${isFileExpanded ? '' : 'max-h-100'}`}>
                        <code>
                            {isFileExpanded ? fileContent : limitContent(fileContent)}
                        </code>
                    </pre>
                    <button
                        onClick={() => setIsFileExpanded(!isFileExpanded)}
                        className="mt-2 text-blue-500 hover:underline"
                    >
                        {isFileExpanded ? 'Collapse' : 'Expand'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default PostDetails;
