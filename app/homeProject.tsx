"use client"

import Image from "next/image"
import { deleteObject, getStorage, ref } from "firebase/storage"

import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import { ModalCreateProject } from "@/components/modalCreateProject"
import { ModalProject } from "@/components/modalProject"

import useProjects from "./hooks/getProjectHooks"

interface ProjectProps extends React.HTMLAttributes<HTMLDivElement> {
  aspectRatio?: "portrait" | "square"
}

interface FormData {
  name: string
  description: string
  image: string
  imgName: string
}

export default function HomeProject({
  aspectRatio = "portrait",
}: ProjectProps) {
  const { data: getProject = [] } = useProjects()

  // const storage = getStorage();

  // Create a reference to the file to delete
  // const desertRef = ref(storage, `images/${data.imgName}`)

  // // Delete the file
  // deleteObject(desertRef)
  //   .then(() => {
  //     // File deleted successfully
  //   })
  //   .catch((error) => {
  //     // Uh-oh, an error occurred!
  //   })

  async function deleteProject(data: FormData, i:number) {
    const storage = getStorage()
    try {
      console.log("dataform", getProject)
      console.log("ngetes bro", getProject[i].imgName)
      const desertRef = ref(storage, `image/${getProject[i].imgName}`)
      fetch(`http://localhost:3000/api/project/${data}`, {
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
        method: "DELETE",
      })
      // Create a reference to the file to delete

      // Delete the file
      deleteObject(desertRef)
        .then(() => {
          console.log("data deleted")
          // File deleted successfully
        })
        .catch((error) => {
          // Uh-oh, an error occurred!
        })
        // .then(() => {
        //   // 
        // })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <div>
        {/* {ModalCreateProject()} */}
        <div className="grid grid-cols-5 gap-20">
          {/* {renderProject()} */}
          {getProject.map((project:any,i:number) => (
            <div key={project.id}>
              <div className="overflow-hidden rounded-md">
                <Image
                  src={project?.image}
                  alt={`project ${project.name}`}
                  width={300}
                  height={300}
                  className={cn(
                    "h-auto w-auto object-cover transition-all hover:scale-105",
                    aspectRatio === "portrait"
                      ? "aspect-[3/4]"
                      : "aspect-square"
                  )}
                />
              </div>
              <p>Project Name: {project.name}</p>
              <ModalProject project={project} />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">Show Dialog</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteProject(project.id,i)}
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <div
                key={project.id}
                style={{ border: "1px solid #ccc", textAlign: "center" }}
              >
                {/* <p>Project Id: {project.id}</p>
                <p>Project Description: {project.description}</p>
                <p>Project Maps: {project.maps}</p> */}
                {/* <ModalProject project={project} />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline">Show Dialog</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteProject(project.id)}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog> */}
              </div>
            </div>
          ))}
          {ModalCreateProject(getProject)}
        </div>
      </div>
    </>
  )
}
