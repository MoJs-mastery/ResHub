import MenuCard from "@/components/MenuCard";
import { connectDB } from "@/lib/mongodb";
import MenuItem from "@/models/MenuItem";

export const dynamic = "force-dynamic";

const MenuPage = async()=>{
await connectDB()
const items = await MenuItem.find().sort({createdAt: -1 }).lean();
const serializedItems = items.map((item) => ({
    ...item,
    _id: item._id.toString(),
    createdAt: (item as typeof item & { createdAt?: Date }).createdAt?.toISOString(),
    updatedAt: (item as typeof item & { updatedAt?: Date }).updatedAt?.toISOString(),
    
}));
return (
    <section className="mx-auto max-w-7xl px-6 py-16">
    <div className="text-center">
        <p className="font-semibold text-orange-600">
        OUR MENU
        </p>

        <h1 className="mt-2 text-4xl font-bold">
        Delicious meals
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-gray-500">
        Explore our restaurant's favorite dishes.
        </p>
    </div>

    {serializedItems.length === 0 ? (
        <div className="mt-12 rounded-xl border p-10 text-center">
        <p className="text-gray-500">
            No menu items yet.
        </p>
        </div>
    ) : (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {serializedItems.map((item) => (
            <MenuCard key={item._id} item={item} />
        ))}
        </div>
    )}
    </section>
);
}

export default MenuPage