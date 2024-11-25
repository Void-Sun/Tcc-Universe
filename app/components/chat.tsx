import Image from "next/image";

export default function Chat({ onClick, active, data, isFavorite, onFavoriteToggle }: any) {

    
    return (
        <div 
            className={`${active ? 'bg-[#735fa5a4]' : ''} flex items-center flex-col`} 
            onClick={onClick}
        >
            <div className="flex items-center w-full h-[4rem] justify-between hover:bg-[#40345da4] hover:rounded-[0.2rem] transition-colors ease-in-out duration-150 hover:cursor-pointer p-5">
                <div className="w-full overflow-hidden whitespace-nowrap text-overflow">
                    <p className="text-white text-xl">{data.title}</p>
                    <p className="text-opacity-60 text-white text-sm">
                        {data.description.length > 30 ? data.description.substring(0, 30) + '...' : data.description}
                    </p>
                </div>
                <div className="flex items-center h-full">
                    {/* Botão para alternar favorito */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation(); // Impede que o clique no botão afete o clique no chat
                            onFavoriteToggle(); // Alterna o estado de favorito
                        }}
                        className="focus:outline-none"
                    >
                        <Image
                            src={isFavorite ? "/star-full.svg" : "/star-unfull.svg"} // Ícones de favorito
                            alt={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                            width={24}
                            height={24}
                        />
                    </button>
                </div>
            </div>
            <hr className="w-[90%] border-[#9b8eb967]" />
        </div>
    );
}
