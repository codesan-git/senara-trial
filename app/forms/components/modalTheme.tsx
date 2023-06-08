"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Theme } from "@prisma/client"
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage"
import { storage } from "firebaseConfig"
import { ColorPicker, useColor } from "react-color-palette"

import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Toast, ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { ToastDemo } from "@/components/toast"
import useThemes from "@/app/hooks/getThemeHooks"
import useTheme from "@/app/hooks/getThemeHooks"

interface themeData {
  theme: Theme
}

interface FormData {
  themeId: string
  name: string
  color: string
}

export function ModalTheme({ theme }: themeData) {
  const { toast } = useToast()
  const { data: getTheme = [] } = useTheme()

  const [form, setForm] = useState<FormData>({
    themeId: theme?.themeId,
    name: theme?.name,
    color: theme?.color,
  })

  const [color, setColor] = useColor("hex", `${theme.color}`)
  const [isOpen, setIsOpen] = useState(false)
  const [disabled, setDisabled] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  async function update(data: FormData) {
    try {
      console.log("dataform", data)
      fetch(`http://localhost:3000/api/theme/${theme?.id}`, {
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
      }).then(() => {
        setForm({
          themeId: form?.themeId,
          name: form?.name,
          color: form?.color,
        })
      })
    } catch (error) {
      console.log(error)
    }
  }

  const submitColor = () => {
    console.log(color.hex)
    setForm({ ...form, color: color?.hex! })
    setDisabled(false)
  }

  const repeatSubmitColor = () => {
    console.log("repeat submit jalan")
    setDisabled(true)
  }

  const handleSubmit = async (data: FormData) => {
    update(data)
    setDisabled(true)
  }
  console.log("getTheme", color.hex)
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit theme</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit theme</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you`re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="themeId" className="text-right">
              Id
            </Label>
            <Input
              id="themeId"
              placeholder={theme?.themeId}
              value={form?.themeId}
              className="col-span-3"
              onChange={(e) => setForm({ ...form, themeId: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              placeholder={theme?.name}
              value={form?.name}
              className="col-span-3"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="color" className="text-right">
              Color
            </Label>
            <ColorPicker
              width={276}
              height={138}
              color={color}
              onChange={setColor}
              onChangeComplete={(e) => {
                repeatSubmitColor()
                setForm({ ...form, color: color?.hex! })
              }}
              hideHSV
              hideRGB
              dark
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={submitColor} className="block">
            Submit Color
          </Button>
          <Button
            type="submit"
            disabled={disabled}
            onClick={(e) => {
              e.preventDefault()
              handleSubmit(form)
              setIsOpen(false)
            }}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
