import Link from "next/link";
const HomePage=()=>{
  return(
    <section className="bg-orange-50">
  <div className="mx-auto grid min-h-[80vh] max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2  ">
<div className="">
<p className="font-semibold uppercase tracking-widset text-orange-600"> Welcome to  Restaurant App</p>
<h1 className="mt-4 text-5xl  font-bold leading-tight  md:text-6xl">
Great food.
<br />
Great moments.
</h1>
<p className="mt-6 max-w-xl text-lg text-gray-600">
    Discover delicious meals prepared with fresh
    ingredients and served with care.
  </p>
  <div className="mt-8 flex gap-4">
  <Link href={"/menu"} className="rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white">
  View Menu
  </Link>
  <Link
  href="/register"
  className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold"
  >
  Create Account
  </Link>
  </div>
</div>
<div className="rounded-3xl bg-orange-200 p-12 text-center">
  <div className="text-9xl">🍕</div>
  <p className="mt-6 text-xl font-semibold">
  Fresh • Delicious • Simple
          </p>
    </div>
  </div>
    </section>
  )
}


export default HomePage