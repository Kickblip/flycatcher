import { WaitlistPage } from "@/types/WaitlistPage"
import { create } from "zustand"

interface WaitlistStore {
  waitlist: WaitlistPage | null
  update: (waitlist: WaitlistPage) => void
}

export const useWaitlistStore = create<WaitlistStore>((set) => ({
  waitlist: null,
  update: (waitlist) => set(() => ({ waitlist })),
}))
