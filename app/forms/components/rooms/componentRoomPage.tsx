"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Rooms } from "@prisma/client"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import { storage } from "firebaseConfig"
import { List } from "lucide-react"

import { prisma } from "@/lib/prisma"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import useRoomss from "@/app/hooks/getRoomsHooks"

interface RoomsData {
  rooms: Rooms
}

interface FormData {
  name: string
  description: string
  image: string
  imgName: string
}

interface RoomsProps extends React.HTMLAttributes<HTMLDivElement> {
  aspectRatio?: "portrait" | "square"
}

export function ComponentRoomPage(data: FormData) {
  const { toast } = useToast()

  const [form, setForm] = useState<FormData>({
    name: "",
    description: "",
    image: "",
    imgName: "",
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

  const handleRemoveFile = () => setImageFile(undefined)

  async function create(data: FormData, image: string, imgName: string) {
    try {
      console.log("check nama", data.imgName)
      data.imgName = imgName
      data.image = image
      console.log("dataform", data)
      fetch(`http://localhost:3000/api/rooms`, {
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      }).then(() => {
        setForm({ name: "", description: "", image: "", imgName: "" })
      })
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmit = async (data: FormData) => {
    try {
      if (imageFile) {
        const name = data.name.replace(" ", "")
        const storageRef = ref(storage, `image/${name}`)
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
    <div>
      <Card className="w-full border-none ">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add/Edit Room Collection</CardTitle>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Room Collection Name</Label>
                  <Input id="name" placeholder="Name of your Room" />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="description">
                    Room Collection Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Fill with Description"
                  />
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Room Option</CardTitle>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="component">Include Component</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                        <SelectContent position="popper">
                          <SelectItem value="next">Next.js</SelectItem>
                          <SelectItem value="sveltekit">SvelteKit</SelectItem>
                          <SelectItem value="astro">Astro</SelectItem>
                          <SelectItem value="nuxt">Nuxt.js</SelectItem>
                        </SelectContent>
                      </SelectTrigger>
                    </Select>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="theme">Room Collection Description</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                        <SelectContent position="popper">
                          <SelectItem value="next">Next.js</SelectItem>
                          <SelectItem value="sveltekit">SvelteKit</SelectItem>
                          <SelectItem value="astro">Astro</SelectItem>
                          <SelectItem value="nuxt">Nuxt.js</SelectItem>
                        </SelectContent>
                      </SelectTrigger>
                    </Select>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-end gap-4">
            <Button variant="ghost">Cancel</Button>
            <Button>Deploy</Button>
          </CardFooter>
        </Card>
      </Card>
    </div>

    // <Dialog open={isOpen} onOpenChange={setIsOpen}>
    //   <DialogTrigger asChild>
    //   </DialogTrigger>
    //   <DialogContent className="sm:max-w-[425px]">
    //     <DialogHeader>
    //       <DialogTitle>New Rooms</DialogTitle>
    //       <DialogDescription>Membuat Rooms Baru disini</DialogDescription>
    //     </DialogHeader>
    //     <div className="grid gap-4 py-4">
    //       <div className="grid grid-cols-4 items-center gap-4">
    //         <Label htmlFor="name" className="text-right">
    //           Name
    //         </Label>
    //         <Input
    //           id="name"
    //           placeholder="Rooms Name"
    //           value={form?.name}
    //           className="col-span-3"
    //           onChange={(e) => setForm({ ...form, name: e.target.value })}
    //         />
    //       </div>
    //       <div className="grid grid-cols-4 items-center gap-4">
    //         <Label htmlFor="username" className="text-right">
    //           Description
    //         </Label>
    //         <Textarea
    //           id="username"
    //           placeholder="rooms Description"
    //           value={form?.description}
    //           className="col-span-3"
    //           onChange={(e) =>
    //             setForm({ ...form, description: e.target.value })
    //           }
    //         />
    //       </div>
    //       <div className="grid w-full grid-cols-4 items-center gap-4">
    //         <Label htmlFor="picture" className="text-right">
    //           Image
    //         </Label>
    //         <Input
    //           id="picture"
    //           type="file"
    //           placeholder="Select file"
    //           value={form?.image}
    //           accept="image/png"
    //           onChange={(files) => handleSelectedFile(files.target.files)}
    //         />
    //       </div>
    //     </div>
    //     <DialogFooter>
    //       <Button
    //         type="submit"
    //         onClick={(e) => {
    //           e.preventDefault()
    //           handleSubmit(form)
    //           // handleUploadFile()
    //           setIsOpen(false)
    //         }}
    //       >
    //         Create rooms
    //       </Button>
    //       {/* <Toast /> */}
    //     </DialogFooter>
    //   </DialogContent>
    // </Dialog>
  )
}
