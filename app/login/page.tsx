import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96 border">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Вхід у систему
        </h1>
        <form className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-left text-gray-700 font-medium mb-1"
            >
              Електронна пошта
            </label>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none bg-gray-100 cursor-not-allowed"
              disabled
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-left text-gray-700 font-medium mb-1"
            >
              Пароль
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none bg-gray-100 cursor-not-allowed"
              disabled
            />
          </div>
          <button
            type="button"
            disabled
            className="w-full py-2 bg-blue-600 text-white rounded-lg opacity-60 cursor-not-allowed font-medium"
          >
            Авторизація тимчасово недоступна
          </button>
        </form>
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            Повернутись на головну
          </Link>
        </div>
      </div>
    </div>
  );
}