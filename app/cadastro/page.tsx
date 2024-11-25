'use client'
import React from "react";
import { useState } from "react";
import Link from "next/link";
import { valit } from "../schemas/user-schema";
import Image from "next/image";
import { auth, GoogleAuthProvider, FacebookAuthProvider, GithubAuthProvider, createUserWithEmailAndPassword, signInWithPopup, db, signOut } from '../../firebase/firebase'
import { doc, setDoc } from "firebase/firestore";
import { sendEmailVerification } from "firebase/auth";

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
export default function Cadastro() {

  const [user, setUser] = useState("");
  const [email, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [content, setContent] = useState<any>('');
  const [error, setError] = useState<any[]>([]);
  const [level, setLevel] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const toggleMostrarSenha = () => {
    setMostrarSenha((prev) => !prev);
  };

  const handleUserChange = (user: React.ChangeEvent<HTMLInputElement>) => {
    setUser(user.target.value);
  }
  const handleLoginChange = (log: React.ChangeEvent<HTMLInputElement>) => {
    setLogin(log.target.value);
  };

  const handleSenhaChange = (pass: React.ChangeEvent<HTMLInputElement>) => {
    setSenha(pass.target.value);
  };

  const verify = async () => {
    //@ts-ignore
    const res = await sendEmailVerification(auth.currentUser)
    alert('enviamos email para ' + email + ' verifique sua caixa de entrada para confirmar o cadastro')
    await signOut(auth);


  }


  async function handleCadastro(email: string) {

    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    console.log(userCredential);

    if (userCredential.user) {
      //@ts-ignore
      const docRef = await setDoc(doc(db, "users", userCredential.user.uid), {
        email,
        username: user,
        role: level,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      await verify()
      window.location.href = "./login"
    }
    if (userCredential.user) {
    } else if (error.length > 0 && error[0].code === "auth/email-already-in-use") {
      return (" Email ja existe")

    }
  }




  async function handleLogin() {
    const provider = new GoogleAuthProvider

    const result = await signInWithPopup(auth, provider)

    console.log(result)

    if (result.user) {
      const docRef = await setDoc(doc(db, "users", result.user.uid), {
        email: result.user.email,
        username: result.user.displayName,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      window.location.href = "./login"

    }
    if (result.user) {
    } else if (error.length > 0 && error[0].code === "auth/email-already-in-use") {
      return (" Email ja existe")
    }

  }

  async function handleFacebookLogin() {
    const provider = new FacebookAuthProvider
    const result = await signInWithPopup(auth, provider)

    if (result.user) {
      const docRef = await setDoc(doc(db, "users", result.user.uid), {
        email,
        username: result.user.displayName,
        role: level,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      window.location.href = "./login"
    }
    if (result.user) {
    } else if (error.length > 0 && error[0].code === "auth/email-already-in-use") {
      return (" Email ja existe")
    }

  }

  async function handleGithubLogin() {
    const provider = new GithubAuthProvider
    const result = await signInWithPopup(auth, provider)

    if (result.user) {
      const docRef = await setDoc(doc(db, "users", result.user.uid), {
        email,
        username: result.user.displayName,
        role: level,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      window.location.href = "./login"
    }
    if (result.user) {
    } else if (error.length > 0 && error[0].code === "auth/email-already-in-use") {
      return (" Email ja existe")
    }
  }



  const handleSubmit = async () => {

    const valitValue = valit({ login: email, password: senha })

    if (!valitValue.success) {

      const array: any[] = []
      valitValue.error.issues.map((val: any) => {
        const test = val.message.replace('String', val.path[0])
        array.push(test)
      })
      setError(array)

    } else if (valitValue.success) {

      handleCadastro(email)

    }
  }

  return (


    <>

      <div className="relative w-screen h-screen  overflow-hidden">
        <div className="absolute inset-0 z-1">
          {[...Array(300)].map((_, i) => (
            <Star key={i} />
          ))}
        </div>


        <main className="flex min-h-screen flex-col items-center">

          <div className="flex items-center my-10 justify-center gap-3">
            <Image src="/image.png" alt="logo" width={75} height={75}></Image>
            <p className="text-white text-4xl font-bold p-4">UniVerse</p>
          </div>

          {content ? <pre>{JSON.stringify(content, null, 4)}</pre> : null}
          <div className="flex flex-col gap-5 w-[30rem] h-[35rem] p-4 rounded-[1rem]  items-center justify-center bg-black/60 backdrop-blur">

            <h1 className="text-white text-3xl font-bold p-4 ">Cadastro</h1>



            <div className="flex flex-col gap-3">

              <div className="flex flex-col">
                <input id="user" type="text" autoComplete="off" placeholder="Usuário" className="bg-zinc-800 rounded-md px-2 w-80 border-[1px] py-2 transition-colors ease-in-out duration-500 focus:border-violet-700 outline-none text-white " value={user} onChange={handleUserChange} />
              </div>

              <div className="flex flex-col">
                <input id="login" type="text" autoComplete="off" placeholder="Email" className="bg-zinc-800 rounded-md px-2 w-80 border-[1px] py-2 transition-colors ease-in-out duration-500 focus:border-violet-700 outline-none text-white " value={email} onChange={handleLoginChange} />
              </div>

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

            </div>

            <button className="bg-[#501ADD] rounded-lg border-0 text-white py-3 px-24 hover:bg-violet-600 transition-colors ease-in-out duration-300 " onClick={handleSubmit}>Cadastrar</button>
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

              <p className="text-white">Já tem uma conta?</p>
              <Link href="./login" className="text-violet-600 hover:text-violet-400">Entrar</Link>

            </div>

          </div>
        </main>

      </div>
    </>
  );
}
