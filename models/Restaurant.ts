import mongoose, { Schema, Model } from "mongoose";


export interface IRestaurant{
    name:string,
    description:string,
    address:string 
    email:string,
    phone:string,
    image:string,
    openingTime: string;
    closingTime: string;
}

const RestaurantSchema = new Schema<IRestaurant>({
    name:{
    type: String,
    required:true,
    trim:true
    },
description:{
type:String,
required:true,
trim:true
},
address: {
    type: String,
    required: true,
    },
email:{
    type:String,
    required:true
},
image: {
      type: String,
      default: "",
    },

    openingTime: {
      type: String,
      default: "08:00",
    },

    closingTime: {
    type: String,
      default: "22:00",
    },
},{timestamps:true})
const Restaurant: Model<IRestaurant> =
  mongoose.models.Restaurant ||
  mongoose.model<IRestaurant>("Restaurant", RestaurantSchema);

export default Restaurant;