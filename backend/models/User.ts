import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
  userName: string;
  wishList: string[];
  creationDate: Date;
}

const UserSchema: Schema<IUser> = new mongoose.Schema({
  userName: {
    type: String,
    required: true
  },
  wishList: {
    type: [String],
    required: true
  },
  creationDate: {
    type: Date,
    default: Date.now
  }
});

const UserModel: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export default UserModel;