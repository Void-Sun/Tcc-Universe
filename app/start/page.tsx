'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import {
    auth,
    db,
    collection,
    doc,
    onSnapshot,
    getDoc,
    getDocs,
    deleteDoc,
    setDoc,
} from '../../firebase/firebase';
import Chat from '../components/chat';
import ChatIntro from "../components/chatintro";
import Modal from "../components/newchat";
import Perfil from "../components/perfil";
import InfoModal from "../components/infochat";
import MessageItem from "../components/messageitem";
import SettingsModal from "../components/config";


// Componente Chatroom (exibição de mensagens)
const Chatroom = ({ user, chatId, onClose }: any) => {
    const [infoModalOpen, setInfoModalOpen] = useState(false);
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const [chatInfo, setChatInfo] = useState<{ name: string }>({ name: "" });
    const [list, setList] = useState([{}]);

    const openInfoModal = (chatId: string) => {
        setSelectedChatId(chatId);
        setInfoModalOpen(true);
    };

    const closeInfoModal = () => setInfoModalOpen(false);

    useEffect(() => {
        if (!chatId) {
            console.error("Chat ID não definido.");
            return;
        }

        const fetchChatInfo = async () => {
            try {
                const chatRef = doc(db, "chats", chatId);
                const chatSnap = await getDoc(chatRef);

                if (chatSnap.exists()) {
                    setChatInfo(chatSnap.data() as { name: string });
                }
            } catch (error) {
                console.error("Erro ao buscar informações do chat:", error);
            }
        };

        fetchChatInfo();
    }, [chatId]);

    return (
        <>
            <div className="conversa flex justify-center w-full">
                <div className="bg-[#1E0D4A] dark:bg-[#342755] rounded-[2rem] w-[70vw] mt-3 h-[5rem] flex justify-between items-center p-4 fixed top-0 z-50">
                    <button onClick={onClose}>
                        <Image src='/back.svg' alt='Voltar' width={45} height={45} />
                    </button>
                    <div className="flex gap-2 items-center">
                        <Image src='/image.png' alt='Chat' width={35} height={35} />
                        <h1 className="text-white text-2xl">{chatInfo.name}</h1>
                    </div>
                    <button className="m-1" onClick={() => openInfoModal(chatId)}>
                        <Image src='/more.svg' alt='Mais opções' width={30} height={30} />
                    </button>

                    {selectedChatId && (
                        <InfoModal
                            isOpen={infoModalOpen}
                            onClose={closeInfoModal}
                            chatId={selectedChatId}
                        />
                    )}
                </div>
            </div>

            {list.map((item, key) => (
                <MessageItem key={key} data={item} user={user} chatId={chatId} />
            ))}
        </>
    );
};


export default function Home() {
    const [userInfo, setUserInfo] = useState<{ username: string; description: string; role: string }>({ username: "", description: "", role: "" });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [openProfile, setOpenProfile] = useState(false);
    const [chats, setChats] = useState<ChatData[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [favorites, setFavorites] = useState<string[]>([]);
    const [showFavorites, setShowFavorites] = useState(false);
    const [filteredChats, setFilteredChats] = useState<ChatData[]>([]);
    const [activeChat, setActiveChat] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "chats"), (snapshot) => {
            const chatData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as Omit<ChatData, "id">),
            }));
            setChats(chatData);
            setFilteredChats(chatData);
        });
        return () => unsubscribe();
    }, []);


    useEffect(() => {
        const fetchUserInfo = async () => {
            if (!auth.currentUser) return;

            try {
                const userRef = doc(db, "users", auth.currentUser.uid);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    const userData = userSnap.data() as { username: string; description: string; role: string };
                    setUserInfo(userData);
                }
            } catch (error) {
                console.error("Erro ao buscar informações do usuário:", error);
            }
        };

        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            if (currentUser) {
                setUser({
                    id: currentUser.uid,
                    displayName: currentUser.displayName,
                    avatar: currentUser.photoURL,
                    email: currentUser.email,
                });
                fetchUserInfo();
            }
        });

        return () => unsubscribe();
    }, []);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const term = event.target.value.toLowerCase();
        setSearchTerm(term);

        const results = chats.filter(chat =>
            chat.name.toLowerCase().includes(term) || chat.description.toLowerCase().includes(term)
        );
        setFilteredChats(results);
    };


    const handleFilterToggle = () => {
        setShowFavorites(!showFavorites);

        if (!showFavorites) {
            setFilteredChats(chats.filter((chat) => favorites.includes(chat.id)));
        } else {
            setFilteredChats(chats);  // Exibe todos os chats
        }
    };



    const addFavorite = async (userId: string, chatId: string) => {
        try {
            // Adiciona um documento na subcoleção "favorites" do usuário
            await setDoc(doc(db, "users", userId, "favorites", chatId), {
                chatId: chatId,
            });
            console.log("Chat favoritado com sucesso!");
        } catch (error) {
            console.error("Erro ao adicionar favorito:", error);
        }
    };


    const removeFavorite = async (userId: string, chatId: string) => {
        try {
            // Remove o documento da subcoleção "favorites" do usuário
            await deleteDoc(doc(db, "users", userId, "favorites", chatId));
            console.log("Chat removido dos favoritos!");
        } catch (error) {
            console.error("Erro ao remover favorito:", error);
        }
    };



    const handleFavoriteToggle = async (chatId: string) => {
        const userId = auth.currentUser?.uid;

        if (!userId) {
            console.error("Usuário não autenticado");
            return;
        }

        // Verifica se o chatId já está nos favoritos
        const isFavorite = favorites.includes(chatId);

        // Atualiza os favoritos no Firestore
        if (isFavorite) {
            await removeFavorite(userId, chatId);  // Remove dos favoritos no Firestore
        } else {
            await addFavorite(userId, chatId);  // Adiciona aos favoritos no Firestore
        }

        // Atualiza o estado de favoritos localmente
        const updatedFavorites = isFavorite
            ? favorites.filter(id => id !== chatId)
            : [...favorites, chatId];

        setFavorites(updatedFavorites);

        // Atualiza os favoritos no localStorage
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    };


    const fetchFavorites = async (userId: string) => {
        if (!userId) return [];

        const favoritesRef = collection(db, "users", userId, "favorites");
        const snapshot = await getDocs(favoritesRef);

        // Extrai os IDs dos chats favoritos
        const favoriteChats = snapshot.docs.map(doc => doc.id);

        return favoriteChats;
    };


    // Ao carregar o componente
    useEffect(() => {
        const userId = auth.currentUser?.uid;

        if (userId) {
            // Buscar favoritos do Firestore
            const fetchAndUpdateFavorites = async () => {
                const firestoreFavorites = await fetchFavorites(userId);

                // Atualiza os favoritos no estado
                setFavorites(firestoreFavorites);

                // Também armazena no localStorage para persistência
                localStorage.setItem('favorites', JSON.stringify(firestoreFavorites));
            };

            fetchAndUpdateFavorites();
        }

        
    }, [auth.currentUser?.uid]);

    


    const CreateChat = () => (
        <>
            <button onClick={() => setIsModalOpen(true)} className="m-1">
                <Image src="/chat.svg" alt="Novo chat" width={20} height={20} />
            </button>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );

    const handleChatClose = () => setActiveChat(null);

    if (!auth.currentUser?.emailVerified) {
        return (
            <div className="flex justify-center items-center h-full w-full">
                <Image src="/lock.svg" alt="Sua conta ainda não foi verificada" width={100} height={100} />
                <p className="text-white text-2xl font-bold">
                    Verifique seu email para acessar UniVerse.
                </p>
            </div>
        );
    }

    return (
        <div className="flex w-full h-full bg-[#0D081A] dark:bg-[#6b4cba]">
            <div className="flex h-screen bg-[#0D081A] dark:bg-[#6b4cba]">
                <div className="flex justify-center h-full w-[21rem] p-6">
                    <div className="w-full h-full rounded-[3rem] bg-[#1E0D4A] dark:bg-[#483083] flex flex-col">
                        <div className="flex items-center my-3 justify-center w-full h-[3rem] gap-1">
                            <Image src="/image.png" alt="UniVerse" width={50} height={50} />
                            <p className="text-white text-2xl font-bold p-4">UniVerse</p>
                        </div>

                        <div className="flex w-full h-[4rem] items-center justify-center bg-[#10003A] dark:bg-[#342755]">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="bg-transparent m-2 text-white outline-none w-full"
                                placeholder="Buscar Matéria"
                            />
                            {userInfo.role === "Professor" && <CreateChat />}
                        </div>
                        <button
                            className="text-white mx-2"
                            onClick={handleFilterToggle}
                        >
                            {showFavorites ? "Favoritos" : "Todos"}
                        </button>

                        <div className="scrollbar bg-[#2C1B39] dark:bg-[#8f6bab] overflow-y-scroll flex-1">
                            {filteredChats.map((chat) => (
                                <Chat
                                    onClick={() => setActiveChat(chat)}
                                    active={activeChat?.id === chat.id}
                                    data={{ title: chat.name, description: chat.description }}
                                    isFavorite={favorites.includes(chat.id)} // Checa se o chat está nos favoritos
                                    onFavoriteToggle={() => handleFavoriteToggle(chat.id)} // Alterna favorito
                                />

                            ))}
                        </div>

                        <div className="flex w-full items-center h-[6rem] justify-center">
                            {user ? (
                                <div className="flex items-center w-full p-10 justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setOpenProfile(true)}>
                                            <img src={user.avatar || "/Guest.png"} alt={`${user.displayName}'s avatar`} className="w-12 h-12 rounded-full" />
                                            <p className="text-white">{userInfo.username || user.displayName}</p>
                                        </div>
                                        <Perfil Open={openProfile} Close={() => setOpenProfile(false)} />
                                    </div>
                                    <div>
                                        <div onClick={() => setIsSettingsOpen(true)} className="flex items-center gap-2 cursor-pointer">
                                            <Image src="/config.svg" alt="Configurações" width={30} height={40} />
                                        </div>
                                        <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
                                    </div>
                                </div>
                            ) : (
                                <p className="text-white">Nenhum usuário autenticado</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full h-full p-6 bg-[#0D081A] dark:bg-[#6b4cba]">
                {activeChat ? (
                    <Chatroom user={user} chatId={activeChat.id} onClose={handleChatClose} />
                ) : (
                    <ChatIntro />
                )}
            </div>
        </div>
    );
}

// Tipos
interface ChatData {
    id: string;
    name: string;
    description: string;
}
