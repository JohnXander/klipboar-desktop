import { Schema, model } from 'mongoose';
import { Site as ISite } from './site.types';
import { Model } from '../../lib/enums/model.enum';

const siteSchema = new Schema<ISite>(
  {
    url: { 
      type: String, 
      required: true 
    },
    launchCount: {
      type: Number,
      default: 1,
    },
    favicon: {
      type: String,
      required: false,
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
    }
  }, 
  { 
    timestamps: true 
  }
);

const Site = model<ISite>(Model.SITE, siteSchema);

export default Site;
