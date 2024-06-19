import React, { ChangeEvent, useEffect, useState } from "react"
import tinycolor from "tinycolor2";

interface Suggestion {
    title: string;
    description: string;
  }
  
interface SuggestionCardProps {
    suggestions: Suggestion[];
    boardData: any
    }


export const SuggestionCard: React.FC<SuggestionCardProps> = ({ suggestions, boardData }) =>{
    return(
        <div className="h-screen w-full text-neutral-50"
        style={{ backgroundColor: boardData?.primaryColor }}> 
            <Board suggestions={suggestions} boardData={boardData} />
        </div>
    )
}

const Board: React.FC<SuggestionCardProps> = ({ suggestions, boardData }) => {
    const [cards, setCards] = useState<Suggestion[]>([])
    useEffect(() => {
        setCards(suggestions)
    }, [suggestions])
    return(
        <div className="h-full w-full overflow-x-hidden ">
            <div className="flex gap-3 overflow-x-scroll scrollbar-hide" style={{ scrollbarWidth: "none" }}>
                <Column
                    title={"Suggestions"}
                    column={"todo"}
                    headingColor={boardData?.textColor}
                    cards={cards}
                    setCards={setCards}
                    boardData={boardData}
                />
            </div>
        </div>
    )
}

const Column = ({ title, headingColor, column, cards, boardData }: {
    title: string,  
    headingColor: string,
    column: any,  
    cards: any[],  
    setCards: Function, 
    boardData: any  
  }) => {
    const filteredCards = cards.filter((c) => c.column === column)

    return(
        <div className="w-full">
            <div className="mb-3 flex items-center justify-between">
                <h3 className='font-medium' style={{ color: headingColor }}>{title}</h3>
                <span className="rounded text-sm" style={{ color: headingColor }}>{filteredCards.length}</span>
            </div>
            <div className="h-full overflow-y-auto">
                {filteredCards.map((c) => (
                    <Card key={c.id} {...c} boardData={boardData} />
                ))}
            </div>
        </div>
    )
}

const Card = ({ title, description, votes: initialVotes, comments: initialComments, boardData }: {
    title: string,  
    description: string,  
    votes: number,  
    comments: string[],  
    boardData: any,  
  }) => {
    const [showDialog, setShowDialog] = useState(false);
    const [votes, setVotes] = useState(initialVotes)
    const [comments, setComments] = useState(initialComments); 

    const [newComment, setNewComment] = useState(""); 

    const handleShowDialog = () => {
        setShowDialog(!showDialog)
    }

    const voteHandler = (increment: number) =>{
        setVotes(votes + increment)
    }

    const handleChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setNewComment(e.target.value);
    };

    const handleSubmitComment = () => {
        console.log()
        if (newComment.trim() !== "") {
            setComments([...comments, newComment]); 
            setNewComment(""); 
        }
        console.log(comments)
    };
    return (
        <>
            <div 
            className="relative rounded p-3 mb-2 cursor-pointer"
            onClick={handleShowDialog}
            style={{backgroundColor: boardData?.secondaryColor}}
            >
                <p className="text-m font-bold" style={{color: boardData?.textColor}}>{title}</p>
                <div className="flex items-center gap-2 absolute top-3 right-2">
                    <p className="text-slate-900" style={{color: boardData?.textColor}}>{votes}</p>
                    <div className="flex flex-col gap-2">
                        <button 
                        className="flex items-center gap-2 px-3 py-2 rounded-md"
                        onClick={(event) => {
                            event.stopPropagation(); 
                            voteHandler(1);
                        }}
                        >
                            <svg width="10px" height="15px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19.9201 15.0499L13.4001 8.52989C12.6301 7.75989 11.3701 7.75989 10.6001 8.52989L4.08008 15.0499" stroke={boardData?.textColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <p className="text-sm" style={{color: boardData?.textColor}}>{description}</p>
            </div>
            {showDialog && <Dialog 
                handleShowDialog={handleShowDialog} 
                title={title} 
                description={description} 
                votes={votes}
                voteHandler={voteHandler}
                comments={comments} 
                newComment={newComment} 
                handleChange={handleChange} 
                handleSubmitComment={handleSubmitComment} 
                boardData={boardData}
            />}
        </>

    )

}

const CardComment = ({ comment, boardData }: { comment: string; boardData: any }) => {
    return (
        <div className="relative rounded p-3 mb-2"
        style={{backgroundColor: boardData?.secondaryColor}}>
            <p className="text-sm whitespace-pre-wrap"
            style={{color: boardData?.textColor}}>{comment}</p>
        </div>
    )
}


const Dialog = ({
    handleShowDialog,
    title,
    description,
    votes,
    voteHandler,
    comments,
    newComment,
    handleChange,
    handleSubmitComment,
    boardData
  }: {
    handleShowDialog: () => void;
    title: string;
    description: string;
    votes: number;
    voteHandler: (vote: number) => void; 
    comments: string[]; 
    newComment: string; 
    handleChange: (event: ChangeEvent<HTMLTextAreaElement>) => void; 
    handleSubmitComment: () => void; 
    boardData: {
        primaryColor: string;
        textColor: string;
        secondaryColor: string;
        accentColor: string;
    } 
  }) => {
    const handleDialogClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
    };

    const lighterPrimaryColor = boardData?.primaryColor ? tinycolor(boardData.primaryColor).lighten(10).toString() : "#f9fafb"
    const darkenPrimaryColor = boardData?.primaryColor ? tinycolor(boardData.primaryColor).darken(20).toString() : "#f9fafb"
    const hoverColorStyle = {
        '--hover-bg-color': darkenPrimaryColor,
    } as React.CSSProperties;


    return(
        <div className="fixed inset-0 backdrop-filter backdrop-brightness-75 backdrop-blur-md flex justify-center items-center z-50" onClick={handleShowDialog}>
            <div className="rounded-lg shadow-lg max-w-xl w-full h-auto px-8 py-6" 
            onClick={handleDialogClick}
            style={{backgroundColor: boardData?.primaryColor}}
            >
                <div className="flex items-center gap-2 absolute">
                    <p className="text-slate-900">{votes}</p>
                    <div className="flex flex-col gap-2">
                        <button 
                        className="flex items-center gap-2 px-3 py-2 rounded-md"
                        onClick={() => voteHandler(1)}
                        style={hoverColorStyle}
                        >
                            <svg width="10px" height="15px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19.9201 15.0499L13.4001 8.52989C12.6301 7.75989 11.3701 7.75989 10.6001 8.52989L4.08008 15.0499" stroke="#292D32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="p-5">
                    <div>
                        <p 
                        className="mb-3 text-2xl font-semibold leading-5 text-center"
                        style={{color: boardData?.textColor}}
                        >
                            {title}
                        </p>
                        <p 
                        className="mt-2 text-sm leading-6 p-4"
                        style={{color: boardData?.textColor}}
                        >
                            {description}
                        </p>
                    </div>

                    <div className="flex w-full items-center gap-2 py-6 text-sm text-slate-600">
                        <div className="h-px w-full bg-slate-200"></div>
                        COMMENTS
                        <div className="h-px w-full bg-slate-200"></div>
                    </div>
                    <div
                        className="max-h-96 overflow-y-auto"
                        style={{ maxHeight: "20rem" }}
                    >
                        {comments.map((comment, index) => (
                        <CardComment key={index} comment={comment} boardData={boardData} />
                        ))}
                    </div>
                    
                    <br/>
                    <textarea
                        id="comment"
                        className="w-full p-2 rounded-lg focus:outline-none text-slate-800 border"
                        rows={3}
                        placeholder="Enter your comment here..."
                        value={newComment}
                        onChange={handleChange}
                        style={{backgroundColor: lighterPrimaryColor, color: boardData?.textColor}}
                    ></textarea>

                    <div className="mt-5">
                        <button
                            type="submit"
                            className="inline-flex w-full items-center justify-center rounded-lg p-2 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 disabled:bg-gray-400"
                            onClick={handleSubmitComment}
                            style={{backgroundColor: boardData?.accentColor, color: boardData?.textColor}}
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}