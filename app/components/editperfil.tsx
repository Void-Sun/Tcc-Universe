'use client'
import { useState, useEffect } from "react";
import { auth, doc, getDoc, db, updateDoc } from '../../firebase/firebase';
import { storage } from '../../firebase/firebase'; // Importar o storage do Firebase
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Funções para trabalhar com storage

export default function EditPerfil({ Open, Close }: { Open: boolean; Close: () => void }) {

    const [editInfo, setEditInfo] = useState<{ username: string; description: string }>({ username: "", description: "" });
    const [selectedImage, setSelectedImage] = useState<File | null>(null); // Armazena o arquivo da imagem
    const [imageUrl, setImageUrl] = useState<string | null>(null); // Armazena a URL da imagem

    // Busca as informações do usuário no Firestore
    useEffect(() => {
        const fetchUserInfo = async () => {
            if (!auth.currentUser) {
                console.error("Nenhum usuário autenticado");
                return;
            }

            try {
                // Usar o UID como chave única para buscar informações
                const editRef = doc(db, "users", auth.currentUser.uid);
                const editSnap = await getDoc(editRef);

                if (editSnap.exists()) {
                    const userData = editSnap.data() as { username: string; description: string, imageUrl: string };
                    setEditInfo(userData);  // Atualiza o estado com o nome de usuário e descrição
                    setImageUrl(userData.imageUrl || null); // Define a URL da imagem, se existir
                } else {
                    console.error("Documento do usuário não encontrado no Firestore");
                }
            } catch (error) {
                console.error("Erro ao buscar informações do usuário:", error);
            }
        };

        fetchUserInfo();
    }, []);


   



    const handleUpdateProfile = async () => {
        if (!auth.currentUser) {
            console.error("Nenhum usuário autenticado");
            return;
        }

        
        try {
            const userRef = doc(db, "users", auth.currentUser.uid);
            await updateDoc(userRef, {
                username: editInfo.username,
                description: editInfo.description,
            });
            alert("Perfil atualizado com sucesso!");
            window.location.reload();
            Close(); // Fechar modal após atualização
        } catch (error) {
            console.error("Erro ao atualizar o perfil:", error);
        }
    };

    if (!Open) return null; // Não renderiza o modal se não estiver aberto

    return (
        <div className="flex items-center justify-center ">
            {/* Modal */}
            {Open && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-[#0D081A] p-6 rounded-lg text-white relative">
                        <div className="flex justify-between flex-col items-center mb-4">
                            <div className="w-full">
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
                            </div>
                            <div className="flex items-center justify-center w-full">
                                <h2 className="text-xl font-bold">Editar Perfil</h2>
                            </div>
                        </div>

                        <div className="bg-[#1E0D4A] p-6 rounded-lg text-white relative">
                            {/* Avatar */}
                            <div className="flex gap-3 items-center mb-4">
                                <div className="text-sm flex gap-3 flex-col">
                                    <div className="font-bold w-[20rem] flex flex-col gap-2">
                                        Nome de Usuário:
                                        <input
                                            className="rounded-sm px-2 py-1 bg-[#382270] focus:outline-none focus:ring-2 focus:ring-purple-600"
                                            type="text"
                                            placeholder="Novo Nome de Usuário"
                                            value={editInfo.username}
                                            onChange={(e) => setEditInfo({ ...editInfo, username: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Divisor */}
                            <hr className="border-gray-400 my-4" />

                            {/* Sobre mim */}
                            <div className="text-sm">
                                <p className="font-bold mb-2">Sobre mim:</p>
                                <textarea
                                    className="w-full p-4 text-white bg-gray-800 border scrollbar border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none"
                                    rows={4} 
                                    value={editInfo.description}
                                    onChange={(e) => setEditInfo({ ...editInfo, description: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            className="w-full mt-6 bg-[#1E0D4A] hover:bg-[#1e0d4a5e] py-2 rounded text-white"
                            onClick={handleUpdateProfile}
                        >
                            Confirmar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
