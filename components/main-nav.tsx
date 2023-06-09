import * as React from "react"
// import Link from "next/link"
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { NavLink } from "react-router-dom"

import { NavItem } from "@/types/nav"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import "@/app/style.css";
import Breadcrumbs from "./breadcrumbs"

interface MainNavProps {
  items?: NavItem[]
}

function handleClick(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
  e.preventDefault();
  console.info('You clicked a breadcrumb.');
}





export function MainNav({ items }: MainNavProps) {
  return (
    <div className="flex gap-6 md:gap-10">
      <NavLink to="/" className="hidden items-center space-x-2 md:flex">
        <Icons.logo className="h-6 w-6" />
        <span className="hidden font-bold sm:inline-block">
          {siteConfig.name}
        </span>
      </NavLink>
      {items?.length ? (
        <nav className="hidden gap-6 md:flex">
          {items?.map(
            (item, index) =>
              item.href && (
                <NavLink
                  key={index}
                  to={item.href}
                  className={cn(
                    "flex items-center text-lg font-semibold text-muted-foreground sm:text-sm",
                    item.disabled && "cursor-not-allowed opacity-80"
                  )}
                >
                  {item.title}
                </NavLink>
              )
          )}
        </nav>
      ) : null}
      <Breadcrumbs />
    </div>
  )
}
