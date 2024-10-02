
# Stack Overflow Lite – Monolithic Architecture

**Stack Overflow Lite** is a simplified web-based Q&A system where users can sign up, post code snippets or text, and receive notifications for new posts. The app is designed with a monolithic architecture but follows best practices, making it easy to eventually decompose into microservices.

## Features

- **User Authentication:** Sign up and sign in using email and password.
- **Post Creation:** Create and view posts (text or code snippets).
- **Notification System:** Receive notifications for new posts.
- **Background Jobs:** Periodic cleaning of old notifications via a scheduled job.
- **Object Storage:** Store uploaded code snippets or files in MinIO (or any object store).

