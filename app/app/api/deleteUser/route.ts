import { NextResponse } from "next/server";
import { getAuth } from "../../../../firebase/firebase-admin"; // Import the correct Firebase Admin module

export async function POST(req: Request) {
  try {
    const { uid } = await req.json();

    if (!uid) {
      return NextResponse.json(
        { error: "UID não fornecido." },
        { status: 400 }
      );
    }

    console.log("Tentando excluir UID:", uid);

    getAuth().deleteUser(uid)
   

    return NextResponse.json(
      { message: "Usuário excluído com sucesso." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Erro ao excluir usuário:", error);

    return NextResponse.json(
      { error: "Erro ao excluir usuário.", details: error.message },
      { status: 500 }
    );
  }
}

