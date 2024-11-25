'use client'
import React from "react";
import Link from "next/link";
import { valit } from "../schemas/get-schema";
import { useState } from "react";
import Image from "next/image";
import { auth, GoogleAuthProvider, FacebookAuthProvider, GithubAuthProvider, signInWithEmailAndPassword, signInWithPopup, db, getFirestore, setDoc, getDoc, collection, getDocs, query, where } from '../../firebase/firebase'

const Star = () => {
   const [randomSize] = useState(Math.random() * 2 + 1)// Tamanhos pequenos
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
export default function Login() {

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [content, setContent] = useState<any>('');
  const [error, setError] = useState<any[]>([]);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const toggleMostrarSenha = () => {
    setMostrarSenha((prev) => !prev);
  };

  async function handleLogin() {
    const provider = new GoogleAuthProvider
    const result = await signInWithPopup(auth, provider)
    console.log(result)

    if (result.user) {
      window.location.href = "./start"
    }
  }


  async function handleFacebookLogin() {
    const provider = new FacebookAuthProvider
    const result = await signInWithPopup(auth, provider)
    console.log(result)

    if (result.user) {
      window.location.href = "./start"
    }
  }

  async function handleGithubLogin() {
    const provider = new GithubAuthProvider
    const result = await signInWithPopup(auth, provider)
    console.log(result)

    if (result.user) {
      window.location.href = "./start"
    }
  }


  function getErrors(error: any) {
    if (error.code === "auth/invalid-credential") {
      alert("Email ou senha incorretos")
    }

    return error.message
  }
  async function handlelogar() {

    try {

      if (await signInWithEmailAndPassword(auth, email, senha)) {
        if (!auth.currentUser?.emailVerified) {
          alert("Verifique o email antes de continuar  ")
        } else {
          window.location.href = "./start"
        }
      }

    } catch (err) {
      getErrors(err)
    }

  }

  async function Log() {
    const searchUserByEmail = async (email: string) => {
      const db = getFirestore();
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        handlelogar()
      } else {
        alert("User not found")
      }
    };

    await searchUserByEmail(email)
  }



  const handleEmailChange = (log: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(log.target.value);
  };

  const handleSenhaChange = (pass: React.ChangeEvent<HTMLInputElement>) => {
    setSenha(pass.target.value);
  };

  const handleVerify = async () => {



    const valitValue = valit({ email, password: senha });
    if (!valitValue.success) {

      const array: any[] = []
      valitValue.error.issues.map((val: any) => {
        const test = val.message.replace('String', val.path[0])
        array.push(test)
      })
      setError(array)


    } else if (valitValue.success) {

      Log()

    }

  }


  return (

    <div className="relative w-screen h-screen overflow-hidden">
      {/* Estrelas no fundo */}
      <div className="absolute inset-0 z-1">
        {[...Array(300)].map((_, i) => (
          <Star key={i} />
        ))}
      </div>

      <>
        <main className="flex min-h-screen flex-col items-center ">

        <div className="flex items-center my-10 justify-center gap-3">
            <Image src="/image.png" alt="logo" width={75} height={75}></Image>
            <p className="text-white text-4xl font-bold p-4">UniVerse</p>
          </div>

          {content ? <pre>{JSON.stringify(content, null, 4)}</pre> : null}
          <div className="flex flex-col gap-5 w-[30rem] h-[35rem] p-4 rounded-[1rem]  items-center justify-center bg-black/60 backdrop-blur">

            <h1 className="text-white text-3xl font-bold p-4">Entrar</h1>

            <div className="flex flex-col gap-4">

              <div className="flex flex-col">

                <input id="login" type="text" placeholder="Email" autoComplete="off" value={email} onChange={handleEmailChange} className="bg-zinc-800 rounded-md px-2 w-80 border-[1px] py-2 transition-colors ease-in-out duration-500 focus:border-violet-700 outline-none text-white " />
              </div>

              <div className="flex flex-col gap-1 mb-3">
              <div className="flex flex-col mb-3">
                <div className="relative">
                  <input
                    id="senha"
                    type={mostrarSenha ? "text" : "password"}
                    autoComplete="off"
                    placeholder="Senha"
                    className="bg-zinc-800 rounded-md px-2 w-80 border-[1px] py-2 transition-colors ease-in-out duration-500 focus:border-violet-700 outline-none text-white"
                    value={senha}
                    onChange={handleSenhaChange}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-2 text-white"
                    onClick={toggleMostrarSenha}
                  >
                    {mostrarSenha ? (<Image src="/eye.svg" alt="Google" width={25} height={25} />) : (<Image src="/closeye.svg" alt="Google" width={25} height={25} />)}
                  </button>
                </div>
              </div>
                <div className="flex justify-end">

                  <Link href='./password' className="text-white text-xs text-end hover:text-neutral-500 transition-colors ease-in-out duration-200">Esqueceu a senha?</Link>
                </div>
              </div>

            </div>
            <button onClick={handleVerify} className="bg-[#501ADD] rounded-lg border-0 text-white py-3 px-24 hover:bg-violet-600 transition-colors ease-in-out duration-300" >Login</button>


            {error.map((val: any, index: any) => {
              return <div key={index} className="text-red-500 text-sm">{val}</div>

            }
            )}

            <div className="flex items-center justify-center gap-2 w-full px-4">

              <p className="text-white text-sm">Ou continue com...</p> <hr className="w-60 h-[0.9px] bg-white" />

            </div>

            <div className="flex flex-row gap-3">

              <button onClick={handleLogin} ><Image src="/Google.svg" alt="Google" width={40} height={40} /></button>
              <button onClick={handleFacebookLogin} ><Image src="/Facebook.svg" alt="Facebook" width={40} height={40} /></button>
              <button onClick={handleGithubLogin} ><Image src="/Github.svg" alt="Facebook" width={40} height={40} /></button>

            </div>

            <div className="flex flex-row gap-2">

              <p className="text-white">Não tem um conta?</p>
              <Link href="./cadastro" className="text-violet-600 hover:text-violet-400">Cadastrar-se</Link>

            </div>

          </div>
        </main>
      </>
    </div>
  );
}
