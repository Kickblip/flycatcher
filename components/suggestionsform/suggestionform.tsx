"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useEffect, useState } from "react"
import { Button } from "@/components/suggestionsform/button"
import { Textarea } from "@/components/suggestionsform/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/suggestionsform/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/suggestionsform/form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/suggestionsform/card"
import { Input } from "@/components/suggestionsform/input"
import { ChevronDown, ChevronUp, SendIcon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"


const formSchema = z.object({
  title: z
    .string()
    .min(2, {
      message: "Title must be more than 2 characters.",
    })
    .max(50, {
      message: "Title can't be more than 50 characters.",
    }), //change depending
  description: z.string().min(2).max(100),
})

const formSchemaComment = z.object({
  comment: z
    .string()
    .min(2, {
      message: "Comment must be more than 2 characters.",
    })
    .max(300, {
      message: "Comment can't be more than 300 characters.",
    }), //change depending
})

interface Board {
  _id: string
  name: string
  urlName: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  textColor: string
  suggestions: {
    title: string
    description: string
    votes: number
    comments: string[]
  }[]
}

interface BoardProps {
  board: Board | null
}

export default function Suggestion({ board }: BoardProps) {
  const [suggestions, setSuggestions] = useState<Board["suggestions"]>([]) // cahnge names

  useEffect(() => {
    if (board) {
      //sets the suggestions
      setSuggestions(board.suggestions)

      //sets the buttons
      document.documentElement.style.setProperty("--primary", board.accentColor)
      document.documentElement.style.setProperty("--primary-foreground", board.primaryColor)

      //sets the background and text
      document.documentElement.style.setProperty('--background', '204.07 69.87% 53.14%');
      document.documentElement.style.setProperty('--card', '145.44 63.2% 49.02%');
      document.documentElement.style.setProperty('--card-foreground', board.textColor);

      //sets the popover 
      document.documentElement.style.setProperty('--popover', board.secondaryColor);
      document.documentElement.style.setProperty('--popover-foreground', board.textColor);
     }
  }, [board])

  const suggestionForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const commentForm = useForm<z.infer<typeof formSchemaComment>>({
    resolver: zodResolver(formSchemaComment),
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newSuggestion = { ...values, votes: 0, comments: [] }
    setSuggestions((prevSuggestions) => [...prevSuggestions, newSuggestion])
    suggestionForm.reset()
  }

  //thank you chatGPT for solving this. this has to be the most crazy solution
  function onClickVoteUp(index: number, increment: number = 1) {
    setSuggestions((prevSuggestions) =>
      prevSuggestions.map((suggestion, idx) =>
        idx === index ? { ...suggestion, votes: suggestion.votes + increment } : suggestion,
      ),
    )
  }

  function onSubmitComment(index: number, comment: string) {
    setSuggestions((prevSuggestions) =>
      prevSuggestions.map((suggestion, idx) =>
        idx === index ? { ...suggestion, comments: [...suggestion.comments, comment] } : suggestion,
      ),
    )
    commentForm.reset()
  }

  if (!board) {
    return(
      <div className="flex flex-col space-y-3 h-screen justify-center items-center">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
    ) 
  }

  return (
    // CREATE A SUGGESTION CARD
    <div className="flex space-x-4">
      <div>
        <Card className="w-[380px] h-[424px] bg-card">
          <CardHeader>
            <CardTitle>Create a suggestion</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...suggestionForm}>
            <form onSubmit={suggestionForm.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={suggestionForm.control}
                name="title"
                defaultValue=""
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Suggestion Title</FormLabel>
                    <FormControl>
                      <Input 
                      placeholder="Add a Darkmode" {...field} 
                      style={{ backgroundColor: board.primaryColor}}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={suggestionForm.control}
                name="description"
                defaultValue=""
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Suggestion</FormLabel>
                    <FormControl>
                    <Textarea
                        placeholder="Please add a dark mode as my eyes burn looking at your website!"
                        {...field}
                        rows={5} 
                        style={{ backgroundColor: board.primaryColor}}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-center">
                <Button type="submit">Submit</Button>
              </div>
            </form>
            </Form>
          </CardContent>
        </Card>
        <p className='m-1' style={{ textAlign: 'center' }}>Powered By <a href="/" style={{ textDecoration: 'underline' }}>Flycatcher</a></p>
      </div>

      {/* SUGGESTION CARD */}
      <Card className="w-[700px] h-[700px] overflow-y-auto" style={{ backgroundColor: board.primaryColor}}>
        <CardHeader>
          <CardTitle>Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          {suggestions.length > 0 ? (
            suggestions.map((suggestion, index) => (
              <Dialog>
              <Card 
              key={index} 
              className="mt-4 relative"
              style={{ backgroundColor: board.secondaryColor }}
              >
                  <DialogTrigger>
                    <CardHeader>
                      <CardTitle>{suggestion.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{suggestion.description}</p>
                    </CardContent>
                  </DialogTrigger>
                  <div className="absolute top-0 right-0 flex items-center">
                    <p className="mr-2">{suggestion.votes}</p>
                    <div className="flex flex-col">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7"
                      onClick={() => onClickVoteUp(index, 1)}
                      >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7" 
                      onClick={() => onClickVoteUp(index, -1)}
                      >
                        <ChevronDown className="h-4 w-4" />
                    </Button>
                    </div>
                  </div>
                <DialogContent className="sm:max-w-[1000px]" style={{ backgroundColor: board.primaryColor}}>
                  <DialogHeader>
                    <DialogTitle>{suggestion.title}</DialogTitle>
                    <DialogDescription>
                      {suggestion.description}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="absolute top-1 right-10 flex items-center">
                    <p className="mr-2">{suggestion.votes}</p>
                    <div className="flex flex-col">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7"
                      onClick={() => onClickVoteUp(index, 1)}
                      >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7" 
                      onClick={() => onClickVoteUp(index, -1)}
                      >
                        <ChevronDown className="h-4 w-4" />
                    </Button>
                    </div>
                  </div>
                  <br/>
                  <p>Comments</p>
                  {suggestion.comments && suggestion.comments.length > 0 ? (
                    suggestion.comments.map((comment, commentIndex) => (
                      <Card key={commentIndex} className="mt-2">
                        <CardContent className="comment">
                          <p>{comment}</p>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p>No comments yet.</p>
                  )}
                  <Form {...commentForm}>
                        <form onSubmit={commentForm.handleSubmit((values) => onSubmitComment(index, values.comment))} className="space-y-8">
                          <FormField
                            control={commentForm.control}
                            name="comment"
                            defaultValue=""
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Your comment</FormLabel>
                                <FormControl>
                                  <Input 
                                  placeholder="Type your comment here" {...field} 
                                  style={{ backgroundColor: board.secondaryColor}}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button type="submit">Submit</Button>
                        </form>
                      </Form>
                </DialogContent>
                </Card>
              </Dialog>
            ))
          ) : (
            <p>No suggestions yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
