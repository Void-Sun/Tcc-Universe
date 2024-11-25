'use client'
import { useState } from "react";
import { db, addDoc, collection, serverTimestamp } from "../../firebase/firebase";

export default function Modal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [chatName, setChatName] = useState('');
    const [chatDescription, setChatDescription] = useState('');


    const handleCreateChat = async () => {
        if (!chatName || !chatDescription) {
            alert("Por favor, preencha todos os campos.");
            return;
        } else {


            try {
                await addDoc(collection(db, "chats"), {
                    name: chatName,
                    description: chatDescription,
                    createdAt: serverTimestamp(),
                });
                setChatName("");
                setChatDescription("");
                onClose();
            } catch (error) {
                console.error("Erro ao criar o chat:", error);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-[#0D081A] rounded-lg p-6 w-[30rem]">
                <h2 className="text-2xl text-white font-bold mb-4 flex justify-center">Criar nova materia</h2>
                <div className="bg-[#1E0D4A] p-6 rounded-lg  text-white relative flex flex-col items-center">

                    <div className="w-full">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-white">Nome:</label>
                            <input
                                type="text"
                                value={chatName}
                                onChange={(e) => setChatName(e.target.value)}
                                className="mt-1 block w-full p-2  bg-[#382270] outline-none rounded-md"
                                placeholder="Digite o nome"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-white">Descrição:</label>
                            <textarea
                                value={chatDescription}
                                onChange={(e) => setChatDescription(e.target.value)}
                                className="mt-1 block w-full p-2 bg-[#382270] outline-none rounded-md"
                                placeholder="Digite a descrição"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-5">
                    <button
                        className="bg-red-500 text-white py-2 px-4 rounded-md"
                        onClick={onClose}
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={handleCreateChat}
                        className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                        Criar
                    </button>
                </div>
            </div>
        </div>
    );
}
