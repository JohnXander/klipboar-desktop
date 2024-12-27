import { Schema, model } from 'mongoose';
import { Guideline as IGuideline } from './guideline.types';
import { Model } from '../../lib/enums/model.enum';

const guidelineSchema = new Schema<IGuideline>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    wordLimit: {
      type: Number,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    organisation: {
      type: Schema.Types.ObjectId,
      ref: Model.ORGANISATION,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: Model.USER,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    }
  },
  { 
    timestamps: true 
  }
);

const Guideline = model<IGuideline>(Model.GUIDELINE, guidelineSchema);

export default Guideline;
