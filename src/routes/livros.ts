import { Router, Request, Response } from "express";
import { prisma } from "../prisma";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
    const livros = await prisma.livro.findMany({
        include: {
            genero: true
        }
    });

    res.json(livros);
});

router.post("/", async (req: Request, res: Response) => {
    const {titulo, generoId} = req.body;

    if(!titulo || !generoId) {
        return res.status(400).json({
            erro: "Titulo e generoId são obrigatorios."
        });
    }

    const genero = await prisma.genero.findUnique({
        where: {id: Number(generoId)}
    });

    if (!genero) {
        return res.status(404).json({
            erro: "Gênero não encontrado."
        });
    }

    const livro = await prisma.livro.create({
        data: {
            titulo,
            generoId: Number(generoId)
        },
        include: { 
            genero: true
        }
    });

    res.status(201).json(livro);
});

router.put("/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { titulo, generoId } = req.body;

    const livroAtualizado = await prisma.livro.update({
        where: {id},
        data: {
            titulo: titulo,
            generoId: Number(generoId)
        },
        include: {
            genero: true
        }
    });

    res.json(livroAtualizado);
    
});

export default router