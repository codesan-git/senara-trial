"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import Box from "@mui/material/Box"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select, { SelectChangeEvent } from "@mui/material/Select"
import { Rooms } from "@prisma/client"
import { Value } from "@radix-ui/react-select"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import { storage } from "firebaseConfig"
import { Key, List, Option } from "lucide-react"

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
import { ScrollArea } from "@/components/ui/scroll-area"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import useMiddleTheme from "@/app/hooks/forms/middleTheme/getMiddleTheme"
import useRoomss from "@/app/hooks/forms/rooms/getRoomsHooks"
import useTheme from "@/app/hooks/forms/theme/getThemeHooks"
import useComponent from "@/app/hooks/forms/component/getComponentHooks"
interface RoomsData {
  rooms: Rooms
}

interface FormData {
  name: string
  description: string
  image: string
  imgName: string
}

interface FormTheme {
  themeId: string
  roomsId: number
}

interface RoomsProps extends React.HTMLAttributes<HTMLDivElement> {
  aspectRatio?: "portrait" | "square"
}

export function ComponentRoomPage(data: FormData) {
  const { data: getMiddleTheme = [] } = useMiddleTheme()
  const { data: getTheme = [] } = useTheme()
  const { data: getComponent = [] } = useComponent()
  const { toast } = useToast()

  const [form, setForm] = useState<FormData>({
    name: "",
    description: "",
    image: "",
    imgName: "",
  })
  const [selectedTheme, setSelectedTheme] = useState<FormTheme>({
    themeId: "",
    roomsId: 2,
  })

  const [selectedThemeName, setSelectedThemeName] = useState("")
  const [selectedComponentName, setSelectedComponentName] = useState("")

  const [imageFile, setImageFile] = useState<File>()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [downloadURL, setDownloadURL] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [progressUpload, setProgressUpload] = useState(0)

  const router = useRouter()

  const handleChangeTheme = (event: SelectChangeEvent) => {
    // setSelectedThemeName(event.target.value as string)
    setSelectedTheme({themeId:event.target.value, roomsId:selectedTheme.roomsId})
  }

  const handleChangeComponent = (event: SelectChangeEvent) => {
    setSelectedComponentName(event.target.value as string)
  }

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

  async function themeId() {
    try {
      // console.log("check nama", data.imgName)

      fetch(`http://localhost:3000/api/getThemeId/${selectedTheme}`, {
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
        method: "GET",
      }).then(() => {
        // setSelectedTheme({ name: "", description: "", image: "", imgName: "" })
      })
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmitTheme = async() =>{
    try {
      console.log("check nama", data.imgName)
      
      fetch(`http://localhost:3000/api/middleTheme`, {
        body: JSON.stringify(selectedTheme),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      }).then(() => {
        setSelectedTheme({ ...selectedTheme, themeId: "" })
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

  function logValue() {
    setSelectedThemeName((e: any) => e.target?.value)
    console.log(selectedThemeName)
  }

  console.log("selectname", selectedTheme)
  console.log('selectedName', selectedThemeName)
  console.log("select component", selectedComponentName)
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
                  {/* <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="component">Include Component</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select"  />
                        <SelectContent position="popper" id="component">
                          <SelectItem value="next" >Next.js</SelectItem>
                          <SelectItem value="sveltekit">SvelteKit</SelectItem>
                          <SelectItem value="astro">Astro</SelectItem>
                          <SelectItem value="nuxt">Nuxt.js</SelectItem>
                        </SelectContent>
                      </SelectTrigger>
                    </Select>
                  </div> */}
                  {/* <div className="flex flex-col space-y-1.5"> */}
                  {/* <Label htmlFor="theme">Theme Include</Label>
                    <Select onValueChange={()=>setSelectedThemeName(selectedThemeName)}>
                      <SelectTrigger>
                        <SelectValue
                          placeholder="Select"
                        />

                        <SelectContent position="popper">
                          <ScrollArea className="h-[200px] rounded-md border p-4">
                            {getTheme.map((theme: any) => (
                              <div key={theme.id}>
                                <SelectItem
                                  id="theme"
                                  value={theme.name}
                                  placeholder={selectedThemeName}
                                >
                                  {theme.name}
                                </SelectItem>
                              </div>
                            ))}
                          </ScrollArea>
                        </SelectContent>
                      </SelectTrigger>
                    </Select> */}

                  {/* {getTheme.map((theme:any)=>(
                    <button onClick={()=>setSelectedThemeName(theme.name)}>
                      {theme.name}
                    </button>
                    ))} */}

                  {/* Test New Select */}
                  {/* <select
                      name="theme"
                      id="theme"
                      onChange={(e: any) =>
                        setSelectedThemeName(e.target.value)
                      }
                      className=""
                    >
                      {getTheme.map((theme: any) => (
                        <option value={theme.name}>{theme.name}</option>
                      ))}
                    </select> */}
                  {/* <button onClick={logValue}>Button</button> */}
                  {/* </div> */}

                  {/* MUI SELECT */}
                  <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth>
                      <InputLabel id="component-include-label" className="text-slate-200">Component Include</InputLabel>
                      <Select
                        labelId="component-include-label"
                        id="component-include"
                        value={selectedComponentName}
                        label="Component Include"
                        onChange={handleChangeComponent}
                        className="bg-slate-950 text-slate-200"
                      >
                        {getComponent.map((component:any)=>(
                          <MenuItem value={component.id}>{component.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth>
                      <InputLabel id="theme-include-label" className="text-slate-200">Theme Include</InputLabel>
                      <Select
                        labelId="theme-include-label"
                        id="theme-include"
                        value={selectedTheme.themeId}
                        label="Theme Include"
                        onChange={handleChangeTheme}
                        className="bg-slate-950 text-slate-200"
                      >
                        {getTheme.map((theme:any)=>(
                          <MenuItem value={theme.id}>{theme.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-end gap-4">
            <Button variant="ghost">Reset</Button>
            <Button onClick={(e)=>
              {
                e.preventDefault()
                handleSubmitTheme()
              }
              }>Deploy</Button>
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
