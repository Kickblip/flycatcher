import Image from "next/image"

export default function TextBlock({
  authorImg,
  authorName,
  content,
  isOwnerMessage,
}: {
  authorImg: string
  authorName: string
  content: string
  isOwnerMessage: boolean
}) {
  return (
    <div className="flex w-full">
      <div className="flex-shrink-0">
        <Image src={authorImg} alt={authorName} width={100} height={100} className="w-8 h-8 rounded-full" />
      </div>
      <div className="ml-2 flex flex-col justify-start w-full break-words pr-16">
        <div className="flex items-center">
          <p className="font-semibold text-sm">{authorName}</p>
          {isOwnerMessage ? <p className="text-xs ml-2 text-indigo-500">Board Owner</p> : null}
        </div>
        <p className="text-sm">{content}</p>
      </div>
    </div>
  )
}
