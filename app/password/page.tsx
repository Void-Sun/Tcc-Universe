'use client'
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { auth, sendPasswordResetEmail, collection, getDocs, getFirestore, query, where } from "../../firebase/firebase"

const Star = () => {
    const [randomSize] = useState(Math.random() * 2 + 1); 
    const [randomTop] = useState(Math.random());
    const [randomLeft] = useState(Math.random());
    const [randomDuration] = useState(Math.random() * 10 + 5); 
    const [randomDirection] = useState(Math.random() * 360); 
    const [shouldFall] = useState(Math.random() < 0.10); 
    
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
  const [email, setEmail] = useState("")

  const handlepassChange = (pass: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(pass.target.value);
  };

  async function handlePasswordReset() {
    await sendPasswordResetEmail(auth, email)
    alert("Email de redefinição de senha enviado para " + email)
  }

  async function resetpassword() {
    const searchUserByEmail = async (email: string) => {
      const db = getFirestore();
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        querySnapshot.forEach(() => {
          handlePasswordReset()
          window.location.href = "./login"
        });
      } else {
        alert("User not found")
      }
    };

    await searchUserByEmail(email)
  }



  return (


    <div className="relative w-screen h-screen overflow-hidden">
      {/* Estrelas no fundo */}
      <div className="absolute inset-0 z-1">
        {[...Array(1009)].map((_, i) => (
          <Star key={i} />
        ))}
      </div>
      <main className="flex min-h-screen flex-col items-center gap-2 ">

        <div className="flex items-center my-14 justify-center gap-3">
          <Image src="/image.png" alt="logo" width={75} height={75}></Image>
          <p className="text-white text-4xl font-bold p-4">UniVerse</p>
        </div>


        <div className="bg-black/60 backdrop-blur w-[55rem] h-[25rem] rounded-[1rem] p-5">

          <div className="pb-8">
            <Link href="/login" className="flex w-10 h-10 items-center justify-center rounded-full">
              <Image src="/back.svg" alt="logo" width={40} height={40}>
              </Image>
            </Link>
          </div>

          <div className="flex flex-col gap-7 items-center justify-center">

            <p className="font-bold text-2xl text-[#501ADD] ">Esqueceu a senha?</p>
            <p className="text-white">Digite seu endereço de e-mail e enviaremos um link para redefinir sua senha</p>
            <input onChange={handlepassChange} value={email} type="email" className="bg-zinc-800 rounded-md px-2 w-80 border-[1px] py-2 transition-colors ease-in-out duration-500 focus:border-violet-700 outline-none text-white" placeholder="Email" />
            <button onClick={resetpassword} className="bg-[#501ADD] rounded-lg border-0 text-white py-3 px-24 hover:bg-violet-600 transition-colors ease-in-out duration-300" >Enviar</button>
          </div>
        </div>
      </main>
    </div>
  );
}   