import request from "supertest";
import mongoose from "mongoose";
import { app } from "../app.js";
import { User } from "../Models/User.models.js";
import { SiteSettings } from "../Models/SiteSettings.models.js";
import { connectDB } from "../Configs/DB.configs.js";

describe("Auth API Tests", () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await connectDB();
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await SiteSettings.deleteMany({});
    await SiteSettings.create({});
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user successfully", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Test User",
          email: "test@example.com",
          password: "Test@123456",
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe("test@example.com");
      expect(res.body.accessToken).toBeDefined();
      expect(res.body.refreshToken).toBeDefined();
    });

    it("should reject duplicate email registration", async () => {
      await User.create({
        name: "Existing User",
        email: "test@example.com",
        password: "Test@123456",
      });

      const res = await request(app)
        .post("/api/auth/register")
        .send({
          name: "New User",
          email: "test@example.com",
          password: "Test@123456",
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should reject invalid email format", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Test User",
          email: "invalid-email",
          password: "Test@123456",
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should reject weak passwords", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Test User",
          email: "test@example.com",
          password: "weak",
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      await User.create({
        name: "Test User",
        email: "test@example.com",
        password: "Test@123456",
      });
    });

    it("should login successfully with correct credentials", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: "test@example.com",
          password: "Test@123456",
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user).toBeDefined();
      expect(res.body.accessToken).toBeDefined();
      expect(res.headers["set-cookie"]).toBeDefined();
    });

    it("should reject invalid password", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: "test@example.com",
          password: "Wrong@123456",
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("should reject non-existent user", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: "nonexistent@example.com",
          password: "Test@123456",
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("should lock account after 5 failed attempts", async () => {
      for (let i = 0; i < 5; i++) {
        await request(app)
          .post("/api/auth/login")
          .send({
            email: "test@example.com",
            password: "Wrong@123456",
          });
      }

      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: "test@example.com",
          password: "Test@123456",
        });

      expect(res.status).toBe(423);
      expect(res.body.message).toContain("locked");
    });
  });

  describe("POST /api/auth/refresh-token", () => {
    it("should reject request without refresh token", async () => {
      const res = await request(app)
        .post("/api/auth/refresh-token")
        .send({});

      expect(res.status).toBe(401);
    });
  });

  describe("GET /api/auth/logout", () => {
    it("should reject unauthenticated logout", async () => {
      const res = await request(app).get("/api/auth/logout");

      expect(res.status).toBe(401);
    });
  });
});

describe("Settings API Tests", () => {
  let adminUser;
  let adminToken;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await connectDB();
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await SiteSettings.deleteMany({});

    adminUser = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "Admin@123456",
      role: "admin",
    });

    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({
        email: "admin@example.com",
        password: "Admin@123456",
      });

    adminToken = loginRes.body.accessToken;

    await SiteSettings.create({
      siteName: "Test Portfolio",
      siteTagline: "Testing",
    });
  });

  describe("GET /api/settings", () => {
    it("should require authentication", async () => {
      const res = await request(app).get("/api/settings");

      expect(res.status).toBe(401);
    });

    it("should allow admin to get settings", async () => {
      const res = await request(app)
        .get("/api/settings")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.settings).toBeDefined();
    });
  });

  describe("PUT /api/settings", () => {
    it("should update site name", async () => {
      const res = await request(app)
        .put("/api/settings")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          siteName: "Updated Portfolio Name",
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.settings.siteName).toBe("Updated Portfolio Name");
    });

    it("should reject non-admin users", async () => {
      const editorUser = await User.create({
        name: "Editor User",
        email: "editor@example.com",
        password: "Editor@123456",
        role: "editor",
      });

      const loginRes = await request(app)
        .post("/api/auth/login")
        .send({
          email: "editor@example.com",
          password: "Editor@123456",
        });

      const editorToken = loginRes.body.accessToken;

      const res = await request(app)
        .put("/api/settings")
        .set("Authorization", `Bearer ${editorToken}`)
        .send({
          siteName: "Should Fail",
        });

      expect(res.status).toBe(403);
    });
  });
});

describe("Content API Tests", () => {
  let adminToken;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await connectDB();
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});

    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "Admin@123456",
      role: "admin",
    });

    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({
        email: "admin@example.com",
        password: "Admin@123456",
      });

    adminToken = loginRes.body.accessToken;
  });

  describe("Project CRUD", () => {
    it("should create a project", async () => {
      const res = await request(app)
        .post("/api/projects")
        .set("Authorization", `Bearer ${adminToken}`)
        .field("title", "Test Project")
        .field("description", "Test project description with enough characters")
        .field("technologies", "React,Node.js")
        .field("category", "Web Development");

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it("should get all projects publicly", async () => {
      await request(app)
        .post("/api/projects")
        .set("Authorization", `Bearer ${adminToken}`)
        .field("title", "Public Project")
        .field("description", "Test project description with enough characters")
        .field("technologies", "React")
        .field("category", "Web");

      const res = await request(app).get("/api/projects");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.projects).toBeDefined();
    });
  });

  describe("Blog CRUD", () => {
    it("should create a blog post", async () => {
      const res = await request(app)
        .post("/api/blogs")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          title: "Test Blog Post",
          content: "This is test blog content that is long enough to pass validation.",
          status: "draft",
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.blog).toBeDefined();
    });
  });
});

describe("Validation Tests", () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await connectDB();
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("Input Sanitization", () => {
    it("should sanitize SQL injection attempts", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: "admin@example.com' OR '1'='1",
          password: "anything",
        });

      expect(res.status).toBe(401);
    });

    it("should sanitize XSS attempts in registration", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({
          name: "<script>alert('xss')</script>",
          email: "xss@example.com",
          password: "Test@123456",
        });

      expect(res.status).toBe(201);
      expect(res.body.user.name).not.toContain("<script>");
    });
  });
});

describe("Rate Limiting Tests", () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await connectDB();
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should rate limit excessive requests", async () => {
    for (let i = 0; i < 100; i++) {
      await request(app).get("/");
    }

    const res = await request(app).get("/");

    expect(res.status).toBe(429);
  });
});
