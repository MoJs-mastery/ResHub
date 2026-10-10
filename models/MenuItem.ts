import mongoose, { Schema, Model } from "mongoose";
import { timeStamp } from "node:console";

export interface IMenuItem{
    name:string,
    description:string,
    category:string,
    price:number,
   image: string;
  available: boolean;
}

const MenuItemSchema = new Schema<IMenuItem>({
    name:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    category:{
        type:String,
        required:true,
        trim:true
    },
    price:{
        type:Number,
        required:true,
        min:0
    },
    image:{
    type:String,
    default:""
 },

 available:{
    type:Boolean,
    default:true
 }
},{timestamps:true})

const MenuItem: Model<IMenuItem> =
  mongoose.models.MenuItem ||
  mongoose.model<IMenuItem>("MenuItem", MenuItemSchema);

export default MenuItem;