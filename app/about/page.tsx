export default function AboutPage() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-20">
      <p className="font-semibold text-orange-600">
        ABOUT US
      </p>

      <h1 className="mt-3 text-5xl font-bold">
        Food made for good moments.
      </h1>

      <p className="mt-6 text-lg leading-8 text-gray-600">
    App Restaurant is a simple restaurant platform
        created to demonstrate how a modern full-stack
        Next.js application works.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border p-6">
          <h2 className="font-bold">Fresh</h2>
          <p className="mt-2 text-gray-500">
            Fresh ingredients every day.
          </p>
        </div>

        <div className="rounded-2xl border p-6">
          <h2 className="font-bold">Simple</h2>
          <p className="mt-2 text-gray-500">
            Simple food with great taste.
          </p>
        </div>

        <div className="rounded-2xl border p-6">
          <h2 className="font-bold">Friendly</h2>
          <p className="mt-2 text-gray-500">
            A welcoming restaurant experience.
          </p>
        </div>
      </div>
    </section>
  );
}