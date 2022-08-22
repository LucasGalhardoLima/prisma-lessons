import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { useContainer } from 'class-validator';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const articleShape = expect.objectContaining({
    id: expect.any(Number),
    body: expect.any(String),
    title: expect.any(String),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
    published: expect.any(Boolean),
  });

  const articlesData = [
    {
      title: 'title1',
      description: 'description1',
      body: 'body1',
      published: true,
    },
    {
      title: 'title2',
      description: 'description2',
      body: 'body2',
      published: false,
    },
  ];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    prisma = app.get<PrismaService>(PrismaService);

    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await app.init();

    await prisma.article.create({
      data: articlesData[0],
    });

    await prisma.article.create({
      data: articlesData[1],
    });
  });

  describe('GET /articles', () => {
    it('return a list of published articles', async () => {
      const { status, body } = await request(app.getHttpServer()).get(
        '/articles',
      );

      expect(status).toBe(200);
      expect(body).toStrictEqual(expect.arrayContaining([articleShape]));
      expect(body).toHaveLength(1);
      expect(body[0].published).toBeTruthy();
    });

    it('return a list of unpublished articles', async () => {
      const { status, body } = await request(app.getHttpServer()).get(
        '/articles/drafts',
      );

      expect(status).toBe(200);
      expect(body).toStrictEqual(expect.arrayContaining([articleShape]));
      expect(body).toHaveLength(1);
      expect(body[0].published).toBeFalsy();
    });
  });

  describe('POST /articles', () => {
    it('creates an article', async () => {
      const beforeCount = await prisma.article.count();

      const { status, body } = await request(app.getHttpServer())
        .post('/articles')
        .send({
          title: 'Teste 3',
          description: 'Teste 3',
          body: 'Teste 3',
          published: false,
        });

      const afterCount = await prisma.article.count();

      expect(status).toBe(201);
      expect(afterCount - beforeCount).toBe(1);
    });

    it('fails to create article without title', async () => {
      const { status, body } = await request(app.getHttpServer())
        .post('/articles')
        .send({
          title: '',
          description: 'Teste 3',
          body: 'Teste 3',
          published: false,
        });

      expect(status).toBe(400);
    });
  });
});
