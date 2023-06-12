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
import useTheme from "@/app/hooks/forms/theme/getThemeHooks"
import { ModalCreateTheme } from "../components/theme/modalCreateTheme"
import { ModalTheme } from "../components/theme/modalTheme"
// import { ModalTheme } from "../components/modalTheme"

// import { ModalTheme } from "../components/modalTheme"
// import { ModalCreateTheme } from "@/forms/components/modalCreateTheme"

interface FormData {
  themeId: string
  name: string
  color: string
}

export default function TableTheme() {
  const { data: getTheme = [] } = useTheme()

  async function deleteTheme(data: FormData, i: number) {
    fetch(`http://localhost:3000/api/theme/${getTheme[i].id}`, {
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
      method: "DELETE",
    })
  }

  return (
    <>
      <ModalCreateTheme
        themeId={""}
        name={""}
        color={""}
      />
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">No</TableHead>
            <TableHead className="text-center">ID</TableHead>
            <TableHead className="text-center">Name</TableHead>
            <TableHead className="text-center">Color</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {getTheme.map((theme: any, i: number) => (
            <TableRow key={theme.id}>
              <TableCell className="font-medium">{theme.id}</TableCell>
              <TableCell className="text-center">{theme.themeId}</TableCell>
              <TableCell className="text-center">{theme.name}</TableCell>
              <TableCell className="text-center" style={{backgroundColor:`${theme.color}`}}>{theme.color}</TableCell>
              <TableCell className="flex justify-center gap-4">
                <ModalTheme theme={{
                  id: theme.id,
                  themeId: theme.themeId,
                  name: theme.name,
                  color: theme.color
                }} />
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
                        onClick={() => deleteTheme(theme.id, i)}
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
