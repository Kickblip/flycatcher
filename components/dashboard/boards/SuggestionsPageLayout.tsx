"use client"

import { useState } from "react"
import UserBoardsPanel from "./UserBoardsPanel"
import NewBoardPanel from "./NewBoardPanel"
import { Board } from "@/types/SuggestionBoard"

function SuggestionsPageLayout() {
  const [boards, setBoards] = useState<Board[]>([])

  return (
    <div className="w-full max-w-7xl mx-auto md:p-4 flex flex-col md:flex-row">
      <div className="w-full md:w-2/3 p-4">
        <UserBoardsPanel boards={boards} setBoards={setBoards} />
      </div>
      <div className="w-full md:w-1/3 p-4">
        <NewBoardPanel boards={boards} setBoards={setBoards} />
      </div>
    </div>
  )
}

export default SuggestionsPageLayout
