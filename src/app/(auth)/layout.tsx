// app/(auth)/layout.tsx
'use client'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="w-full flex items-center justify-center">
      {children}
    </main>
  );
}
