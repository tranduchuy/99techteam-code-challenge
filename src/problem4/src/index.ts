import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';
import itemRoutes from './interfaces/itemRoutes';
import AppDataSource from './data-source';
import { errorHandler } from './interfaces/errorHandler';
import morgan from 'morgan';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// TODO: Initialize and start your app here.

const app = express();
app.use(express.json());
app.use(morgan('dev'));

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ExpressJS CRUD Backend API',
      version: '1.0.0',
      description: 'API documentation for the ExpressJS CRUD backend',
    },
  },
  apis: ['./src/interfaces/*.ts'],
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

AppDataSource.initialize().then(() => {
  app.use('/items', itemRoutes);
  app.use(errorHandler);
  app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
  });
});
