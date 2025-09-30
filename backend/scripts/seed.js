// scripts/seed.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blogplatform', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Check if models already exist to avoid re-compilation
const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxLength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minLength: [6, 'Password must be at least 6 characters long']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, { timestamps: true }));

const Post = mongoose.models.Post || mongoose.model('Post', new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxLength: [100, 'Title cannot exceed 100 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    maxLength: [5000, 'Content cannot exceed 5000 characters']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  isPublished: {
    type: Boolean,
    default: true
  }
}, { timestamps: true }));

const Comment = mongoose.models.Comment || mongoose.model('Comment', new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    maxLength: [500, 'Comment cannot exceed 500 characters']
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true }));

// Sample data
const sampleUsers = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'admin'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'user'
  },
  {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    password: 'password123',
    role: 'user'
  },
  {
    name: 'Bob Wilson',
    email: 'bob@example.com',
    password: 'password123',
    role: 'user'
  }
];

const samplePosts = [
  {
    title: 'Getting Started with React',
    content: `React is a powerful JavaScript library for building user interfaces, particularly web applications. In this comprehensive guide, we'll explore the fundamental concepts that make React so popular among developers.

React was created by Facebook and has revolutionized the way we think about building interactive UIs. At its core, React is all about components - reusable pieces of code that return HTML elements.

## Key Concepts

### Components
Components are the building blocks of React applications. They can be either functional or class-based, though functional components with hooks are now the preferred approach.

### State Management
State allows components to keep track of changing data and re-render when that data changes. This is what makes React applications dynamic and interactive.

### Props
Props (properties) are how we pass data from parent components to child components. They make components reusable and flexible.

## Why Choose React?

1. **Virtual DOM**: React uses a virtual DOM to optimize rendering performance
2. **Component Reusability**: Write once, use everywhere
3. **Strong Ecosystem**: Vast library of third-party packages
4. **Active Community**: Large community support and regular updates

Getting started with React is easier than ever. With tools like Create React App, you can have a working React application in minutes. The learning curve might seem steep at first, but the benefits are worth the investment.`,
    tags: ['React', 'JavaScript', 'Frontend', 'Tutorial']
  },
  {
    title: 'Full Stack Development Best Practices',
    content: `Full stack development requires mastery of both frontend and backend technologies. Here are the essential best practices every full stack developer should follow.

## Planning and Architecture

Before writing a single line of code, spend time planning your application architecture. Consider:
- Database design and relationships
- API structure and endpoints
- Frontend component hierarchy
- Authentication and authorization flow

## Backend Best Practices

### 1. API Design
Design RESTful APIs with clear, consistent naming conventions. Use proper HTTP methods (GET, POST, PUT, DELETE) and status codes.

### 2. Security First
- Always validate and sanitize user input
- Use HTTPS in production
- Implement proper authentication (JWT, OAuth)
- Hash passwords with bcrypt
- Use environment variables for sensitive data

### 3. Error Handling
Implement comprehensive error handling throughout your application. Create custom error classes and use middleware for centralized error processing.

## Frontend Best Practices

### 1. Component Structure
Keep components small and focused on a single responsibility. Use composition over inheritance.

### 2. State Management
Choose the right state management solution for your app size. useState for simple apps, Context API for medium complexity, Redux for large applications.

## Conclusion

Full stack development is challenging but rewarding. Focus on building solid fundamentals in both frontend and backend technologies, and always prioritize code quality and security over speed of development.`,
    tags: ['Full Stack', 'Best Practices', 'Development']
  },
  {
    title: 'MongoDB vs SQL: Choosing the Right Database',
    content: `Choosing between MongoDB and traditional SQL databases is one of the most important decisions in modern web development. Both have their strengths and use cases.

## MongoDB: The NoSQL Champion

MongoDB is a document-based NoSQL database that stores data in flexible, JSON-like documents.

### Advantages:
- **Flexible Schema**: Easy to modify data structure as your app evolves
- **Horizontal Scaling**: Built for distributed systems
- **Developer Friendly**: JSON-like documents feel natural to JavaScript developers

### When to Choose MongoDB:
- Rapid prototyping and agile development
- Applications with evolving data requirements
- Content management systems
- Real-time analytics

## SQL Databases: The Reliable Foundation

SQL databases like PostgreSQL, MySQL, and SQLite have been the backbone of web applications for decades.

### Advantages:
- **ACID Compliance**: Strong consistency and reliability
- **Mature Ecosystem**: Extensive tools and community knowledge
- **Complex Queries**: SQL is powerful for complex relational queries

## Making the Decision

Consider these factors:
1. **Data Structure**: Structured and relational → SQL, Semi-structured and evolving → MongoDB
2. **Scaling Needs**: Vertical scaling → SQL, Horizontal scaling → MongoDB
3. **Team Expertise**: Existing SQL knowledge vs. NoSQL experience

## Conclusion

There's no one-size-fits-all answer. The best choice depends on your specific use case, team expertise, and long-term goals.`,
    tags: ['MongoDB', 'SQL', 'Database', 'Comparison']
  },
  {
    title: 'Building Secure APIs with Node.js',
    content: `API security is crucial in today's interconnected world. A single vulnerability can expose sensitive data and compromise entire systems.

## Authentication and Authorization

### JWT (JSON Web Tokens)
JWTs are stateless tokens that contain encoded user information. They're perfect for API authentication.

### Best Practices:
- Use strong, unique secrets
- Set appropriate expiration times
- Implement token refresh mechanisms
- Store tokens securely on the client

## Input Validation and Sanitization

Never trust user input. Always validate and sanitize data before processing.

## Rate Limiting

Prevent abuse and DDoS attacks with rate limiting.

## HTTPS and Security Headers

### Always Use HTTPS in Production
HTTP traffic can be intercepted and modified. HTTPS encrypts communication between client and server.

## Environment Variables

Store sensitive configuration in environment variables, never in code.

## Conclusion

API security is an ongoing process, not a one-time setup. Stay updated with the latest security practices, regularly audit your dependencies, and always assume that attackers are looking for vulnerabilities.`,
    tags: ['Node.js', 'API', 'Security', 'Authentication']
  }
];

const sampleComments = [
  { content: 'Great introduction to React! This really helped me understand the basics.' },
  { content: 'Could you do a follow-up post about React Hooks?' },
  { content: 'Excellent comprehensive guide. The security section is particularly valuable.' },
  { content: 'I\'ve been debating between MongoDB and PostgreSQL for my next project. This comparison is exactly what I needed!' },
  { content: 'The hybrid approach section is really insightful. We use both SQL and NoSQL in our company.' },
  { content: 'Security is so important! Thanks for the practical examples with code snippets.' },
  { content: 'The rate limiting section saved my API from getting hammered. Much appreciated!' }
];

// Hash password function
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await User.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});

    // Create users
    console.log('👥 Creating users...');
    const users = [];
    for (let userData of sampleUsers) {
      const hashedPassword = await hashPassword(userData.password);
      const user = await User.create({
        ...userData,
        password: hashedPassword
      });
      users.push(user);
      console.log(`✅ Created user: ${user.name}`);
    }

    // Create posts
    console.log('📝 Creating posts...');
    const posts = [];
    for (let i = 0; i < samplePosts.length; i++) {
      const postData = samplePosts[i];
      const post = await Post.create({
        ...postData,
        author: users[i % users.length]._id
      });
      posts.push(post);
      console.log(`✅ Created post: ${post.title}`);
    }

    // Create comments
    console.log('💬 Creating comments...');
    const commentMappings = [
      { commentIndex: 0, postIndex: 0, authorIndex: 1 },
      { commentIndex: 1, postIndex: 0, authorIndex: 2 },
      { commentIndex: 2, postIndex: 1, authorIndex: 3 },
      { commentIndex: 3, postIndex: 2, authorIndex: 1 },
      { commentIndex: 4, postIndex: 2, authorIndex: 0 },
      { commentIndex: 5, postIndex: 3, authorIndex: 2 },
      { commentIndex: 6, postIndex: 3, authorIndex: 1 }
    ];

    for (let mapping of commentMappings) {
      const commentData = sampleComments[mapping.commentIndex];
      const comment = await Comment.create({
        content: commentData.content,
        post: posts[mapping.postIndex]._id,
        author: users[mapping.authorIndex]._id
      });
      console.log(`✅ Created comment on post: ${posts[mapping.postIndex].title}`);
    }

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Users created: ${users.length}`);
    console.log(`   Posts created: ${posts.length}`);
    console.log(`   Comments created: ${commentMappings.length}`);

    console.log('\n🔐 Test Accounts:');
    sampleUsers.forEach(user => {
      console.log(`   ${user.name} (${user.role}): ${user.email} / password123`);
    });

    console.log('\n🚀 You can now start your server with: npm run dev');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    mongoose.connection.close();
    console.log('\n📡 Database connection closed');
    process.exit(0);
  }
}

// Run the seeding function
seedDatabase();