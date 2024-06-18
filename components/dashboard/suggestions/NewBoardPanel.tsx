function NewBoardPanel() {
  return (
    <div className="flex flex-col p-4 space-y-8 bg-gray-50 h-full rounded-lg">
      <h2 className="text-xl font-bold opacity-80">Add a new suggestion board</h2>
      <div className="flex flex-col">
        <input type="text" id="boardName" placeholder="Board name" className="mt-1 p-2 border border-gray-300 rounded-lg" />
      </div>
      <button className="mt-auto p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition duration-200">
        Create
      </button>
    </div>
  )
}

export default NewBoardPanel
