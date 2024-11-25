'use client';
import React, { useState, useEffect } from "react";
import {
  auth,
  db,
  getDocs,
  collection,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  onAuthStateChanged,
} from "../../firebase/firebase";
import { useRouter } from "next/navigation";



const UserTable = () => {
  interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    isSuperAdmin?: boolean; // Flag para superadmin
  }

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const router = useRouter();

  // Verifica se o usuário é admin
  useEffect(() => {
    const checkAdminRole = async () => {
      try {
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            setCurrentUserId(user.uid);
            const userDoc = doc(collection(db, "users"), user.uid);
            const userSnapshot = await getDoc(userDoc);
            if (userSnapshot.exists()) {
              const userData = userSnapshot.data();
              setIsAdmin(userData.role === "adm");
            } else {
              console.error("Usuário não encontrado no Firestore.");
            }
          } else {
            router.push("/login");
          }
        });
      } catch (error) {
        console.error("Erro ao verificar a role do usuário:", error);
      }
    };

    checkAdminRole();
  }, [router]);

  // Buscar a lista de usuários do Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const userList: User[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.username || "N/A",
            email: data.email || "N/A",
            role: data.role || "Aluno",
            isSuperAdmin: data.isSuperAdmin || false,
          };
        });
        setUsers(userList);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    };

    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );

      const userDoc = doc(db, "users", userId);
      await updateDoc(userDoc, { role: newRole });
      console.log("Função atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar a função do usuário:", error);
    }
  };

  const saveAllChanges = async () => {
    try {
      const updates = users.map((user) => {
        const userDoc = doc(db, "users", user.id);
        return updateDoc(userDoc, { role: user.role });
      });
      await Promise.all(updates);
      alert("Alterações salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar alterações:", error);
    }
  };

  const deleteSelectedUsers = async () => {
    try {
      const uid = selectedUsers[0]; // Pega o primeiro UID da seleção
      console.log("Tentando excluir UID:", uid); // Log para verificar o UID
  
      const response = await fetch("/app/api/deleteUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Define o cabeçalho corretamente
        },
        body: JSON.stringify({ uid }), // Envia o UID no corpo
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
        await Promise.all(
          selectedUsers.map(async (userId) => {
            const userDoc = doc(db, "users", userId);
            await deleteDoc(userDoc); // Exclui o usuário do Firestore
          })
        );
  
      const result = await response.json();
      console.log("Usuário excluído com sucesso:", result);
  
      setUsers((prev) => prev.filter((user) => !selectedUsers.includes(user.id)));
      setSelectedUsers([]);
      alert("Usuários selecionados excluídos com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir os usuários selecionados:", error);
    }
  };
  
  



  if (!isAdmin) {
    return (
      <div className="container mx-auto text-center">
        <p className="text-xl text-red-500">
          Acesso negado. Você não é um administrador.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-black">
      <div className="container mx-auto">
        <div className="flex w-full justify-center h-24 items-center">
          <h1 className="text-2xl font-bold mb-4 text-white">Usuários</h1>
        </div>
        <div className="bg-black shadow-md rounded-lg p-4">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-white">ID</th>
                <th className="px-4 py-2 text-left text-white">Nome</th>
                <th className="px-4 py-2 text-left text-white">Email</th>
                <th className="px-4 py-2 text-left text-white">Role</th>
                <th className="px-4 py-2 text-left text-white">Ação</th>
                <th className="px-4 py-2 text-left text-white">Select</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="px-4 py-2 text-white">{user.id}</td>
                  <td className="px-4 py-2 text-white">{user.name}</td>
                  <td className="px-4 py-2 text-white">{user.email}</td>
                  <td className="px-4 py-2 text-white">{user.role}</td>
                  <td className="px-4 py-2 text-white">
                    {user.isSuperAdmin ? (
                      <span className="text-gray-500">Superadmin</span>
                    ) : (
                      <select
                        className="border rounded p-2 bg-black text-white"
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        disabled={user.id === currentUserId}
                      >
                        <option value="Aluno">Aluno</option>
                        <option value="Professor">Professor</option>
                        <option value="adm">Administrador</option>
                      </select>
                    )}
                  </td>
                  <td className="px-4 py-2 text-white">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="hidden peer"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers((prev) => [...prev, user.id]);
                          } else {
                            setSelectedUsers((prev) =>
                              prev.filter((id) => id !== user.id)
                            );
                          }
                        }}
                      />
                      <div className="w-5 h-5 border-2 border-gray-300 rounded peer-focus:ring-2 peer-focus:ring-blue-500 peer-checked:bg-white"></div>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Exibir UIDs dos usuários selecionados */}
          <div className="mt-4">
            <h2 className="text-white text-lg">Usuários Selecionados:</h2>
            <ul className="text-white">
              {selectedUsers.map((userId) => (
                <li key={userId}>{userId}</li>
              ))}
            </ul>
          </div>

          <div className="mt-10 w-full flex justify-end gap-1">
            <button
              className="w-40 h-10 rounded-lg bg-white text-black"
              onClick={() => {
                window.location.href = "./start";
              }}
            >
              Voltar para o chat
            </button>
            <button
              className="w-20 h-10 rounded-lg text-white bg-red-500"
              onClick={deleteSelectedUsers}
              disabled={selectedUsers.length === 0}
            >
              Excluir
            </button>
            <button
              className="w-20 h-10 rounded-lg bg-white text-black"
              onClick={saveAllChanges}
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default UserTable;
