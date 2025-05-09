import { ComponentProps, useState } from "react"
import formatDistanceToNow from "date-fns/formatDistanceToNow"
import { Check } from "lucide-react" // import icon check

import { cn } from "@/lib/utils"
import { Badge } from "@/registry/new-york/ui/badge"
import { ScrollArea } from "@/registry/new-york/ui/scroll-area"
import { Separator } from "@/registry/new-york/ui/separator"
import { Mail } from "@/app/(app)/examples/mail/data"
import { useMail } from "@/app/(app)/examples/mail/use-mail"

interface MailListProps {
  items: Mail[]
}

export function MailList({ items }: MailListProps) {
  const [mail, setMail] = useMail()
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Hàm xử lý khi click vào item: copy text và chọn mail
  const handleClick = async (item: Mail) => {
    try {
      await navigator.clipboard.writeText(item.text)
      // Đánh dấu đã copy
      setCopiedId(item.id)
      // Ẩn icon sau 2 giây
      setTimeout(() => setCopiedId(null), 2000)
      console.log("Copied to clipboard:", item.text)
    } catch (err) {
      console.error("Copy failed:", err)
    }
    setMail({
      ...mail,
      selected: item.id,
    })
  }

  return (
    <ScrollArea className="h-screen">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {/* Các mail item */}
        {items.map((item) => (
          <button
            key={item.id}
            className={cn(
              "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
              mail.selected === item.id && "bg-muted"
            )}
            onClick={() => handleClick(item)}
          >
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className="font-semibold text-xs">{item.name}</div>
                  {!item.read && (
                    <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                  )}
                </div>
                <div
                  className={cn(
                    "ml-auto flex items-center text-xs", // thêm flex để chứa icon
                    mail.selected === item.id
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {/* {formatDistanceToNow(new Date(item.date), {
                    addSuffix: true,
                  })} */}
                  {/* DistanceToNow */}
                  {copiedId === item.id && (
                    <Check className="ml-1 h-4 w-4 text-green-500" />
                  )}
                </div>
              </div>
              {/* <div className="text-xs font-medium">{item.subject}</div> */}
            </div>
            <div className="line-clamp-2 text-xs text-muted-foreground">
              {item.text.substring(0, 6000)}
            </div>
            {item.labels.length ? (
              <div className="flex items-center gap-2">
                {item.labels.map((label) => (
                  <Badge key={label} variant={getBadgeVariantFromLabel(label)}>
                    {label}
                  </Badge>
                ))}
              </div>
            ) : null}
          </button>
        ))}
      </div>
    </ScrollArea>
  )
}

function getBadgeVariantFromLabel(
  label: string
): ComponentProps<typeof Badge>["variant"] {
  if (["work"].includes(label.toLowerCase())) {
    return "default"
  }

  if (["personal"].includes(label.toLowerCase())) {
    return "outline"
  }

  return "secondary"
}
