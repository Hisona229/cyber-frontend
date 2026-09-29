"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const links = [
    { href: '/', label: 'Головна' },
    { href: '/dashboard-temp', label: 'Температура' },
    { href: '/dashboard-humidity', label: 'Вологість' },
    { href: '/login', label: 'Вхід' },
  ];

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-blue-600">Sensors Dashboard</h1>
      <ul className="flex gap-6">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`${
                pathname === link.href
                  ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-blue-500"
              } transition-all`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}