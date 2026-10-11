
interface MenuCardProps {
item: {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image?: string;
    available: boolean;
};
}

const MenuCard=({ item }: MenuCardProps)=>{
return (
    <article className="overflow-hidden rounded-2xl border bg-white shadow-sm">
    <div className="flex h-48 items-center justify-center bg-orange-100 text-7xl">
        🍽️
    </div>

    <div className="p-5">
        <div className="flex items-start justify-between gap-4">
        <h3 className="text-xl font-bold">
            {item.name}
        </h3>

        <span className="font-bold text-orange-600">
            ${item.price.toFixed(2)}
        </span>
        </div>

        <p className="mt-2 text-sm text-gray-500">
        {item.description}
        </p>

        <div className="mt-4 flex items-center justify-between">
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs">
            {item.category}
        </span>

        <span
            className={
            item.available
                ? "text-sm text-green-600"
                : "text-sm text-red-600"
            }
        >
            {item.available ? "Available" : "Unavailable"}
        </span>
        </div>
    </div>
    </article>
);
}

export default MenuCard