import { Schema, model } from 'mongoose';
import { Assignment as IAssignment } from './assignment.types';
import { Model } from '../../lib/enums/model.enum';

const submissionSchema = new Schema(
  {
    value: {
      type: String, 
      required: true
    },
    copiedAt: {
      type: String,
      default: null
    },
    copiedFrom: {
      type: String,
      default: null
    },
  }, 
  { 
    _id: false 
  }
); 

const schema = new Schema<IAssignment>(
  {
    title: { 
      type: String, 
      required: true 
    },
    description: { 
      type: String, 
      required: true 
    },
    guideline: {
      type: Schema.Types.ObjectId,
      ref: Model.GUIDELINE,
      required: true
    },
    wordCount: {
      type: Number,
      required: true
    },
    submittedBy: {
      type: Schema.Types.ObjectId,
      ref: Model.USER,
      required: true
    },
    submittedTo: {
      type: Schema.Types.ObjectId,
      ref: Model.USER,
      required: true
    },
    organisation: {
      type: Schema.Types.ObjectId,
      ref: Model.ORGANISATION,
      required: true
    },
    isSubmitted: {
      type: Boolean,
      default: false
    },
    submittedAt: {
      type: Date,
      default: null
    },
    submission: { 
      type: [submissionSchema], 
      required: true 
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

const Assignment = model<IAssignment>(Model.ASSIGNMENT, schema);

export default Assignment;
