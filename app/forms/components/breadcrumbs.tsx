"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Breadcrumbs() {
  let currentLink = ""
  const pathname = usePathname()
  const crumbs = pathname
    .split("/")
    .filter((crumb) => crumb !== "")
    .map((crumb) => {
      currentLink += `/${crumb}`

      return (
        <div className="mx-auto my-5 ml-3 inline-block max-w-6xl text-slate-200 after:content-['>'] first:ml-0 last:after:content-none" key={crumb}>
          <Link href={currentLink} className="mr-3 hover:underline">{crumb}</Link>
        </div>
      )
    })
  return <div>{crumbs}</div>
}
