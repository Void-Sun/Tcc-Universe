import { useState, useEffect } from "react";
import { auth, db, getDocs, collection, doc, getDoc, updateDoc } from "../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

type SettingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(false);

  const [userInfo, setUserInfo] = useState<{ username: string; description: string; role: string }>({ username: "", description: "", role: "" });

  // Carregar a preferência salva no localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    }

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

    fetchUserInfo();
  }, []);

  // Alternar tema
  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setIsDarkMode(!isDarkMode);


  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#0D081A] w-80 max-w-md p-6 rounded-lg shadow-lg relative">
        <h2 className="text-xl font-semibold mb-4 text-white">Configurações</h2>  

        {/* Seção de Tema */}
        <div className="mb-4 flex gap-5 flex-col w-48">

          <button
            onClick={toggleTheme}
            className=" bg-[#1E0D4A] hover:bg-[#1e0d4a5e] p-2 rounded-md bg-primary-light dark:bg-primary-dark text-white"
          >
            {isDarkMode ? "Modo Claro" : "Modo Escuro"}
          </button>

          <button
            onClick={() => setIsTermsOpen(true)}
            className="px-4 py-2 bg-[#1E0D4A] text-white rounded hover:bg-[#1e0d4a5e] "
          >
            Termos e Condições
          </button>

          {userInfo.role === "adm" && <button onClick={() => {
            window.location.href = "./admin"
          }} className=" bg-[#1E0D4A] text-white px-4 py-2 rounded">Admin</button>}

        </div>
        <div className="mt-6 flex justify-end">

          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#1E0D4A] text-white rounded hover:bg-[#1e0d4a5e]"
          >
            Fechar
          </button>
        </div>
      </div>

      {/* Modal de Termos e Condições */}
      {isTermsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-scroll scrollbar">
          <div className="bg-[#0D081A] w-full max-w-lg p-6 rounded-lg shadow-lg relative">
            <h2 className="text-xl text-white font-semibold mb-4">Termos e Condições</h2>
            <button
              onClick={() => setIsTermsOpen(false)}
              className="absolute top-4 right-4 text-white-600 hover:text-gray-800"
            >
              X
            </button>
            <div className=" overflow-y-auto h-96 scrollbar">
              <p className="text-white mb-4">
                Estes são os Termos e Condições. Ao usar este aplicativo, você
                concorda com todas as políticas descritas aqui.
              </p>
              <p className="text-white mb-4">
                Por favor, leia atentamente todos os termos antes de continuar.
                Estes incluem as condições de uso e as diretrizes de privacidade.
              </p>
              <p className=" text-white mb-4">
                Ao acessar nosso site ou utilizar nossos serviços, você declara ter lido, compreendido e aceitado estes Termos e Condições

                O uso do serviço é permitido apenas para fins lícitos e de acordo com as legislações aplicáveis.
                Você concorda em não usar o serviço para enviar conteúdo ofensivo, prejudicial, fraudulento ou que viole os direitos de terceiros.

                Todo o conteúdo, incluindo textos, imagens, gráficos e software, é protegido por direitos autorais e outras leis de propriedade intelectual.
                É proibida a reprodução, distribuição ou modificação sem autorização prévia.

                Você é responsável por manter a confidencialidade de sua conta e senha.
                Informe-nos imediatamente sobre qualquer uso não autorizado de sua conta.

                Não nos responsabilizamos por eventuais perdas, danos ou interrupções de serviço causados por fatores fora de nosso controle.
                O serviço é fornecido "como está", sem garantias de qualquer tipo.

                Reservamo-nos o direito de modificar estes Termos a qualquer momento. Quaisquer alterações serão notificadas por meio do site ou outros canais apropriados.

                Podemos suspender ou encerrar sua conta a qualquer momento, caso você viole estes Termos.

                Estes Termos são regidos pelas leis locais aplicáveis. Qualquer disputa será resolvida no foro da comarca correspondente ao endereço do provedor do serviço.</p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsTermsOpen(false)}
                className="px-4 py-2 bg-[#1E0D4A] text-white rounded hover:bg-[#1e0d4a5e]"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
