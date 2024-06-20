"use client"

import { useState, useEffect } from "react"
import UserBoardsPanel from "./UserBoardsPanel"
import NewBoardPanel from "./NewBoardPanel"
import { Board } from "@/types/SuggestionBoard"

function SuggestionsPageLayout() {
  const [boards, setBoards] = useState<Board[]>([])

  return (
    <div className="w-full max-w-7xl mx-auto p-4 flex">
      <div className="w-2/3 p-4">
        <UserBoardsPanel boards={boards} setBoards={setBoards} />
      </div>
      <div className="w-1/3 p-4">
        <NewBoardPanel boards={boards} setBoards={setBoards} />
      </div>
    </div>
  )
}

export default SuggestionsPageLayout
