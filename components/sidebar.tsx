import HomeContent from "@/app/homeContent"

export function Sidebar() {
  return (
    <>
      <link
        href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
        rel="stylesheet"
      />

      <div className="min-h-screen flex flex-col flex-auto flex-shrink-0 antialiased bg-gray-50 text-gray-800">
        <div className="fixed flex flex-col top-0 left-0 w-72 bg-white h-full border-r">
          <div className="flex items-center justify-center h-14 border-b">
            <div className="font-bold">Admin Panel</div>
          </div>
          <div className="overflow-y-auto overflow-x-hidden flex-grow">
            <ul className="flex flex-col py-4 space-y-1">
              <li className="px-5">
                <div className="flex flex-row items-center h-8">
                  <div className="text-sm font-light tracking-wide text-gray-500">
                    Menu
                  </div>
                </div>
              </li>

              <li>
                <a
                  href="#"
                  className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-red-400 pr-6"
                >
                  <span className="inline-flex justify-center items-center ml-4">
                    <i className="bx bx-home-alt-2"></i>
                  </span>
                  <span className="ml-2 text-sm tracking-wide truncate">
                    Dashboard
                  </span>
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-red-400 pr-6"
                >
                  <span className="inline-flex justify-center items-center ml-4">
                    <i className="bx bx-building-house"></i>
                  </span>
                  <span className="ml-2 text-sm tracking-wide truncate">
                    Housing
                  </span>
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-red-400 pr-6"
                >
                  <span className="inline-flex justify-center items-center ml-4">
                    <i className="bx bx-checkbox"></i>
                  </span>
                  <span className="ml-2 text-sm tracking-wide truncate">
                    Rooms
                  </span>
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-red-400 pr-6"
                >
                  <span className="inline-flex justify-center items-center ml-4">
                    <i className="bx bx-palette"></i>
                  </span>
                  <span className="ml-2 text-sm tracking-wide truncate">
                    Theme
                  </span>
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-red-400 pr-6"
                >
                  <span className="inline-flex justify-center items-center ml-4">
                    <i className="bx bx-receipt"></i>
                  </span>
                  <span className="ml-2 text-sm tracking-wide truncate">
                    Components
                  </span>
                </a>
              </li>

              <li className="px-5">
                <div className="flex flex-row items-center h-8">
                  <div className="text-sm font-light tracking-wide text-gray-500">
                    Extra
                  </div>
                </div>
              </li>

              <li>
                <a
                  href="#"
                  className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-red-400 pr-6"
                >
                  <span className="inline-flex justify-center items-center ml-4">
                    <i className="bx bx-bug-alt"></i>
                  </span>
                  <span className="ml-2 text-sm tracking-wide truncate">
                    Report
                  </span>
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-red-400 pr-6"
                >
                  <span className="inline-flex justify-center items-center ml-4">
                    <i className="bx bx-cog"></i>
                  </span>
                  <span className="ml-2 text-sm tracking-wide truncate">
                    Settings
                  </span>
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-red-400 pr-6"
                >
                  <span className="inline-flex justify-center items-center ml-4">
                    <i className="bx bx-log-in"></i>
                  </span>
                  <span className="ml-2 text-sm tracking-wide truncate">
                    Logout
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      {/* <HomeContent /> */}
      </div>
    </>
  )
}
