"use client"

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
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ModalCreateProject } from "@/components/modalCreateProject"
import { ModalProject } from "@/components/modalProject"
import useComponent from "@/app/hooks/getComponentHooks"

import { ModalComponent } from "../components/component/modalComponent"
import { ModalCreateComponent } from "../components/component/modalCreateComponent"

interface FormData {
  componentId: string
  name: string
  image: string
  price: number
  imgName: string
}

export default function TableComponent() {
  const { data: getComponent = [] } = useComponent()

  async function deleteComponent(data: FormData, i: number) {
    const storage = getStorage()
    try {
      console.log("dataform", getComponent)
      console.log("ngetes bro", getComponent[i].imgName)
      const desertRef = ref(storage, `image/component/${getComponent[i].imgName}`)
      console.log('ref', desertRef)
      fetch(`http://localhost:3000/api/component/${getComponent[i].id}`, {
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
      <ModalCreateComponent
        componentId={""}
        name={""}
        image={""}
        price={0}
        imgName={null}
      />
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Id</TableHead>
            <TableHead className="text-center">Name</TableHead>
            <TableHead className="text-center">Image</TableHead>
            <TableHead className="text-center">Price</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {getComponent.map((component: any, i: number) => (
            <TableRow key={component.id}>
              <TableCell className="font-medium">
                {component.componentId}
              </TableCell>
              <TableCell className="text-center">{component.name}</TableCell>
              <TableCell className="text-center"><a href={component.image} >{component.imgName}</a></TableCell>
              <TableCell className="text-center">
                Rp. {component.price}
              </TableCell>
              <TableCell className="flex justify-center gap-4">
                <ModalComponent
                  component={{
                    id: component?.id,
                    componentId: component?.componentId,
                    name: component?.name,
                    price: component?.price,
                    image: component?.image,
                    imgName: component?.imgName,
                  }}
                />
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
                        onClick={() => deleteComponent(component.id, i)}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
