import Image from "next/image";

export default function ChatIntro() {
    return (
        <div className="flex w-full h-full flex-col items-center justify-center">
            <Image src='New_Start.svg' alt="n" width={500} height={500}></Image>
            <h1 className="font-bold text-4xl text-[#241034]">O Universo na palma da sua mão</h1>
        </div>
    )
}