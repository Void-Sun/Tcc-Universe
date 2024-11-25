import { useEffect, useState } from "react";
import { auth, db, doc, getDoc, deleteDoc } from "../../firebase/firebase";
import EditChat from "./editchat";

export default function InfoModal({ isOpen, onClose, chatId }: { isOpen: boolean; onClose: () => void; chatId: string }) {
    const [userInfo, setUserInfo] = useState<{ role: string }>({ role: "" });
    const [chatInfo, setChatInfo] = useState<{ name: string; description: string }>({ name: "", description: "" });

    const [openEditChat, setopenEditChat] = useState(false);
    const oproChat = () => setopenEditChat(true);
    const cproChat = () => setopenEditChat(false);


    useEffect(() => {
        if (!isOpen || !chatId) return;

        const fetchChatInfo = async () => {
            try {
                const chatRef = doc(db, "chats", chatId);
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

        fetchChatInfo();

        const fetchUserInfo = async () => {
            if (!auth.currentUser) {
                console.error("Nenhum usuário autenticado");
                return;
            }

            try {
                const userRef = doc(db, "users", auth.currentUser.uid);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    const userData = userSnap.data() as { role: string };
                    setUserInfo(userData);  // Atualiza o estado com o nome de usuário e descrição
                } else {
                    console.error("Documento do usuário não encontrado no Firestore");
                }
            } catch (error) {
                console.error("Erro ao buscar informações do usuário:", error);
            }
        };
        fetchUserInfo();
    }, [isOpen, chatId]);




    const Buttonedit = () => {
        return (
            <>
                <button className="w-32 bg-[#1E0D4A] hover:bg-[#1e0d4a5e] py-2 rounded text-white" onClick={oproChat}>
                    Editar chat
                </button>
                <EditChat
                    Open={openEditChat}
                    Close={cproChat}
                    chatId={chatId}
                />
            </>
        )
    };

    const Buttondelete = () => {
        return (
            <>
                <div className="flex m-4 w-full justify-end items-right">
                    <button className="w-full bg-[#bb5045] hover:bg-[#1e0d4a5e] py-2 rounded text-white" onClick={() => handleDeleteChat(chatId)}>Deletar chat</button>
                </div>
            </>
        )
    };

    const handleDeleteChat = async (chatId: string) => {
        try {
            await deleteDoc(doc(db, "chats", chatId));
            window.location.reload();
        } catch (error) {
            console.error("Erro ao excluir a chat:", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-[#0D081A] rounded-lg p-6 flex flex-col items-center justify-center">
                <div className="w-full flex m-4 justify-between items-center text-white">
                    <button onClick={onClose}>
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
                    {(userInfo.role === "Professor") ? (
                        <Buttonedit />

                    ) : (
                        <></>
                    )}
                </div>
                <h2 className="text-2xl text-white font-bold mb-4">Materia</h2>
                <div className="bg-[#1E0D4A]  p-6 rounded-lg text-white relative flex flex-col items-center">
                    <div className="w-96">
                        <div className="mb-4 flex gap-2">
                            <h1 className="text-md font-bold text-white">Nome:</h1>
                            <p className="text-white">{chatInfo.name}</p>
                        </div>
                        <div className="mb-4 flex gap-2">
                            <h1 className="text-md font-bold text-white">Descrição:</h1>
                            <p className="text-white w-72 break-words whitespace-normal">{chatInfo.description}</p>
                        </div>

                    </div>
                </div>
                {
                    (userInfo.role === "Professor") ? (
                        <Buttondelete />

                    ) : (
                        <></>
                    )

                }


            </div>
        </div>
    );
}
