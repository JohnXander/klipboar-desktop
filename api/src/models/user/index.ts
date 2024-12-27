import { Schema, model } from 'mongoose';
import type { User as IUser } from './user.types';
import { Model } from '../../lib/enums/model.enum';
import bcryptjs from 'bcryptjs';
import { Role } from '../../lib/enums/role.enum';

const schema = new Schema<IUser>(
  {
    name: { 
      type: String, 
      required: true,
      unique: true,
    },
    email: { 
      type: String, 
      lowercase: true,
      trim: true,
      required: true,
      unique: true,
    },
    password: { 
      type: String, 
      required: true 
    },
    role: {
      type: String,
      enum: [Role.TEACHER, Role.STUDENT, Role.ADMIN],
    }
  },
  { 
    timestamps: true 
  },
);

schema.pre('save', async function (next) {
  if (!this.isNew) {
      return next();
  }

  this.password = await bcryptjs.hash(this.password, 10);
  
  next();
});

const User = model<IUser>(Model.USER, schema);

export default User;
