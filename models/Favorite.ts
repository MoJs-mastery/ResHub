import mongoose, { Model, Schema } from "mongoose";

export interface IFavorite {
  userId: string;
  menuItemId: string;
  createdAt?: Date;
}

const FavoriteSchema = new Schema<IFavorite>(
  {
    userId: { type: String, required: true },
    menuItemId: { type: String, required: true },
  },
  { timestamps: true, collection: "favorites" }
);

FavoriteSchema.index({ userId: 1, menuItemId: 1 }, { unique: true });

const Favorite: Model<IFavorite> =
  mongoose.models.Favorite ||
  mongoose.model<IFavorite>("Favorite", FavoriteSchema);

export default Favorite;
