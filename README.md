# 📝 Blogging API

A RESTful blogging platform built with **Node.js**, **Express**, and **MongoDB**, allowing users to create, manage, and read blog articles. Public users can read published blogs, while authenticated users can write and manage their own.

## 🚀 Features

User Sign-Up and Login  
JWT Authentication with 1-hour expiry  
Blog creation in "draft" state  
Blog publishing & editing (draft or published)  
Public access to published blogs  
Pagination, Filtering, and Sorting  
Read Count Increment on view  
Reading Time Calculation  
Search by author, title, or tags  
Logging with Winston  
Fully Tested Endpoints (e.g., Jest, Supertest)

### Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB + Mongoose
- **Auth:** JWT
- **Logging:** Winston
- **Testing:** Jest & Supertest
- **Hosting:** Render

---

#### 📁 Project Structure

- **/controllers:** # Route handlers
- **/models:** # Mongoose schemas
- **/routes:** # API endpoints
- **/middleware:** # Auth & logging middleware
- **/utils:** # Reading time calculation, etc.
- **/tests:** # Test cases
- **/docs:** # ERD and other docs -**.env:** # Environment variables -**server.js:** # Entry point

##### 🧑‍💻 API Endpoints

- **Auth**

| Method | Route   | Description       |
| ------ | ------- | ----------------- |
| POST   | /signup | Register new user |
| POST   | /login  | Login user (JWT)  |

- **Blogs**

| Method | Route              | Description                               |
| ------ | ------------------ | ----------------------------------------- |
| GET    | /blogs             | Public list of published blogs            |
| GET    | /blogs/:id         | View single published blog (read count ↑) |
| POST   | /blogs             | Create a blog (draft only, auth required) |
| PATCH  | /blogs/:id         | Edit blog (owner only)                    |
| PATCH  | /blogs/:id/publish | Publish blog (owner only)                 |
| DELETE | /blogs/:id         | Delete blog (owner only)                  |
| GET    | /user/blogs        | List of user's blogs                      |

Supports pagination, filter by state, search, and sort by `read_count`, `reading_time`, `timestamp`.

- **🔐 Authentication**

- JWT-based token returned on login
- Include token as `Authorization: Bearer <token>` in protected routes
- Token expires in 1 hour

- **🧠 Reading Time Algorithm**

Calculates based on average reading speed (e.g., 200 words per minute).

- **🔍 Query Parameters (for `/blogs`)**

- `page` – Page number (default: 1)
- `limit` – Blogs per page (default: 20)
- `author` – Filter by author
- `title` – Search by blog title
- `tags` – Filter by tags
- `sortBy` – e.g., `read_count`, `reading_time`, `createdAt`

-**🗃️ ERD**

![ERD](./docs/erd.png)

- **🧪 Running Tests**

```bash
npm test



🛰️ Deployment
App hosted on Render
Live URL: https://your-app-name.onrender.com
API Base URL: https://your-app-name.onrender.com/api

📄 License
This project is licensed under the MIT License.

✍️ Author
Your ADEKOYA ADEGBENGA OLUWATOSIN


```
