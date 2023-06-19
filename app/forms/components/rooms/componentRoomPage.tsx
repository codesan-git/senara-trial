"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import Box from "@mui/material/Box"
import FormControl from "@mui/material/FormControl"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import { Rooms } from "@prisma/client"
import { Value } from "@radix-ui/react-select"
import Select, { SelectChangeEvent } from "@mui/material/Select"
import chroma from "chroma-js"
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import { storage } from "firebaseConfig"
import { Key, List, Option } from "lucide-react"
// import Select, { StylesConfig } from "react-select"

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
import { colourOptions } from "@/app/docs/data"
import useComponent from "@/app/hooks/forms/component/getComponentHooks"
import useMiddleTheme from "@/app/hooks/forms/middleTheme/getMiddleTheme"
import useThemeId from "@/app/hooks/forms/middleTheme/getThemeId"
import useRoomss from "@/app/hooks/forms/rooms/getRoomsHooks"
import useTheme from "@/app/hooks/forms/theme/getThemeHooks"

import ThemeSelect from "../../rooms/components/ThemeSelect"
import { id } from "date-fns/locale"
import useComponentId from "@/app/hooks/forms/middleComponent/getComponentId"

interface ColourOption {
  readonly value: string
  readonly label: string
  readonly color: string
  readonly isFixed?: boolean
  readonly isDisabled?: boolean
}

interface RoomsData {
  rooms: Rooms
}

interface FormData {
  name: string
  description: string
  image: string
  imgName: string | null
}

interface FormTheme {
  themeId: string
  roomsThemeId: number
}

interface FormComponent {
  componentId: string
  roomsComponentId: number
}

interface RoomsProps extends React.HTMLAttributes<HTMLDivElement> {
  aspectRatio?: "portrait" | "square"
}


export function ComponentRoomPage(data: FormData) {
  const { data: getTheme = [] } = useTheme()
  const { data: getComponent = [] } = useComponent()
  const { data: getThemeId = [] } = useThemeId()
  const { data: getComponentId = [] } = useComponentId()
  const { data: getMiddleTheme = [] } = useMiddleTheme()

  const [form, setForm] = useState<FormData>({
    name: "",
    description: "",
    image: "",
    imgName: "",
  })

  const [fileUrl, setFileUrl] = useState("")
  // const [selectedArrTheme, setSelectedArrTheme] = useState<{ themeId: string; roomsId: number }[]>([],)

  const [selectedTheme, setSelectedTheme] = useState<FormTheme>({
    themeId: "",
    roomsThemeId: 0,
  })

  const [selectedTheme2, setSelectedTheme2] = useState<FormTheme>({
    themeId: "",
    roomsThemeId: 0,
  })

  const [selectedTheme3, setSelectedTheme3] = useState<FormTheme>({
    themeId: "",
    roomsThemeId: 0,
  })

  const [selectedComponent, setSelectedComponent] = useState<FormComponent>({
    componentId: "",
    roomsComponentId: 0,
  })

  const [selectedComponent2, setSelectedComponent2] = useState<FormComponent>({
    componentId: "",
    roomsComponentId: 0,
  })

  const [selectedComponent3, setSelectedComponent3] = useState<FormComponent>({
    componentId: "",
    roomsComponentId: 0,
  })

  const [newTheme, setNewTheme] = useState(false)
  const [newTheme2, setNewTheme2] = useState(false)

  const [newComponent, setNewComponent] = useState(false)
  const [newComponent2, setNewComponent2] = useState(false)

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
    setSelectedTheme({
      themeId: event.target.value,
      roomsThemeId: parseInt(getThemeId[0].roomsThemeId + 1)
    })
    setNewTheme(true)
    // if (selectedTheme.roomsThemeId != 0) {
    // }else{
    //   setSelectedTheme({
    //     themeId: event.target.value,
    //     roomsThemeId: 1
    //   })
    //   setNewTheme(true)
    // }
  }

  const handleChangeTheme2 = (event: SelectChangeEvent) => {
    setSelectedTheme2({
      themeId: event.target.value,
      roomsThemeId: parseInt(getThemeId[0].roomsThemeId + 1)
    })
    setNewTheme2(true)
    //   if (selectedTheme2.roomsThemeId != 0) {
    // }else{
    //   setSelectedTheme2({
    //     themeId: event.target.value,
    //     roomsThemeId: 1
    //   })
    //   setNewTheme2(true)
    // }
  }

  const handleChangeTheme3 = (event: SelectChangeEvent) => {
    setSelectedTheme3({
      themeId: event.target.value,
      roomsThemeId: parseInt(getThemeId[0].roomsThemeId + 1)
    })
    // if (selectedTheme3.roomsThemeId != 0) {
    // }else{
    //   setSelectedTheme3({
    //     themeId: event.target.value,
    //     roomsThemeId: 1
    //   })
    // }
  }

  const handleChangeComponent = (event: SelectChangeEvent) => {
    setSelectedComponent({
      componentId: event.target.value,
      roomsComponentId: parseInt(getComponentId[0].roomsComponentId + 1)
    })
    setNewComponent(true)
    // if(selectedComponent.roomsComponentId != 0){
    // }else{
    //   setSelectedComponent({
    //     componentId: event.target.value,
    //     roomsComponentId: 1
    //   })
    //   setNewComponent(true)
    // }
  }

  const handleChangeComponent2 = (event: SelectChangeEvent) => {
    setSelectedComponent2({
      componentId: event.target.value,
      roomsComponentId: parseInt(getComponentId[0].roomsComponentId + 1)
    })
    setNewComponent2(true)
    // if(selectedComponent2.roomsComponentId != 0){
    // }else{
    //   setSelectedComponent2({
    //     componentId: event.target.value,
    //     roomsComponentId: 1
    //   })
    //   setNewComponent2(true)
    // }
  }

  const handleChangeComponent3 = (event: SelectChangeEvent) => {
    setSelectedComponent3({
      componentId: event.target.value,
      roomsComponentId: parseInt(getComponentId[0].roomsComponentId + 1)
    })
    // if(selectedComponent3.roomsComponentId != 0){
    // }else{
    //   setSelectedComponent3({
    //     componentId: event.target.value,
    //     roomsComponentId: 1
    //   })
    // }
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

  const handleSubmitTheme = async () => {
    if (selectedTheme2.themeId == "") {
      if (selectedTheme3.themeId == "") {
        try {
          console.log("check nama", data.imgName)

          fetch(`http://localhost:3000/api/middleTheme`, {
            body: JSON.stringify(selectedTheme),
            headers: {
              "Content-Type": "application/json",
            },
            method: "POST",
          })
            .then(() => {
              setSelectedTheme({
                themeId: "",
                roomsThemeId: getThemeId[0].roomsThemeId,
              })
              setSelectedTheme2({
                themeId: "",
                roomsThemeId: getThemeId[0].roomsThemeId,
              })
              setSelectedTheme3({
                themeId: "",
                roomsThemeId: getThemeId[0].roomsThemeId,
              })
            })
        } catch (error) {
          console.log(error)
        }
      } else {
        try {
          console.log("check nama", data.imgName)
          fetch(`http://localhost:3000/api/middleTheme`, {
            body: JSON.stringify([selectedTheme, selectedTheme3]),
            headers: {
              "Content-Type": "application/json",
            },
            method: "POST",
          })
            .then(() => {
              setSelectedTheme({
                themeId: "",
                roomsThemeId: getThemeId[0].roomsThemeId,
              })
              setSelectedTheme2({
                themeId: "",
                roomsThemeId: getThemeId[0].roomsThemeId,
              })
              setSelectedTheme3({
                themeId: "",
                roomsThemeId: getThemeId[0].roomsThemeId,
              })
            })
        } catch (error) {
          console.log(error)
        }
      }
    } if (selectedTheme3.themeId == "") {
      if (selectedTheme.themeId == "") {
        try {
          console.log("check nama", data.imgName)

          fetch(`http://localhost:3000/api/middleTheme`, {
            body: JSON.stringify(selectedTheme2),
            headers: {
              "Content-Type": "application/json",
            },
            method: "POST",
          })
            .then(() => {
              setSelectedTheme({
                themeId: "",
                roomsThemeId: getThemeId[0].roomsThemeId,
              })
              setSelectedTheme2({
                themeId: "",
                roomsThemeId: getThemeId[0].roomsThemeId,
              })
              setSelectedTheme3({
                themeId: "",
                roomsThemeId: getThemeId[0].roomsThemeId,
              })
            })
        } catch (error) {
          console.log(error)
        }
      } else {
        try {
          console.log("check nama", data.imgName)

          fetch(`http://localhost:3000/api/middleTheme`, {
            body: JSON.stringify([selectedTheme, selectedTheme2]),
            headers: {
              "Content-Type": "application/json",
            },
            method: "POST",
          })
            .then(() => {
              setSelectedTheme({
                themeId: "",
                roomsThemeId: getThemeId[0].roomsThemeId,
              })
              setSelectedTheme2({
                themeId: "",
                roomsThemeId: getThemeId[0].roomsThemeId,
              })
              setSelectedTheme3({
                themeId: "",
                roomsThemeId: getThemeId[0].roomsThemeId,
              })
            })
        } catch (error) {
          console.log(error)
        }
      }
    } if (selectedTheme.themeId == "") {
      if (selectedTheme2.themeId == "") {
        try {
          console.log("check nama", data.imgName)

          fetch(`http://localhost:3000/api/middleTheme`, {
            body: JSON.stringify(selectedTheme3),
            headers: {
              "Content-Type": "application/json",
            },
            method: "POST",
          })
            .then(() => {
              setSelectedTheme({
                themeId: "",
                roomsThemeId: getThemeId[0].roomsThemeId,
              })
              setSelectedTheme2({
                themeId: "",
                roomsThemeId: getThemeId[0].roomsThemeId,
              })
              setSelectedTheme3({
                themeId: "",
                roomsThemeId: getThemeId[0].roomsThemeId,
              })
            })
        } catch (error) {
          console.log(error)
        }
      } else {
        try {
          console.log("check nama", data.imgName)

          fetch(`http://localhost:3000/api/middleTheme`, {
            body: JSON.stringify([selectedTheme2, selectedTheme3]),
            headers: {
              "Content-Type": "application/json",
            },
            method: "POST",
          })
            .then(() => {
              setSelectedTheme({
                themeId: "",
                roomsThemeId: getThemeId[0].roomsThemeId,
              })
              setSelectedTheme2({
                themeId: "",
                roomsThemeId: getThemeId[0].roomsThemeId,
              })
              setSelectedTheme3({
                themeId: "",
                roomsThemeId: getThemeId[0].roomsThemeId,
              })
            })
        } catch (error) {
          console.log(error)
        }
      }
    } else {
      try {
        console.log("check nama", data.imgName)

        fetch(`http://localhost:3000/api/middleTheme`, {
          body: JSON.stringify([selectedTheme, selectedTheme2, selectedTheme3]),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        })
          .then(() => {
            setSelectedTheme({
              themeId: "",
              roomsThemeId: getThemeId[0].roomsThemeId,
            })
            setSelectedTheme2({
              themeId: "",
              roomsThemeId: getThemeId[0].roomsThemeId,
            })
            setSelectedTheme3({
              themeId: "",
              roomsThemeId: getThemeId[0].roomsThemeId,
            })
          })
      } catch (error) {
        console.log(error)
      }
    }
  }

  const handleSubmitComponent = async () => {
    if (selectedComponent2.componentId == "") {
      if (selectedComponent3.componentId == "") {
        try {
          console.log("check nama", data.imgName)

          fetch(`http://localhost:3000/api/middleComponent`, {
            body: JSON.stringify(selectedComponent),
            headers: {
              "Content-Type": "application/json",
            },
            method: "POST",
          })
            .then(() => {
              setSelectedComponent({
                componentId: "",
                roomsComponentId: getComponentId[0].roomsComponentId,
              })
              setSelectedComponent2({
                componentId: "",
                roomsComponentId: getComponentId[0].roomsComponentId,
              })
              setSelectedComponent3({
                componentId: "",
                roomsComponentId: getComponentId[0].roomsComponentId,
              })
            })
        } catch (error) {
          console.log(error)
        }
      } else {
        try {
          console.log("check nama", data.imgName)
          fetch(`http://localhost:3000/api/middleComponent`, {
            body: JSON.stringify([selectedComponent, selectedComponent3]),
            headers: {
              "Content-Type": "application/json",
            },
            method: "POST",
          })
            .then(() => {
              setSelectedComponent({
                componentId: "",
                roomsComponentId: getComponentId[0].roomsComponentId,
              })
              setSelectedComponent2({
                componentId: "",
                roomsComponentId: getComponentId[0].roomsComponentId,
              })
              setSelectedComponent3({
                componentId: "",
                roomsComponentId: getComponentId[0].roomsComponentId,
              })
            })
        } catch (error) {
          console.log(error)
        }
      }
    } if (selectedComponent3.componentId == "") {
      if (selectedComponent.componentId == "") {
        try {
          console.log("check nama", data.imgName)

          fetch(`http://localhost:3000/api/middleComponent`, {
            body: JSON.stringify(selectedComponent2),
            headers: {
              "Content-Type": "application/json",
            },
            method: "POST",
          })
            .then(() => {
              setSelectedComponent({
                componentId: "",
                roomsComponentId: getComponentId[0].roomsComponentId,
              })
              setSelectedComponent2({
                componentId: "",
                roomsComponentId: getComponentId[0].roomsComponentId,
              })
              setSelectedComponent3({
                componentId: "",
                roomsComponentId: getComponentId[0].roomsComponentId,
              })
            })
        } catch (error) {
          console.log(error)
        }
      } else {
        try {
          console.log("check nama", data.imgName)

          fetch(`http://localhost:3000/api/middleComponent`, {
            body: JSON.stringify([selectedComponent, selectedComponent2]),
            headers: {
              "Content-Type": "application/json",
            },
            method: "POST",
          })
            .then(() => {
              setSelectedComponent({
                componentId: "",
                roomsComponentId: getComponentId[0].roomsComponentId,
              })
              setSelectedComponent2({
                componentId: "",
                roomsComponentId: getComponentId[0].roomsComponentId,
              })
              setSelectedComponent3({
                componentId: "",
                roomsComponentId: getComponentId[0].roomsComponentId,
              })
            })
        } catch (error) {
          console.log(error)
        }
      }
    } if (selectedComponent.componentId == "") {
      if (selectedComponent2.componentId == "") {
        try {
          console.log("check nama", data.imgName)

          fetch(`http://localhost:3000/api/middleComponent`, {
            body: JSON.stringify(selectedComponent3),
            headers: {
              "Content-Type": "application/json",
            },
            method: "POST",
          })
            .then(() => {
              setSelectedComponent({
                componentId: "",
                roomsComponentId: getComponentId[0].roomsComponentId,
              })
              setSelectedComponent2({
                componentId: "",
                roomsComponentId: getComponentId[0].roomsComponentId,
              })
              setSelectedComponent3({
                componentId: "",
                roomsComponentId: getComponentId[0].roomsComponentId,
              })
            })
        } catch (error) {
          console.log(error)
        }
      } else {
        try {
          console.log("check nama", data.imgName)

          fetch(`http://localhost:3000/api/middleComponent`, {
            body: JSON.stringify([selectedComponent2, selectedComponent3]),
            headers: {
              "Content-Type": "application/json",
            },
            method: "POST",
          })
            .then(() => {
              setSelectedComponent({
                componentId: "",
                roomsComponentId: getComponentId[0].roomsComponentId,
              })
              setSelectedComponent2({
                componentId: "",
                roomsComponentId: getComponentId[0].roomsComponentId,
              })
              setSelectedComponent3({
                componentId: "",
                roomsComponentId: getComponentId[0].roomsComponentId,
              })
            })
        } catch (error) {
          console.log(error)
        }
      }
    } else {
      try {
        console.log("check nama", data.imgName)

        fetch(`http://localhost:3000/api/middleComponent`, {
          body: JSON.stringify([selectedComponent, selectedComponent2, selectedComponent3]),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
        })
          .then(() => {
            setSelectedComponent({
              componentId: "",
              roomsComponentId: getComponentId[0].roomsComponentId,
            })
            setSelectedComponent2({
              componentId: "",
              roomsComponentId: getComponentId[0].roomsComponentId,
            })
            setSelectedComponent3({
              componentId: "",
              roomsComponentId: getComponentId[0].roomsComponentId,
            })
          })
      } catch (error) {
        console.log(error)
      }
    }
  }

  const handleSubmit = async (data: FormData) => {
    try {
      if (imageFile) {
        const name = data.name.replace(" ", "")
        const storageRef = ref(storage, `image/rooms/${name}`)
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
              // setFileUrl(url)
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

  const previewImg = async (data: FormData) => {
    try {
      if (imageFile) {
        const name = data.name.replace(" ", "")
        const storageRef = ref(storage, `image/rooms/${name}`)
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
              setFileUrl(url)
              // create(data, url, name)
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

  const addNewTheme = () => {
    return
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel
          id="theme-include-label"
          className="text-slate-200"
        >
          Theme Include
        </InputLabel>
        <Select
          labelId="theme-include-label"
          id="theme-include"
          // value={selectedTheme.themeId}
          label="Theme Include"
          onChange={handleChangeTheme}
          className="bg-slate-950 text-slate-200"
        >
          {getTheme.map((theme: any) => (
            <MenuItem value={theme.id}>{theme.value}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  }

  // const colourStyles: StylesConfig<ColourOption, true> = {
  //   control: (styles) => ({ ...styles, backgroundColor: "black" }),
  //   option: (styles, { data, isDisabled, isFocused, isSelected }) => {
  //     const color = chroma(data.color)
  //     return {
  //       ...styles,
  //       backgroundColor: isDisabled
  //         ? undefined
  //         : isSelected
  //         ? data.color
  //         : isFocused
  //         ? color.alpha(0.1).css()
  //         : undefined,
  //       color: isDisabled
  //         ? "#ccc"
  //         : isSelected
  //         ? chroma.contrast(color, "white") > 2
  //           ? "white"
  //           : "black"
  //         : data.color,
  //       cursor: isDisabled ? "not-allowed" : "default",

  //       ":active": {
  //         ...styles[":active"],
  //         backgroundColor: !isDisabled
  //           ? isSelected
  //             ? data.color
  //             : color.alpha(0.3).css()
  //           : undefined,
  //       },
  //     }
  //   },
  //   multiValue: (styles, { data }) => {
  //     const color = chroma(data.color)
  //     return {
  //       ...styles,
  //       backgroundColor: color.alpha(0.1).css(),
  //     }
  //   },
  //   multiValueLabel: (styles, { data }) => ({
  //     ...styles,
  //     color: data.color,
  //   }),
  //   multiValueRemove: (styles, { data }) => ({
  //     ...styles,
  //     color: data.color,
  //     ":hover": {
  //       backgroundColor: data.color,
  //       color: "white",
  //     },
  //   }),
  // }



  console.log("theme-1", selectedTheme)
  console.log("theme-2", selectedTheme2)
  console.log("theme-3", selectedTheme3)
  console.log("component-1", selectedComponent)
  console.log("component-2", selectedComponent2)
  console.log("component-3", selectedComponent3)
  // console.log("component", selectedComponent)
  // console.log("ThemeId", getThemeId)
  console.log("theme beneran", getTheme)
  console.log('component beneran', getComponent)
  console.log('fileUrl', fileUrl)
  // console.log("middletheme", getMiddleTheme)
  return (
    <div>
      <Card className="w-full border-none ">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add/Edit Room Collection</CardTitle>
          </CardHeader>
          <CardContent>
            <form>
              <div className="flex gap-8">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="picture" className="text-left">
                    Image
                  </Label>
                  {
                    !imageFile ? 
                    <Image
                    src={"https://images.unsplash.com/photo-1685460939882-da7c7cb6f3ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80"}
                    alt={"dogi"}
                    width={300}
                    height={300}
                    className="rounded-md"
                  /> 
                  :
                  <Image
                    src={fileUrl}
                    alt={"dogi"}
                    width={300}
                    height={300}
                    className="rounded-md"
                  />
                  }
                  
                  <Input
                    id="picture"
                    type="file"
                    placeholder="Select file"
                    value={form?.image}
                    accept="image/png"
                    width={300}
                    onChange={(files) => handleSelectedFile(files.target.files)}
                  />
                </div>
                <div className="grid w-full">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Room Collection Name</Label>
                    <Input 
                      id="name" 
                      placeholder="Name of your Room" 
                      value={form?.name}
                      onChange={(e)=> setForm({...form, name: e.target.value})}  
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="description">
                      Room Collection Description
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Fill with Description"
                      className="h-40"
                      value={form?.description}
                      onChange={(e)=> setForm({...form, description: e.target.value})}
                    />
                  </div>
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
                  <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth>
                      <InputLabel
                        id="component-include-label"
                        className="text-slate-200"
                      >
                        Component Include
                      </InputLabel>
                      <Select
                        labelId="component-include-label"
                        id="component-include"
                        value={selectedComponent.componentId}
                        label="Component Include"
                        onChange={handleChangeComponent}
                        className="bg-slate-950 text-slate-200"
                      >
                        <MenuItem
                          value={0}
                          onChange={(e) => setSelectedComponent({ componentId: "", roomsComponentId: 0 })}
                        >=========|||=========</MenuItem>
                        {getComponent.map((component: any) => (
                          <MenuItem value={component.id}>
                            {component.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {newComponent === false ? null : (
                      <FormControl fullWidth className="mt-4">
                        <InputLabel
                          id="component-include-label-2"
                          className="text-slate-200"
                        >
                          Component Include
                        </InputLabel>
                        <Select
                          labelId="component-include-label-2"
                          id="component-include-2"
                          value={selectedComponent2.componentId}
                          label="Component Include-2"
                          onChange={handleChangeComponent2}
                          className="bg-slate-950 text-slate-200"
                        >
                          <MenuItem
                            value={0}
                            onChange={(e) => setSelectedComponent2({ componentId: "", roomsComponentId: 0 })}
                          >=========|||=========</MenuItem>
                          {getComponent.map((component: any) => (
                            <MenuItem
                              value={component.id}
                              disabled={selectedComponent.componentId == component.id || selectedComponent2.componentId == component.id || selectedComponent3.componentId == component.id ? true : false}
                            >{component.name}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                    {newComponent2 === false ? null : (
                      <FormControl fullWidth className="mt-4">
                        <InputLabel
                          id="component-include-label-3"
                          className="text-slate-200"
                        >
                          Component Include
                        </InputLabel>
                        <Select
                          labelId="component-include-label-3"
                          id="component-include-3"
                          value={selectedComponent3.componentId}
                          label="Component Include-3"
                          onChange={handleChangeComponent3}
                          className="bg-slate-950 text-slate-200"
                        >
                          <MenuItem
                            value={0}
                            onChange={(e) => setSelectedComponent3({ componentId: "", roomsComponentId: 0 })}
                          >=========|||=========</MenuItem>
                          {getComponent.map((component: any) => (
                            <MenuItem
                              value={component.id}
                              disabled={selectedComponent.componentId == component.id || selectedComponent2.componentId == component.id || selectedComponent3.componentId == component.id ? true : false}
                            >{component.name}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  </Box>
                  <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth>
                      <InputLabel
                        id="theme-include-label"
                        className="text-slate-200"
                      >
                        Theme Include
                      </InputLabel>
                      <Select
                        labelId="theme-include-label"
                        id="theme-include"
                        value={selectedTheme.themeId}
                        label="Theme Include"
                        onChange={handleChangeTheme}
                        className="bg-slate-950 text-slate-200"
                      >
                        <MenuItem
                          value={0}
                          onChange={(e) => setSelectedTheme({ themeId: "", roomsThemeId: 0 })}
                        >=========|||=========</MenuItem>
                        {getTheme.map((theme: any) => (
                          <MenuItem
                            value={theme.id}
                            disabled={selectedTheme.themeId == theme.id || selectedTheme2.themeId == theme.id || selectedTheme3.themeId == theme.id ? true : false}
                          >{theme.value}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {newTheme === false ? null : (
                      <FormControl fullWidth className="mt-4">
                        <InputLabel
                          id="theme-include-label-2"
                          className="text-slate-200"
                        >
                          Theme Include
                        </InputLabel>
                        <Select
                          labelId="theme-include-label-2"
                          id="theme-include-2"
                          value={selectedTheme2.themeId}
                          label="Theme Include-2"
                          onChange={handleChangeTheme2}
                          className="bg-slate-950 text-slate-200"
                        >
                          <MenuItem
                            value={0}
                            onChange={(e) => setSelectedTheme2({ themeId: "", roomsThemeId: 0 })}
                          >=========|||=========</MenuItem>
                          {getTheme.map((theme: any) => (
                            <MenuItem
                              value={theme.id}
                              disabled={selectedTheme.themeId == theme.id || selectedTheme2.themeId == theme.id || selectedTheme3.themeId == theme.id ? true : false}
                            >{theme.value}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                    {newTheme2 === false ? null : (
                      <FormControl fullWidth className="mt-4">
                        <InputLabel
                          id="theme-include-label-3"
                          className="text-slate-200"
                        >
                          Theme Include
                        </InputLabel>
                        <Select
                          labelId="theme-include-label-3"
                          id="theme-include-3"
                          value={selectedTheme3.themeId}
                          label="Theme Include-3"
                          onChange={handleChangeTheme3}
                          className="bg-slate-950 text-slate-200"
                        >
                          <MenuItem
                            value={0}
                            onChange={(e) => setSelectedTheme3({ themeId: "", roomsThemeId: 0 })}
                          >=========|||=========</MenuItem>
                          {getTheme.map((theme: any) => (
                            <MenuItem
                              value={theme.id}
                              disabled={selectedTheme.themeId == theme.id || selectedTheme2.themeId == theme.id || selectedTheme3.themeId == theme.id ? true : false}
                            >{theme.value}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  </Box>
                  {/* <Button onClick={()=> setNewTheme(true)}>Add Theme</Button> */}
                  {/* <ThemeSelect /> */}
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-end gap-4">
            <Button variant="ghost">Reset</Button>
            <Button
              onClick={(e) => {
                e.preventDefault()
                handleSubmit(form)
                handleSubmitTheme()
                handleSubmitComponent()
                router.replace("localhost:3000/forms/rooms")
              }}
            >
              Deploy
            </Button>
          </CardFooter>
        </Card>
      </Card>
    </div>
  )
}
