import request from 'supertest';
import app from '../App.js'; // make sure app is exported
import User from '../Models/UserSchema.js';
import Blog from '../Models/BlogSchema.js';

let token = '';

beforeEach(async () => {
  await request(app).post('/api/users/signup').send({
    name: 'Adegbenga',
    email: 'ade@example.com',
    password: 'password123',
  });

  const loginRes = await request(app).post('/api/users/login').send({
    email: 'ade@example.com',
    password: 'password123',
  });

  token = loginRes.body.token;
});

describe('Blog Routes', () => {
  it('should create a blog', async () => {
    const res = await request(app)
      .post('/api/blog/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Blog',
        content: 'Some content',
        tags: ['test', 'blog'],
        body: 'This is the body of the blog',
        state: 'draft',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.blog.title).toBe('Test Blog');
  });

  it('should get all published blogs', async () => {
    await Blog.create({
      title: 'Published Blog',
      content: 'Visible to public',
      state: 'publish',
      author: (await User.findOne())._id,
    });

    const res = await request(app).get('/api/blog/publish/:id');

    expect(res.statusCode).toBe(200);
    expect(res.body.blog.length).toBe(1);
    expect(res.body.blog[0].state).toBe('publish');
  });

  it('should get a single blog by ID', async () => {
    const blog = await Blog.create({
      title: 'Single Blog',
      content: 'Detailed blog',
      state: 'published',
      author: (await User.findOne())._id,
    });

    const res = await request(app).get(`/api/blog/${blog._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.blog.title).toBe('Single Blog');
  });

  it('should update a blog', async () => {
    const blog = await Blog.create({
      title: 'Old Title',
      content: 'Old Content',
      state: 'draft',
      author: (await User.findOne())._id,
    });

    const res = await request(app)
      .put(`/api/blog/${blog._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated Title' });

    expect(res.statusCode).toBe(200);
    expect(res.body.blog.title).toBe('Updated Title');
  });

  it('should delete a blog', async () => {
    const blog = await Blog.create({
      title: 'To be deleted',
      content: 'Temporary',
      state: 'draft',
      author: (await User.findOne())._id,
    });

    const res = await request(app)
      .delete(`/api/blog/${blog._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });
});
