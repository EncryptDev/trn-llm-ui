import { create } from "zustand";

type MateriState = {
    id: string;
    setId: (id: string) => void
}

export const useMateriIdState = create<MateriState>((set) => ({
    id: "",
    setId: (idS: string) => set((state) => ({ id: idS }))
}))