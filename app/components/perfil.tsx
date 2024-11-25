'use client'
import { useState, useEffect } from "react";
import Image from "next/image";
import EditPerfil from "./editperfil";
import { auth, doc, getDoc, db, signOut } from '../../firebase/firebase';

export default function Perfil({ Open, Close }: { Open: boolean; Close: () => void }) {
  const [openProfile, setopenProfile] = useState(false);
  const oprofile = () => setopenProfile(true);
  const cprofile = () => setopenProfile(false);

  const [user, setUser] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<{ username: string; description: string }>({ username: "", description: "" });

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!auth.currentUser) {
        console.error("Nenhum usuário autenticado");
        return;
      }

      try {
        // Usar o UID como chave única para buscar informações
        const userRef = doc(db, "users", auth.currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data() as { username: string; description: string };
          setUserInfo(userData);  // Atualiza o estado com o nome de usuário e descrição
        } else {
          console.error("Documento do usuário não encontrado no Firestore");
        }
      } catch (error) {
        console.error("Erro ao buscar informações do usuário:", error);
      }
    };

    // Assina para detectar mudanças no estado de autenticação do Firebase
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        const userData = {
          id: currentUser.uid,
          displayName: currentUser.displayName,
          avatar: currentUser.photoURL,
          email: currentUser.email,
        };
        setUser(userData); // Armazena os dados do usuário autenticado
        fetchUserInfo();   // Chama a função para buscar informações no Firestore
      } else {
        console.error("Usuário não autenticado");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "./login"; // Redireciona para a página de login
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  if (!Open) return null; // Não renderiza o modal se não estiver aberto

  return (
    <div className="flex items-center justify-center ">
      {/* Modal */}
      {Open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-[#0D081A] p-6 rounded-lg  text-white relative">
            {/* Conteúdo do perfil de usuário */}
            <div className="flex justify-between flex-col items-center mb-4">
              <div className="flex justify-between items-center w-full mb-4">
                <button className="text-lg text-white" onClick={Close}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-1 rounded">
                  Sair
                </button>
              </div>
              <h2 className="text-xl font-bold">Perfil</h2>
            </div>

            <div className="bg-[#1E0D4A] p-4 rounded-lg text-white relative">
              {/* Informações do perfil */}
              <div className="flex gap-4 items-center mb-4">
                <img
                  className="w-24 h-24 rounded-full mb-4"
                  src={user?.avatar || "./Guest.png"}
                  alt="User Avatar"
                />
                <div className="text-sm">
                  <p>
                    <span className="font-bold">Usuário: </span>{userInfo.username || user?.displayName}
                  </p>
                  <p>
                    <span className="font-bold">E-mail: </span>{user?.email}
                  </p>
                </div>
              </div>

              {/* Divisor */}
              <hr className="border-gray-400 my-4" />

              {/* Seção "Sobre mim" */}
              <div className="text-sm">
                <p className="font-bold mb-2">Sobre mim:</p>
                <p className="text-gray-300">
                  {userInfo.description || "Adicione uma descrição no seu perfil."}
                </p>
              </div>
            </div>
            <button className="w-full mt-6 bg-[#1E0D4A] hover:bg-[#1e0d4a5e] py-2 rounded text-white" onClick={oprofile}>
              Editar Perfil
            </button>
            <EditPerfil Open={openProfile} Close={cprofile} />
          </div>
        </div>
      )}
    </div>
  );
}
