

const Footer = () => {
  return (
    <footer className="border-t bg-gray-950  text-white">
  <div className="mx-auto max-w-7xl px-6 py-10 text-center">
        <h2 className="text-xl font-bold">
          Taste Restaurant
        </h2>

        <p className="mt-2 text-gray-400">
          Delicious food made with love.
        </p>

        <p className="mt-6 text-sm text-gray-500">
          © {new Date().getFullYear()} Restaurant App.
          All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
