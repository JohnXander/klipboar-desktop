import { Schema, model } from 'mongoose';
import { Organisation as IOrganisation } from './organisation.types';
import { Model } from '../../lib/enums/model.enum';

const membersSchema = new Schema(
  {
    user: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true
    }
  },
  { 
    _id: false 
  }
); 

const schema = new Schema<IOrganisation>(
  {
    name: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: Model.USER,
      required: true,
    },
    members: { 
      type: [membersSchema], 
      required: true 
    },
    logoUrl: {
      type: String,
      required: false,
    }
  },
  {
    timestamps: true,
  }
);

const Organisation = model<IOrganisation>(Model.ORGANISATION, schema);

export default Organisation;
