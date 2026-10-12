import mongoose, { Schema, Model } from "mongoose";
export interface IUser{
name:string,
email:string,
password:string,
role:"user" | "admin";
favorites:string[];
}

const UserSchema =new  Schema<IUser>({
    name:{
        type:String,
       required:true,
       trim:true
    },
    email:{
        type:String,
       required:true,
       trim:true,
       unique:true,
       lowercase:true
    },
     password: {
      type: String,
      required: true,
    },

    role:{
        type: String,
        enum:["user","admin"],
        default:"user"
    },
    favorites:{
        type:[String],
        default:[]
    },
},{timestamps:true});

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

if (!User.schema.path("favorites")) {
  User.schema.add({
    favorites: {
      type: [String],
      default: [],
    },
  });
}

export default User;