import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { ChatService } from '../src/chat/chat.service';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';
import { MatrixGuard } from '../src/auth/guards/matrix.guard';

describe('ChatController (e2e)', () => {
  let app: INestApplication;
  
  const mockChatService = {
    getConversations: jest.fn().mockResolvedValue([{ partnerId: 'user-2' }]),
    getMessages: jest.fn().mockResolvedValue([{ id: 'msg-1', content: 'Hello' }]),
    sendMessage: jest.fn().mockResolvedValue({ id: 'msg-2', content: 'Hi' }),
    markAsRead: jest.fn().mockResolvedValue({ id: 'msg-1', read: true }),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideProvider(ChatService)
    .useValue(mockChatService)
    .overrideGuard(JwtAuthGuard)
    .useValue({ canActivate: (context: any) => {
        // Mocking user object in request for chat endpoints
        const req = context.switchToHttp().getRequest();
        req.user = { id: 'user-1' };
        return true; 
    }})
    .overrideGuard(MatrixGuard)
    .useValue({ canActivate: () => true })
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/chat/conversations (GET)', () => {
    return request(app.getHttpServer())
      .get('/chat/conversations')
      .expect(200)
      .expect([{ partnerId: 'user-2' }]);
  });

  it('/chat/messages (GET)', () => {
    return request(app.getHttpServer())
      .get('/chat/messages?partnerId=user-2&page=1&limit=10')
      .expect(200)
      .expect([{ id: 'msg-1', content: 'Hello' }]);
  });

  it('/chat/messages (POST)', () => {
    return request(app.getHttpServer())
      .post('/chat/messages')
      .send({ receiverId: 'user-2', content: 'Hi' })
      .expect(201)
      .expect({ id: 'msg-2', content: 'Hi' });
  });

  it('/chat/messages/:id/read (PATCH)', () => {
    return request(app.getHttpServer())
      .patch('/chat/messages/msg-1/read')
      .expect(200)
      .expect({ id: 'msg-1', read: true });
  });
});
