"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Component } from "@prisma/client"
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage"
import { storage } from "firebaseConfig"

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
import useComponents from "@/app/hooks/forms/component/getComponentHooks"
import useComponent from "@/app/hooks/forms/component/getComponentHooks"

interface ComponentData {
  component: Component
}

interface FormData {
  componentId: string
  name: string
  image: string
  price: number
  imgName: string | null
}

export function ModalComponent({ component }: ComponentData) {
  const { toast } = useToast()
  const { data: getComponent = [] } = useComponent()

  const [form, setForm] = useState<FormData>({
    componentId: component?.componentId,
    name: component?.name,
    image: getComponent.image,
    price: component?.price,
    imgName: component?.imgName,
  })

  const [data1, setData1] = useState([])

  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [imageFile, setImageFile] = useState<File>()
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

  async function update(data: FormData, image: string, imgName: string) {
    try {
      console.log("dataform", data)
      data.imgName = imgName
      data.image = image
      fetch(`http://localhost:3000/api/component/${component?.id}`, {
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
      }).then(() => {
        setForm({
          componentId: form?.componentId,
          name: form?.name,
          image: form?.image,
          price: Number(form?.price),
          imgName: form?.imgName,
        })
      })
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmit = async (data: FormData) => {
    // if (imageFile) {
    // }
    // data.image = image;
    // data.imgName = imgName;
    const name = data.name.replace(" ", "")
    const storageRef = ref(storage, `image/component/${component.imgName}`)
    try {
      if (imageFile) {
        const uploadTask = uploadBytesResumable(storageRef, imageFile)

        deleteObject(storageRef)
          .then(() => {
            console.log("Delete Success")
          })
          .catch((error) => {
            console.log("delete fail " + error)
          })

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
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((url) => {
              //url is download url of file
              setDownloadURL(url)
              console.log(component.image)
              console.log("url", url)
              update(data, downloadURL, name)
            })
          }
        )
      } else {
        // message.error('File not found')npm
        console.log("file not found")
        const image = form?.image
        const imgName = form?.imgName!
        update(data, image, imgName)
      }
      // create(data)
    } catch (error) {
      //console.log(error)
    }
  }

  
  // console.log('imageFile', component.image)
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Component</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Component</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you`re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="componentId" className="text-right">
              Id
            </Label>
            <Input
              id="componentId"
              placeholder={component?.componentId}
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
              placeholder={component?.name}
              value={form?.name}
              className="col-span-3"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Price
            </Label>
            <Textarea
              id="price"
              placeholder={String(component?.price)}
              value={form?.price}
              className="col-span-3"
              onChange={(e) =>
                setForm({ ...form, price: Number(e.target.value) })
              }
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
              value={""}
              accept="image/png"
              width={500}
              onChange={(files) => handleSelectedFile(files.target.files)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="image" className="text-right">
              image
            </Label>
            <Textarea
              id="image"
              placeholder={String(component?.image)}
              //   value={form?.image}
              className="col-span-3"
              onChange={(e) => setForm({ ...form, image: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={(e) => {
              e.preventDefault()
              update(form, form?.image, form?.imgName!)
              handleSubmit(form)
              setIsOpen(false)
              toast({
                title: "Scheduled: Catch up ",
                description: "Friday, February 10, 2023 at 5:57 PM",
                action: (
                  <ToastAction altText="Goto schedule to undo">
                    Undo
                  </ToastAction>
                ),
              })
            }}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
