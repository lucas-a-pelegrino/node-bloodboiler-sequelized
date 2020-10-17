const faker = require('faker');
const request = require('supertest');
const { StatusCodes } = require('http-status-codes');

const app = require('../../config/express');
const { version } = require('../../config/env');

const {
  getSampleUser,
  generateExpiredToken,
  generateSampleToken,
  generateSampleInvalidToken,
  malformedToken,
} = require('../fixtures/auth.fixtures');

const baseURL = `/api/${version}/auth`;

let sampleAuth;
beforeAll(async () => {
  sampleAuth = {
    name: faker.name.findName(),
    email: faker.internet.email().toLowerCase(),
    password: 'P@ssw0rd',
  };
});

describe('Auth Endpoints', () => {
  describe('POST /auth/register', () => {
    test('Should succesfully register an user', async () => {
      const response = await request(app)
        .post(`${baseURL}/register`)
        .send(sampleAuth);

      expect(response.status).toBe(StatusCodes.CREATED);
      expect(response.body).not.toHaveProperty('password');
      expect(response.body).toMatchObject({
        id: expect.any(Number),
        name: sampleAuth.name,
        email: sampleAuth.email,
      });

      sampleAuth.id = response.body.id;
    });

    test('Should return with 409 - Conflict', async () => {
      const response = await request(app)
        .post(`${baseURL}/register`)
        .send(sampleAuth);

      expect(response.status).toBe(StatusCodes.CONFLICT);
    });
  });

  describe('POST /auth/signin', () => {
    test('Should sign in the user', async () => {
      const response = await request(app)
        .post(`${baseURL}/signin`)
        .send({ email: sampleAuth.email, password: sampleAuth.password });

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body).toHaveProperty('token');
    });

    test('Should return with 404 - Not Found', async () => {
      const response = await request(app)
        .post(`${baseURL}/signin`)
        .send({ email: faker.internet.email(), password: sampleAuth.password });

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });

    test('Should return with 401 - Unauthorized', async () => {
      const response = await request(app)
        .post(`${baseURL}/signin`)
        .send({ email: sampleAuth.email, password: '12345678' });

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });
  });

  describe('POST /auth/forgot-password', () => {
    beforeEach(() => jest.setTimeout(10000));

    test('Should create an reset token for the user and send it to its email', async () => {
      const response = await request(app)
        .post(`${baseURL}/forgot-password`)
        .send({ email: sampleAuth.email });

      expect(response.status).toBe(StatusCodes.NO_CONTENT);
    });

    test('Should return with 404 - Not Found', async () => {
      const response = await request(app)
        .post(`${baseURL}/forgot-password`)
        .send({ email: faker.internet.email() });

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });

  describe('POST /auth/:token/reset-password', () => {
    beforeAll(async () => {
      sampleAuth = await getSampleUser(sampleAuth.id);
    });

    test("Should reset the user's password", async () => {
      const { passwordResetToken } = sampleAuth;
      const response = await request(app)
        .post(`${baseURL}/${passwordResetToken}/reset-password`)
        .send({ newPassword: 'P@ssW0rd' });

      expect(response.status).toBe(StatusCodes.NO_CONTENT);
    });

    test('Should return 401 - Unauthorized', async () => {
      const token = await generateExpiredToken(sampleAuth.id);
      const response = await request(app)
        .post(`${baseURL}/${token}/reset-password`)
        .send({ newPassword: 'P@ssW0rd' });

      expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    });

    test('Should return 404 - Not Found', async () => {
      const { token } = await generateSampleToken(sampleAuth.id);
      const response = await request(app)
        .post(`${baseURL}/${token}/reset-password`)
        .send({ newPassword: 'P@ssW0rd' });

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });

  describe('POST /auth/refresh-token', () => {
    beforeAll(async () => {
      sampleAuth = await getSampleUser(sampleAuth.id);
    });

    test('Should refresh user token', async () => {
      const { token, refreshToken } = await generateSampleToken(sampleAuth.id);
      const response = await request(app)
        .post(`${baseURL}/refresh-token`)
        .send({ token, refreshToken });
      expect(response.status).toBe(201);
    });

    test('Should not refresh user token - Token Not found', async () => {
      const token = await generateSampleInvalidToken(7123);
      const refreshToken = await generateSampleInvalidToken(7123);
      const response = await request(app)
        .post(`${baseURL}/refresh-token`)
        .send({ token, refreshToken });
      expect(response.status).toBe(404);
    });

    test('Should not refresh user token - Refresh Token is Malformed', async () => {
      const token = await generateSampleInvalidToken(7123);
      const response = await request(app)
        .post(`${baseURL}/refresh-token`)
        .send({ token, refreshToken: malformedToken });
      expect(response.status).toBe(401);
    });
  });
});
