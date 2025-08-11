# Blog-Platform-with-User-Authentication

## 2. Blog Platform with User Authentication (Full Stack)

**Objective:**  
Create a full-stack blog platform where users can register, log in, write blog posts, edit their posts, and leave comments on other users' posts. Admins can manage blog posts, and users can also interact with posts through comments.

**Key Features:**

### Homepage:
- Display a list of blog posts, including titles, authors, and a brief description.
- Pagination to manage multiple blog posts.

### Post Details Page:
- Show the full content of a single blog post.
- Allow users to leave comments on the blog post.

### User Authentication:
- User login and signup (with JWT for authentication).
- Users can update their profiles (optional).
- Admins can approve or delete blog posts and comments.

### Post Management:
- Users can create, update, and delete their own posts.
- Admins can manage all posts.

### Comment System:
- Users can comment on posts.
- Comments are displayed under the respective blog posts.

### Responsive Design:
- Ensure the site works well on mobile devices.

**Tech Stack:**
- **Frontend:** React (JSX), React Router, Axios for API calls, CSS or TailwindCSS for styling.
- **Backend:** Node.js + Express, JWT for authentication, bcrypt for password hashing.
- **Database:** SQLite (or MongoDB for more complex relationships).

**API Endpoints:**
- `GET /api/posts` — Get all blog posts.
- `POST /api/posts` — Create a new blog post.
- `GET /api/posts/:id` — Fetch a single blog post.
- `PUT /api/posts/:id` — Update a blog post.
- `DELETE /api/posts/:id` — Delete a blog post.
- `POST /api/auth/login` — Handle user login.
- `POST /api/auth/signup` — Handle user registration.
- `POST /api/comments` — Add a comment to a post.
- `GET /api/comments/:postId` — Get all comments for a specific post.

**Learning Outcomes:**
- Full-stack development with React and Node.js.
- Authentication and authorization using JWT and bcrypt.
- Creating a CRUD system for blog posts and comments.
- Building relationships between users, posts, and comments in the database.
- Implementing a content management system (CMS).

**Bonus:**
- Markdown support for writing blog posts.
- Allow users to upload images to blog posts.
- Implement a "like" system for posts and comments.
