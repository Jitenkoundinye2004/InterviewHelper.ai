import redis from '../config/redis.js';

const CACHE_TTL = {
  SESSIONS: 300, // 5 minutes
  QUESTIONS: 600, // 10 minutes
  USER_DATA: 1800, // 30 minutes
  AI_RESPONSES: 3600, // 1 hour
};

class CacheService {
  // Check if Redis is connected
  isRedisConnected() {
    return redis && redis.status === 'ready';
  }

  async get(key) {
    if (!this.isRedisConnected()) return null;
    try {
      const data = await redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(key, value, ttl = 300) {
    if (!this.isRedisConnected()) return false;
    try {
      await redis.setex(key, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  async del(key) {
    if (!this.isRedisConnected()) return false;
    try {
      await redis.del(key);
      return true;
    } catch (error) {
      console.error('Cache del error:', error);
      return false;
    }
  }

  async invalidatePattern(pattern) {
    if (!this.isRedisConnected()) return 0;
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
      return keys.length;
    } catch (error) {
      console.error('Cache invalidate pattern error:', error);
      return 0;
    }
  }

  // Session-specific methods
  getSessionKey(userId) {
    return `sessions:user:${userId}`;
  }

  getQuestionsKey(sessionId) {
    return `questions:session:${sessionId}`;
  }

  getAIResponseKey(promptHash) {
    return `ai:response:${promptHash}`;
  }

  async getCachedSessions(userId) {
    return this.get(this.getSessionKey(userId));
  }

  async setCachedSessions(userId, sessions) {
    return this.set(this.getSessionKey(userId), sessions, CACHE_TTL.SESSIONS);
  }

  async invalidateUserSessions(userId) {
    return this.del(this.getSessionKey(userId));
  }

  async getCachedQuestions(sessionId) {
    return this.get(this.getQuestionsKey(sessionId));
  }

  async setCachedQuestions(sessionId, questions) {
    return this.set(this.getQuestionsKey(sessionId), questions, CACHE_TTL.QUESTIONS);
  }

  async invalidateSessionQuestions(sessionId) {
    return this.del(this.getQuestionsKey(sessionId));
  }

  async getCachedAIResponse(promptHash) {
    return this.get(this.getAIResponseKey(promptHash));
  }

  async setCachedAIResponse(promptHash, response) {
    return this.set(this.getAIResponseKey(promptHash), response, CACHE_TTL.AI_RESPONSES);
  }
}

export default new CacheService();
