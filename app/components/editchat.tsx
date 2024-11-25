'use client'
import { useState, useEffect } from "react";
import { auth, doc, getDoc, db, updateDoc } from '../../firebase/firebase';
import { storage } from '../../firebase/firebase'; // Importar o storage do Firebase
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Funções para trabalhar com storage

export default function EditChat({ Open, Close, chatId }: { Open: boolean; Close: () => void; chatId: string }) {
    const [chatInfo, setChatInfo] = useState<{ name: string; description: string }>({ name: "", description: "" });

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const chatRef = doc(db, "chats", chatId); // Use o método `doc` corretamente aqui
                const chatSnap = await getDoc(chatRef);

                if (chatSnap.exists()) {
                    setChatInfo(chatSnap.data() as { name: string; description: string });
                } else {
                    console.error("Chat não encontrado!");
                }
            } catch (error) {
                console.error("Erro ao buscar informações do chat:", error);
            }
        };

        fetchUserInfo();
    }, []);






    const handleUpdateProfile = async () => {

        try {
            const userRef = doc(db, "chats", chatId);
            await updateDoc(userRef, {
                name: chatInfo.name,
                description: chatInfo.description,
            });
            alert("Chat atualizado com sucesso!");
            window.location.reload();
            Close(); // Fechar modal após atualização
        } catch (error) {
            console.error("Erro ao atualizar o chat:", error);
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
                                <h2 className="text-xl font-bold">Editar Chat</h2>
                            </div>
                        </div>

                        <div className="bg-[#1E0D4A] p-6 rounded-lg text-white relative">
                            {/* Avatar */}
                            <div className="flex gap-3 items-center mb-4">
                                <div className="text-sm flex gap-3 flex-col">
                                    <div className="font-bold w-[20rem] flex flex-col gap-2">
                                        Nome do chat:
                                        <input
                                            className="rounded-sm px-2 py-1 bg-[#382270] focus:outline-none focus:ring-2 focus:ring-purple-600"
                                            type="text"
                                            placeholder="Novo Nome de Chat"
                                            value={chatInfo.name}
                                            onChange={(e) => setChatInfo({ ...chatInfo, name: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Divisor */}
                            <hr className="border-gray-400 my-4" />

                            {/* Sobre mim */}
                            <div className="text-sm">
                                <p className="font-bold mb-2">Descrição:</p>
                                <textarea
                                    className="w-full p-4 text-white bg-gray-800 border scrollbar border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none"
                                    rows={4}
                                    value={chatInfo.description}
                                    onChange={(e) => setChatInfo({ ...chatInfo, description: e.target.value })}
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
