const OpenAI = require('openai');
const { Pinecone } = require('@pinecone-database/pinecone');
require('dotenv').config();

class ServiceInitializer {
  constructor() {
    this.openaiClient = null;
    this.pineconeClient = null;
  }

  async initializeOpenAI() {
    try {
      this.openaiClient = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
      
      // Test connection using a simpler API call
      const models = await this.openaiClient.models.list();
      
      if (!models || !models.data) {
        throw new Error('Unexpected response format from OpenAI API');
      }
      
      console.log('✅ OpenAI client initialized successfully!');
      return this.openaiClient;
    } catch (error) {
      console.error('❌ OpenAI initialization error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    }
  }

  async initializePinecone() {
    try {
      // Validate environment variables first
      if (!process.env.PINECONE_API_KEY) {
        throw new Error('PINECONE_API_KEY is not set in environment variables');
      }
      if (!process.env.PINECONE_ENVIRONMENT) {
        throw new Error('PINECONE_ENVIRONMENT is not set in environment variables');
      }

      // Initialize Pinecone client
      this.pineconeClient = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY,
        environment: process.env.PINECONE_ENVIRONMENT
      });

      // Test connection with better error handling
      try {
        // First try to describe indexes instead of listing
        const indexes= await this.pineconeClient.listIndexes();
        console.log('✅ Pinecone initialized successfully!');
        return this.pineconeClient;
      } catch (indexError) {
        // Log the specific error for debugging
        console.error('Detailed Pinecone error:', {
          message: indexError.message,
          cause: indexError.cause,
          stack: indexError.stack
        });
        throw new Error(`Failed to connect to Pinecone: ${indexError.message}`);
      }
    } catch (error) {
      console.error('❌ Pinecone initialization error:', error.message);
      throw error;
    }
  }

  async initializeAll() {
    const results = {
      openai: null,
      pinecone: null,
      errors: []
    };

    try {
      results.openai = await this.initializeOpenAI();
    } catch (error) {
      results.errors.push({ service: 'OpenAI', error });
    }

    try {
      results.pinecone = await this.initializePinecone();
    } catch (error) {
      results.errors.push({ service: 'Pinecone', error });
    }

    return results;
  }
}

module.exports = new ServiceInitializer();
