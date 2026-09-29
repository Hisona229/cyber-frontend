export default function HomePage() {
  return (
    <section className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">
        Лабораторна №2 Next.js + Tailwind
      </h1>
      <p className="mb-6 text-gray-700">
        Цей проєкт демонструє роботу системи моніторингу давачів у реальному часі. 
        Інтерфейс побудований на <strong>Next.js</strong> з використанням <strong>Tailwind CSS</strong> для 
        швидкої розробки адаптивного дизайну. Дані з давачів візуалізуються у вигляді динамічних графіків.
      </p>
      <p className="text-gray-700">
        У наступних лабораторних роботах буде реалізовано підключення до бекенду, 
        авторизацію користувачів та оновлення даних у реальному часі.
      </p>
    </section>
  );
}