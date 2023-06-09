"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Component } from "@prisma/client"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import { storage } from "firebaseConfig"
import { List } from "lucide-react"

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
import usecomponents from "@/app/hooks/getComponentHooks"

interface componentData {
  component: Component
}

interface FormData {
  componentId: string
  name: string
  image: string
  price: number
  imgName: string | null
}

export function ModalCreateComponent(data: FormData) {
  const { toast } = useToast()

  const [form, setForm] = useState<FormData>({
    componentId: "",
    name: "",
    image: "",
    price: 0,
    imgName: ""
  })
  const [imageFile, setImageFile] = useState<File>()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [downloadURL, setDownloadURL] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [progressUpload, setProgressUpload] = useState(0)

  const router = useRouter()

  const handleSelectedFile = (files: any) => {
    if (files && files[0].size < 1000000) {
      setImageFile(files[0])

      console.log(files[0])
    } else {
      console.log("error")
    }
  }

  // const handleUploadFile = () => {
  //   if (imageFile) {
  //     const name = imageFile.name
  //     const storageRef = ref(storage, `image/${name}`)
  //     const uploadTask = uploadBytesResumable(storageRef, imageFile)

  //     uploadTask.on(
  //       'state_changed',
  //       (snapshot) => {
  //         const progress =
  //           (snapshot.bytesTransferred / snapshot.totalBytes) * 100

  //         setProgressUpload(progress) // to show progress upload

  //         switch (snapshot.state) {
  //           case 'paused':
  //             console.log('Upload is paused')
  //             break
  //           case 'running':
  //             console.log('Upload is running')
  //             break
  //         }
  //       },
  //       (error:any) => {
  //         // message.error(error.message)
  //         console.log(error)
  //       },
  //       () => {
  //         getDownloadURL(uploadTask.snapshot.ref).then((url) => {
  //           //url is download url of file
  //           setDownloadURL(url)
  //           data.image = url;
  //           // create(data)
  //         })
  //       },
  //     )
  //   } else {
  //     // message.error('File not found')npm
  //     console.log('file not found')
  //   }
  // }

  const handleRemoveFile = () => setImageFile(undefined)

  async function create(data: FormData, image: string, imgName: string) {
    try {
      console.log("check nama", data.imgName)
      data.imgName = imgName
      data.image = image
      console.log("dataform", data)
      fetch(`http://localhost:3000/api/component`, {
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      }).then(() => {
        setForm({ componentId: "" ,name: "", image: "", price:Number(0), imgName: "" })
      })
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmit = async (data: FormData) => {
    try {
      if (imageFile) {
        const name = data.name.replace(" ", "")
        const storageRef = ref(storage, `image/component/${name}`)
        const uploadTask = uploadBytesResumable(storageRef, imageFile)

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100

            setProgressUpload(progress) // to show progress upload

            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused")
                break
              case "running":
                console.log("Upload is running")
                break
            }
          },
          (error: any) => {
            // message.error(error.message)
            console.log(error)
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((url) => {
              //url is download url of file
              // setDownloadURL(url)
              console.log("url", url)
              create(data, url, name)
            })
          }
        )
      } else {
        // message.error('File not found')npm
        console.log("file not found")
      }

      // create(data)
    } catch (error) {
      //console.log(error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create component</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New component</DialogTitle>
          <DialogDescription>Membuat component Baru disini</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="componentId" className="text-right">
              ID
            </Label>
            <Input
              id="componentId"
              placeholder="component Description"
              value={form?.componentId}
              className="col-span-3"
              onChange={(e) =>
                setForm({ ...form, componentId: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              placeholder="component Name"
              value={form?.name}
              className="col-span-3"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Price
            </Label>
            <Input
              id="price"
              placeholder="component Name"
              value={form?.price}
              className="col-span-3"
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            />
          </div>
          <div className="grid w-full grid-cols-4 items-center gap-4">
            <Label htmlFor="picture" className="text-right">
              Image
            </Label>
            <Input
              id="picture"
              type="file"
              placeholder="Select file"
              value={form?.image}
              accept="image/png"
              width={500}
              onChange={(files) => handleSelectedFile(files.target.files)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={(e) => {
              e.preventDefault()
              handleSubmit(form)
              // handleUploadFile()
              setIsOpen(false)
            }}
          >
            Create component
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
