import express, { Application } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import HttpRoutes from './routes/HttpRoutes';
import passport from 'passport';
import { bearerStrategy } from './auth/bearerStrategy';

dotenv.config();

const app: Application = express();
const { API_HOST} = process.env || '127.0.0.1';
const { API_PORT } = process.env || 8080;
const { MONGO_URI } = process.env;

app.use(cors());
app.use(express.json());

app.use(passport.initialize());
passport.use(bearerStrategy);

app.use('/api', HttpRoutes);

mongoose.connect(MONGO_URI as string)
  .then(() => {
    app.listen(API_PORT, () => {
      console.log(
        `\n ==> 🌎  API is running on port ${API_PORT}`,
        `\n ==> 💻  Send requests to http://${API_HOST}:${API_PORT}`,
      );
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });
