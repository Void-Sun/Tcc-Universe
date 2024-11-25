'use client'
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// Componente para gerar uma única estrela
function Star() {
  const [randomSize] = useState(Math.random() * 2 + 1); // Tamanhos pequenos
  const [randomTop] = useState(Math.random());
  const [randomLeft] = useState(Math.random());
  const [randomDuration] = useState(Math.random() * 10 + 5); // Animação entre 5 e 15 segundos
  const [randomDirection] = useState(Math.random() * 360); // Movimento aleatório
  const [shouldFall] = useState(Math.random() < 0.10); // 10% de chance de uma estrela cair

  return (
    <div
      className={`absolute bg-white rounded-full opacity-80 animate-twinkle ${shouldFall ? 'animate-fall' : ''}`}
      style={{
        width: `${randomSize}px`,
        height: `${randomSize}px`,
        top: `${randomTop * 100}%`,
        left: `${randomLeft * 100}%`,
        animationDuration: `${randomDuration}s`,
        transform: `rotate(${randomDirection}deg)`,
      }}
    ></div>
  );
};

export default function Home() {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Estrelas no fundo */}
      <div className="absolute inset-0 z-1">
        {[...Array(1009)].map((_, i) => (
          <Star key={i} />
        ))}
      </div>

      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="flex w-[60rem] items-center justify-center my-14 gap-3">
          <Image src="/image.png" alt="logo" width={75} height={75} />
          <p className="text-white text-4xl font-bold p-4">UniVerse</p>
        </div>

        <div className="flex w-[50rem] flex-col gap-6">
          <p className="text-white text-xl">
            Bem-vindo ao UniVerse... Um chat para tirar suas dúvidas criadas em sala de aula, ou que você mesmo(a) tenha, use como quiser.
          </p>
          <h1 className="text-white text-4xl">Registre-se e acesse</h1>

          <div className="relative items-center justify-center flex h-10 w-[15rem]">
            <span className="animate-[ping_1.4s_ease-in-out_infinite] absolute inline-flex z-10 h-8 w-[10rem] rounded-full duration-500 bg-[rgb(59,33,102)]"></span>
            <Link
              href="/cadastro"
              className="flex text-white z-20 bg-indigo-950 w-[15rem] rounded-full h-10 items-center justify-center"
              aria-label="Registre-se no UniVerse"
            >
              Registre-se
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
