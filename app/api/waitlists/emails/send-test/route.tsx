import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { EmailTemplate } from "@/types/EmailTemplate"
import mailgun from "mailgun.js"
import formData from "form-data"
import { render } from "@react-email/render"
import EmailTemplateFiller from "./EmailTemplateFiller"

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(2, "10 s"),
})

const mg = new mailgun(formData)
const mgClient = mg.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY!,
})

export async function POST(request: Request) {
  const supabase = createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ message: "User not authenticated" }, { status: 401 })
  }
  const { success, reset } = await ratelimit.limit(user.id)

  if (!success) {
    return NextResponse.json({ message: "Rate limit exceeded" }, { status: 429 })
  }

  const body = await request.json()
  const { template }: { template: EmailTemplate } = body
  const { projectName, primaryColor, secondaryColor, textColor, accentColor } = body
  if (template.blocks.length === 0) {
    return NextResponse.json({ message: "Email cannot be empty" }, { status: 400 })
  }

  if (!projectName || !primaryColor || !secondaryColor || !textColor || !accentColor) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
  }

  console.log(primaryColor, secondaryColor, textColor, accentColor)

  try {
    const html = render(
      <EmailTemplateFiller
        blocks={template.blocks}
        previewText={template.previewText}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        textColor={textColor}
        accentColor={accentColor}
      />,
      {
        pretty: true,
      },
    )

    mgClient.messages
      .create(process.env.MAILGUN_DOMAIN as string, {
        from: `${projectName}@${process.env.MAILGUN_DOMAIN as string}`,
        to: [user.email || ""],
        subject: template.subject,
        text: template.previewText,
        html,
      })
      .then((msg) => console.log(msg))
      .catch((err) => console.log(err))

    return NextResponse.json(
      {
        message: "Test email sent successfully",
      },
      { status: 200 },
    )
  } catch (error) {
    let errorMessage = "An unknown error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    console.error("Error sending test email:", errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
