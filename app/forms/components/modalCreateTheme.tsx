"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Theme } from "@prisma/client"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import { storage } from "firebaseConfig"
import { List } from "lucide-react"
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

import "react-color-palette/lib/css/styles.css"

interface themeData {
  theme: Theme
}

interface FormData {
  themeId: string
  name: string
  color: string
}

export function ModalCreateTheme(data: FormData) {
  const { toast } = useToast()

  const [color, setColor] = useColor("hex", "#121212")
  const [chooseColor, setChooseColor] = useState("")
  const [form, setForm] = useState<FormData>({
    themeId: "",
    name: "",
    color: "",
  })
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  async function create(data: FormData) {
    try {
      console.log("check nama")
      console.log("dataform", data)
      fetch(`http://localhost:3000/api/theme`, {
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      }).then(() => {
        setForm({ themeId: "", name: "", color: `${color.hex}` })
      })
    } catch (error) {
      console.log(error)
    }
  }

  const onChangeColor = () => {
    // setColor(color)
    setForm({...form, color:color.hex})
  }

  const handleSubmit = async (data: FormData) => {
    // setForm({...form, color:color.hex})
    create(data)
  }

  console.log('check color', color?.hex)
  console.log('cek form', form)
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create theme</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New theme</DialogTitle>
          <DialogDescription>Membuat theme Baru disini</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="themeId" className="text-right">
              ID
            </Label>
            <Input
              id="themeId"
              placeholder="theme id"
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
              placeholder="theme Name"
              value={form?.name}
              className="col-span-3"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="color" className="text-right">
              Color
            </Label>
            <ColorPicker width={276} height={138} color={color}
                  //  onChange={(e)=>
                  //  setForm({...form, color: color.hex})} hideHSV dark />
                  onChange={ setColor }
                  onChangeComplete={()=>setForm({...form, color:color?.hex!})} 
                  hideHSV hideRGB dark
                  />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={(e) => {
              e.preventDefault()
              // setForm({...form, color:color.hex})
              handleSubmit(form)
              // handleUploadFile()
              setIsOpen(false)
            }}
          >
            Create theme
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
