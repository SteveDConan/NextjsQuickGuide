// components/mail.tsx
"use client"

import * as React from "react"
import { useState, useMemo } from "react"
import {
  AlertCircle,
  Archive,
  ArchiveX,
  Info,
  Files,
  MessagesSquare,
  Search,
  Send,
  ShoppingCart,
  Trash2,
  Users2,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@/registry/new-york/ui/input"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/registry/new-york/ui/resizable"
import { Separator } from "@/registry/new-york/ui/separator"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/new-york/ui/tabs"
import { TooltipProvider } from "@/registry/new-york/ui/tooltip"
import { AccountSwitcher } from "@/app/(app)/examples/mail/components/account-switcher"
import { MailDisplay } from "@/app/(app)/examples/mail/components/mail-display"
import { type Mail } from "@/app/(app)/examples/mail/data"
import { useMail } from "@/app/(app)/examples/mail/use-mail"
import { MailList } from "./mail-list"
import { Nav } from "./nav"

interface MailProps {
  accounts: {
    label: string
    email: string
    icon: React.ReactNode
  }[]
  mails: Mail[]
  defaultLayout: number[] | undefined
  defaultCollapsed?: boolean
  navCollapsedSize: number
}

export function Mail({
  accounts,
  mails,
  defaultLayout = [20, 32, 48],
  defaultCollapsed = false,
  navCollapsedSize,
}: MailProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed)
  const [mail] = useMail()
  const [searchTerm, setSearchTerm] = useState("")

  // Thêm state để biết Nav nào đang được chọn
  const [selectedNav, setSelectedNav] = useState<string>("All Questions")

  // Hàm bỏ dấu Tiếng Việt để hỗ trợ tìm kiếm không dấu
  const stripVietnamese = (str: string) =>
    str.normalize("NFD").replace(/[̀-ͯ]/g, "")

  // Lọc mail theo tìm kiếm (name, text, labels) không phân biệt dấu
  const filteredBySearch = useMemo(() => {
    const term = stripVietnamese(searchTerm).toLowerCase()
    if (!term) return mails
    return mails.filter((item) => {
      const name = stripVietnamese(item.name).toLowerCase()
      const text = stripVietnamese(item.text).toLowerCase()
      const labels = item.labels.map((l) =>
        stripVietnamese(l).toLowerCase()
      )
      return (
        name.includes(term) ||
        text.includes(term) ||
        labels.some((l) => l.includes(term))
      )
    })
  }, [mails, searchTerm])

  // Lọc tiếp theo Nav đã chọn (title nav = label mail)
  const filteredMails = useMemo(() => {
    if (selectedNav === "All Questions") {
      return filteredBySearch
    }
    return filteredBySearch.filter((item) =>
      item.labels.some(
        (l) =>
          stripVietnamese(l).toLowerCase() ===
          stripVietnamese(selectedNav).toLowerCase()
      )
    )
  }, [filteredBySearch, selectedNav])

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout:mail=${JSON.stringify(
            sizes
          )}`
        }}
        className="h-full max-h-[800px] items-stretch"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={15}
          maxSize={20}
          onCollapse={() => {
            setIsCollapsed(true)
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              true
            )}`
          }}
          onResize={() => {
            setIsCollapsed(false)
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              false
            )}`
          }}
          className={cn(
            isCollapsed &&
              "min-w-[50px] transition-all duration-300 ease-in-out"
          )}
        >
          <div
            className={cn(
              "flex h-[52px] items-center justify-center",
              isCollapsed ? "h-[52px]" : "px-2"
            )}
          >
            {/* <AccountSwitcher isCollapsed={isCollapsed} accounts={accounts} /> */}
          </div>
          <Separator />
          {/* Phần Nav */}
          <Nav
            isCollapsed={isCollapsed}
            links={[
              {
                title: "All Questions",
                label: "128",
                icon: Files,
                variant: "default",
              },
              {
                title: "Chào hỏi",
                label: "9",
                icon: Info,
                variant: "ghost",
              },
              {
                title: "Giới thiệu",
                label: "",
                icon: Send,
                variant: "ghost",
              },
              {
                title: "Lợi ích",
                label: "25",
                icon: ArchiveX,
                variant: "ghost",
              },
              {
                title: "Plan",
                label: "285",
                icon: ArchiveX,
                variant: "ghost",
              },
              {
                title: "Hoa hồng",
                label: "285",
                icon: ArchiveX,
                variant: "ghost",
              },
              {
                title: "Đăng ký",
                label: "23",
                icon: ArchiveX,
                variant: "ghost",
              },
              {
                title: "Nạp tiền",
                label: "",
                icon: Trash2,
                variant: "ghost",
              },
              {
                title: "Quantify",
                label: "972",
                icon: Users2,
                variant: "ghost",
              },
              {
                title: "Rút tiền",
                label: "",
                icon: Archive,
                variant: "ghost",
              },
            ]}
            selected={selectedNav}                         // ← pass state selected
            onSelect={(title) => setSelectedNav(title)}     // ← cập nhật khi click
          />
          {/* <Separator /> */}
          <Nav
            isCollapsed={isCollapsed}
            links={[
              {
                title: "Quantify",
                label: "972",
                icon: Users2,
                variant: "ghost",
              }
              ,
              {
                title: "Nhiệm vụ",
                label: "345",
                icon: AlertCircle,
                variant: "ghost",
              },
              {
                title: "Kiểm toán",
                label: "342",
                icon: AlertCircle,
                variant: "ghost",
              },
              {
                title: "Nâng cấp",
                label: "128",
                icon: MessagesSquare,
                variant: "ghost",
              },
              {
                title: "Shopping",
                label: "8",
                icon: ShoppingCart,
                variant: "ghost",
              },
              {
                title: "Promotions",
                label: "21",
                icon: Archive,
                variant: "ghost",
              },
            ]}
            selected={selectedNav}                         // ← pass state selected
            onSelect={(title) => setSelectedNav(title)}     // ← cập nhật khi click
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <Tabs defaultValue="all">
            <div className="flex items-center px-4 py-2">
              <h1 className="text-xl font-bold">Q&A vn-en</h1>
              <TabsList className="ml-auto">
                <TabsTrigger
                  value="all"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  All mail
                </TabsTrigger>
                <TabsTrigger
                  value="unread"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  Unread
                </TabsTrigger>
              </TabsList>
            </div>
            <Separator />
            <div className="bg-background/95 py-2 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <form>
                <div className="relative">
                  {/* Tìm kiếm Mail */}
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search"
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </form>
            </div>
            <TabsContent value="all" className="m-0">
              <MailList items={filteredMails} />
            </TabsContent>
            <TabsContent value="unread" className="m-0">
              <MailList items={filteredMails.filter((item) => !item.read)} />
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        {/* <ResizableHandle withHandle /> */}
        {/* <ResizablePanel defaultSize={defaultLayout[2]} minSize={30}>
          <MailDisplay
            mail={mails.find((item) => item.id === mail.selected) || null}
          />
        </ResizablePanel> */}
      </ResizablePanelGroup>
    </TooltipProvider>
  )
}
