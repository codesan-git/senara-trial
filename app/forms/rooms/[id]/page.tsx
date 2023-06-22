'use client'

import axios from "axios"
import { useParams } from "next/navigation"
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
import useMiddleComponent from "@/app/hooks/forms/middleComponent/getMiddleComponent"
import RoomOption from "../components/RoomOption"


interface FormData {
  id: string
  name: string
  description: string
  image: string
  imgName: string | null
  middleTheme: MiddleTheme[]
  middleComponent: MiddleComponent[]
}

interface MiddleTheme {
  id: string
  themeId: string
  roomsThemeId: number
  theme: Theme
}

interface Theme {
  id: string
  value: string
  label: string
  color: string
}

interface MiddleComponent {
  id: string
  componentId: string
  roomsComponentId: string
  component: Component
}

interface Component {
  id: string
  compoenntId: string
  name: string
  price: number
  image: string
  imgName: string
}

interface FormTheme {
  themeId: string
  roomsThemeId: number
}

interface FormComponent {
  componentId: string
  roomsComponentId: number
}

export default function RoomsUpdate() {
  const params = useParams()

  const [roomsParams, setRoomsParams] = useState<FormData[]>([])
  const [middleComponentParams, setMiddleComponentParams] = useState<FormComponent[]>([])

  const { data: getTheme = [] } = useTheme()
  const { data: getComponent = [] } = useComponent()
  const { data: getThemeId = [] } = useThemeId()
  const { data: getComponentId = [] } = useComponentId()
  const { data: getMiddleTheme = [] } = useMiddleTheme()
  const { data: getMiddleComponent = [] } = useMiddleComponent()

  const [form, setForm] = useState<FormData>({
    id: "",
    name: "",
    description: "",
    image: "",
    imgName: "",
    middleTheme: [],
    middleComponent: []
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

  const handleChangeTheme = (event: SelectChangeEvent) => {
    setSelectedTheme({
      themeId: event.target.value,
      roomsThemeId: roomsParams[0].middleTheme[0].roomsThemeId
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
      roomsThemeId: selectedTheme2.roomsThemeId
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
      roomsThemeId: selectedTheme3.roomsThemeId
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
        method: "PATCH",
      }).then(() => {
        setForm({ id: "", name: "", description: "", image: "", imgName: "", middleTheme: [], middleComponent: [] })
      })
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmitTheme = async () => {
    if (selectedTheme2.themeId == "") {
      if (selectedTheme3.themeId == "") {
        try {
          // console.log("check nama", data.imgName)

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
              roomsThemeId: selectedTheme.roomsThemeId,
            })
            setSelectedTheme2({
              themeId: "",
              roomsThemeId: selectedTheme2.roomsThemeId,
            })
            setSelectedTheme3({
              themeId: "",
              roomsThemeId: selectedTheme3.roomsThemeId,
            })
          })
        } catch (error) {
          console.log(error)
        }
      } else {
        try {
          // console.log("check nama", data.imgName)
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
              roomsThemeId: selectedTheme.roomsThemeId,
            })
            setSelectedTheme2({
              themeId: "",
              roomsThemeId: selectedTheme2.roomsThemeId,
            })
            setSelectedTheme3({
              themeId: "",
              roomsThemeId: selectedTheme3.roomsThemeId,
            })
          })
        } catch (error) {
          console.log(error)
        }
      }
    } if (selectedTheme3.themeId == "") {
      if (selectedTheme.themeId == "") {
        try {
          // console.log("check nama", data.imgName)

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
              roomsThemeId: selectedTheme.roomsThemeId,
            })
            setSelectedTheme2({
              themeId: "",
              roomsThemeId: selectedTheme2.roomsThemeId,
            })
            setSelectedTheme3({
              themeId: "",
              roomsThemeId: selectedTheme3.roomsThemeId,
            })
          })
        } catch (error) {
          console.log(error)
        }
      } else {
        try {
          // console.log("check nama", data.imgName)

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
              roomsThemeId: selectedTheme.roomsThemeId,
            })
            setSelectedTheme2({
              themeId: "",
              roomsThemeId: selectedTheme2.roomsThemeId,
            })
            setSelectedTheme3({
              themeId: "",
              roomsThemeId: selectedTheme3.roomsThemeId,
            })
          })
        } catch (error) {
          console.log(error)
        }
      }
    } if (selectedTheme.themeId == "") {
      if (selectedTheme2.themeId == "") {
        try {
          // console.log("check nama", data.imgName)

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
              roomsThemeId: selectedTheme.roomsThemeId,
            })
            setSelectedTheme2({
              themeId: "",
              roomsThemeId: selectedTheme2.roomsThemeId,
            })
            setSelectedTheme3({
              themeId: "",
              roomsThemeId: selectedTheme3.roomsThemeId,
            })
          })
        } catch (error) {
          console.log(error)
        }
      } else {
        try {
          // console.log("check nama", data.imgName)

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
              roomsThemeId: selectedTheme.roomsThemeId,
            })
            setSelectedTheme2({
              themeId: "",
              roomsThemeId: selectedTheme2.roomsThemeId,
            })
            setSelectedTheme3({
              themeId: "",
              roomsThemeId: selectedTheme3.roomsThemeId,
            })
          })
        } catch (error) {
          console.log(error)
        }
      }
    } else {
      try {
        // console.log("check nama", data.imgName)

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
            roomsThemeId: selectedTheme.roomsThemeId,
          })
          setSelectedTheme2({
            themeId: "",
            roomsThemeId: selectedTheme2.roomsThemeId,
          })
          setSelectedTheme3({
            themeId: "",
            roomsThemeId: selectedTheme3.roomsThemeId,
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
          // console.log("check nama", data.imgName)

          fetch(`http://localhost:3000/api/middleComponent`, {
            body: JSON.stringify(selectedComponent),
            headers: {
              "Content-Type": "application/json",
            },
            method: "PATCH",
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
          // console.log("check nama", data.imgName)
          fetch(`http://localhost:3000/api/middleComponent`, {
            body: JSON.stringify([selectedComponent, selectedComponent3]),
            headers: {
              "Content-Type": "application/json",
            },
            method: "PATCH",
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
          // console.log("check nama", data.imgName)

          fetch(`http://localhost:3000/api/middleComponent`, {
            body: JSON.stringify(selectedComponent2),
            headers: {
              "Content-Type": "application/json",
            },
            method: "PATCH",
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
          // console.log("check nama", data.imgName)

          fetch(`http://localhost:3000/api/middleComponent`, {
            body: JSON.stringify([selectedComponent, selectedComponent2]),
            headers: {
              "Content-Type": "application/json",
            },
            method: "PATCH",
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
          // console.log("check nama", data.imgName)

          fetch(`http://localhost:3000/api/middleComponent`, {
            body: JSON.stringify(selectedComponent3),
            headers: {
              "Content-Type": "application/json",
            },
            method: "PATCH",
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
          // console.log("check nama", data.imgName)

          fetch(`http://localhost:3000/api/middleComponent`, {
            body: JSON.stringify([selectedComponent2, selectedComponent3]),
            headers: {
              "Content-Type": "application/json",
            },
            method: "PATCH",
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
        // console.log("check nama", data.imgName)

        fetch(`http://localhost:3000/api/middleComponent`, {
          body: JSON.stringify([selectedComponent, selectedComponent2, selectedComponent3]),
          headers: {
            "Content-Type": "application/json",
          },
          method: "PATCH",
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

  const renderMiddleComponent = () => {
    return roomsParams[0]?.middleComponent?.map((kocak) => {
      return (
        <RoomOption
          componentName={kocak.component.name}
          componentId={kocak.id}
          middleRoomsId={kocak.roomsComponentId}
        />
      )
    })
  }

  const updateRoomCollection = async () => {
    try {
      const res = await axios.patch(`http://localhost:3000/api/rooms/${roomsParams[0].id}`, {
        name: form.name ? form.name : roomsParams[0].name,
        description: form.description ? form.description : roomsParams[0].description
      }
      );
      fetchRoomParams();
      form.name = ""
      form.description = ""

    } catch (error) {
      console.log(error)
    }
  }

  const fetchRoomParams = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/rooms/${params.id}`);
      // console.log(res.data[0])
      setRoomsParams(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchRoomParams()
    // fetchMiddleComponent()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  // console.log(`params`,params.id)
  console.log('roomsparams', roomsParams)
  console.log('getget', roomsParams[0]?.middleTheme)
  console.log('form', form.name)
  console.log(`selectedtheme`, selectedTheme)
  // console.log('middleParams', middleComponentParams)
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

                  <Image
                    src={roomsParams[0]?.image}
                    alt={"dogi"}
                    width={300}
                    height={300}
                    className="rounded-md"
                  />


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
                      placeholder={roomsParams[0]?.name}
                      value={form?.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="description">
                      Room Collection Description
                    </Label>
                    <Textarea
                      id="description"
                      placeholder={roomsParams[0]?.description}
                      className="h-40"
                      value={form?.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
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
                    <div className="flex flex-col gap-4 last:pb-4">
                      {/* {roomsParams[0]?.middleComponent?.map((kocak) => (
                        <div className="grid w-full grid-cols-4 gap-2">
                          <Button variant="outline" disabled className="col-span-3 w-full">{kocak.component.name}</Button>
                          <Button variant="destructive" className="w-full">Delete</Button>
                        </div>
                      ))} */}
                      {renderMiddleComponent()}
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
                            <MenuItem
                              value={component.id}
                              disabled={roomsParams[0]?.middleComponent[0]?.componentId == component.id || roomsParams[0]?.middleComponent[1]?.componentId == component.id || roomsParams[0]?.middleComponent[2]?.componentId == component.id || roomsParams[0]?.middleComponent[3]?.componentId == component.id || roomsParams[0]?.middleComponent[4]?.componentId == component.id ? true : false}
                            >{component.name}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
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
                              disabled={roomsParams[0]?.middleComponent[0]?.componentId == component.id || roomsParams[0]?.middleComponent[1]?.componentId == component.id || roomsParams[0]?.middleComponent[2]?.componentId == component.id || roomsParams[0]?.middleComponent[3]?.componentId == component.id || roomsParams[0]?.middleComponent[4]?.componentId == component.id ? true : false}
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
                    <div className="flex flex-col gap-4 last:pb-4">
                      {roomsParams[0]?.middleTheme?.map((kocak) => (
                        <div className="grid w-full grid-cols-4 gap-2">
                          <Button variant="outline" disabled className="col-span-3 w-full">{kocak.theme.value}</Button>
                          <Button variant="destructive" className="w-full">Delete</Button>
                        </div>
                      ))}
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
                              disabled={roomsParams[0]?.middleTheme[0]?.themeId == theme.id || roomsParams[0]?.middleTheme[1]?.themeId == theme.id || roomsParams[0]?.middleTheme[2]?.themeId == theme.id || roomsParams[0]?.middleTheme[3]?.themeId == theme.id || roomsParams[0]?.middleTheme[4]?.themeId == theme.id ? true : false}
                            >{theme.value}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
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
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-end gap-4">
            <Button variant="ghost">Reset</Button>
            <Button
              onClick={(e) => {
                e.preventDefault()
                updateRoomCollection()
                // handleSubmit(form)
                handleSubmitTheme()
                handleSubmitComponent()
                // router.replace("localhost:3000/forms/rooms")
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
