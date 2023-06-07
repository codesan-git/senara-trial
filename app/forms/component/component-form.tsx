'use client'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

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
import { ModalCreateProject } from "@/components/modalCreateProject"
import { ModalProject } from "@/components/modalProject"
import useComponent from "@/app/hooks/getComponentHooks"

interface FormData {
  componentId: string
  name: string
  image: string
  price: number
  imgName: string
}

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
]

export default function TableComponent() {
  const {data: getComponent = [] } = useComponent()

  async function deleteProject(data: FormData, i:number) {
    const storage = getStorage()
    try {
      console.log("dataform", getComponent)
      console.log("ngetes bro", getComponent[i].imgName)
      const desertRef = ref(storage, `image/${getComponent[i].image}`)
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
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Id</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Image</TableHead>
          <TableHead className="text-right">Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {getComponent.map((component:any,i:number) => (
          <TableRow key={component.id}>
            <TableCell className="font-medium">{component.componentId}</TableCell>
            <TableCell>{component.name}</TableCell>
            <TableCell>{component.imgName}</TableCell>
            <TableCell className="text-right">Rp. {component.price}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
