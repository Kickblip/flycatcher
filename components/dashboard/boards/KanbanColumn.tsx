import OwnerViewSuggestionCard from "@/components/dashboard/boards/OwnerViewSuggestionCard"
import { motion } from "framer-motion"
import { Suggestion } from "@/types/SuggestionBoard"

interface KanbanColumnProps {
  title: string
  status: string
  suggestions: Suggestion[]
  onDrop: (e: React.DragEvent<HTMLDivElement>, status: string) => void
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void
  onDragStart: (e: React.DragEvent<HTMLDivElement>, suggestion: Suggestion) => void
}

const KanbanColumn = ({ title, status, suggestions, onDrop, onDragOver, onDragStart }: KanbanColumnProps) => {
  return (
    <div className="flex flex-col w-1/3 min-w-[200px]">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="flex-grow bg-gray-100 p-4 rounded-lg" onDrop={(e) => onDrop(e, status)} onDragOver={onDragOver}>
        {suggestions
          .filter((suggestion: Suggestion) => suggestion.status === status)
          .map((suggestion: Suggestion, index: number) => (
            <motion.div
              key={index}
              draggable
              onDragStart={(e) => onDragStart(e as unknown as React.DragEvent<HTMLDivElement>, suggestion)}
            >
              <OwnerViewSuggestionCard suggestion={suggestion} />
            </motion.div>
          ))}
      </div>
    </div>
  )
}

export default KanbanColumn
