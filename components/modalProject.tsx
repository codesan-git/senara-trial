"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Project } from "@prisma/client"

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
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

import { ToastDemo } from "./toast"
import { Textarea } from "./ui/textarea"
import { Toast } from "./ui/toast"
import useProjects from "@/app/hooks/getProjectHooks"

interface ProjectData {
  project: Project
}

interface FormData {
  name: string
  description: string
}

export function ModalProject({ project }: ProjectData) {
  const { toast } = useToast()

  const [form, setForm] = useState<FormData>({
    name: project.name,
    description: project.description,
  })
  
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  async function update(data: FormData) {
    try {
      console.log("dataform", data)
      fetch(`http://localhost:3000/api/project/${project.id}`, {
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
      }).then(() => {
        setForm({ name: form?.name, description: form?.description })
      })
    } catch (error) {
      console.log(error)
    }
  }
  
  const handleSubmit = async (data: FormData) => {
    try {
      update(data)
    } catch (error) {
      //console.log(error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you`re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              placeholder={project.name}
              value={form?.name}
              className="col-span-3"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Description
            </Label>
            <Textarea
              id="username"
              placeholder={project.description}
              value={form?.description}
              className="col-span-3"
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>
        </div>
        <DialogFooter>
            <Button
              type="submit"
              onClick={(e) => {
                e.preventDefault()
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
          {/* <Toast /> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
