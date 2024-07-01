import OwnerViewSuggestionCard from "@/components/dashboard/boards/OwnerViewSuggestionCard"
import { motion } from "framer-motion"
import { Board, Suggestion } from "@/types/SuggestionBoard"

interface KanbanColumnProps {
  title: string
  status: string
  suggestions: Suggestion[]
  onDrop: (e: React.DragEvent<HTMLDivElement>, status: string) => void
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void
  onDragStart: (e: React.DragEvent<HTMLDivElement>, suggestion: Suggestion) => void
  board: Board
  setBoard: (board: any) => void
}

const KanbanColumn = ({ title, status, suggestions, onDrop, onDragOver, onDragStart, board, setBoard }: KanbanColumnProps) => {
  return (
    <div className="flex flex-col w-full md:w-1/3 min-w-[200px] min-h-[300px] md:min-h-[800px] max-h-[800px] p-6 md:p-0">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div
        className="flex-grow bg-gray-200 p-4 rounded-lg overflow-y-auto"
        onDrop={(e) => onDrop(e, status)}
        onDragOver={onDragOver}
      >
        {suggestions
          .filter((suggestion: Suggestion) => suggestion.status === status)
          .map((suggestion: Suggestion, index: number) => (
            <motion.div
              key={index}
              draggable
              onDragStart={(e) => onDragStart(e as unknown as React.DragEvent<HTMLDivElement>, suggestion)}
            >
              <OwnerViewSuggestionCard suggestion={suggestion} board={board} setBoard={setBoard} />
            </motion.div>
          ))}
      </div>
    </div>
  )
}

export default KanbanColumn
