"use client";
import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
//rashme
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Search,
  Home,
  Video,
  Users,
  Menu,
  Bell,
  MessageCircle,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import Image from "next/image";
import useSidebarStore from "../../store/sidebarStore";
import { useRouter } from "next/navigation";
import userStore from "../../store/userStore";
import { toast } from "react-toastify";
import { logout } from "../../service/auth.service";


import Loader from "@/lib/Loader";
import { getAllUsers } from "../../service/user.service";
const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery,setSearchQuery] = useState("");
  const [userList,setUserList] = useState([])
  const [filterUsers,setFilterUsers] = useState([])
  const [loading,setLoading] = useState(false);
  const [activeTab,setActiveTab] = useState("home");
  const searchRef = useRef(null)
  const { theme, setTheme } = useTheme();
  const { toggleSidebar } = useSidebarStore();
  const router = useRouter();
  const { user, clearUser } = userStore();
  

  const userPlaceholder = user?.username
    ?.split(" ")
    .map((name) => name[0])
    .join("");

  console.log(user);

  const handleNavigation = (path) => {
    router.push(path);
  };
  const handleLogout = async () => {
    try {
      const result = await logout();
      if (result?.status == "success") {
        router.push("/user-login");
        clearUser();
      }
      toast.success("user logged out successfully");
    } catch (error) {
      console.log(error);
      toast.error("failed to log out");
    }
  };

  // useEffect(() => {
  //   setMounted(true);
  // }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const result = await getAllUsers(); // Assume `getAllUsers` fetches users
        setUserList(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []); // Correct order: Only fetch once on mount

  useEffect(() => {
    const fetchFilteredUsers = async () => {
      if (searchQuery.trim()) {
        setLoading(true);
        try {
          const result = await getAllUsers(searchQuery); // Fetch filtered users from API
          setFilterUsers(result);
          setIsSearchOpen(result.length > 0);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      } else {
        setFilterUsers([]);
        setIsSearchOpen(false);
      }
    };
  
    fetchFilteredUsers();
  }, [searchQuery]);
  


  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setIsSearchOpen(false);
  };

  const handleUserClick = async (userId) => {
    try {
      setLoading(true);
      setIsSearchOpen(false);
      setSearchQuery("");
      await router.push(`user-profile/${userId}`);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchClose = (e) => {
    if (!searchRef.current?.contains(e.target)) {
      setIsSearchOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleSearchClose);
    return () => {
      document.removeEventListener("click", handleSearchClose);
    };
  }, []); // Fixed to ensure consistent order of hooks

  // if (!mounted) return null;
  if (loading) {
    return <Loader />
  }

  return (
    <header className="bg-white dark:bg-[rgb(36,37,38)] text-foreground shadow-md h-20 fixed top-0 left-0 right-0 z-50 p-2">
      <div className="mx-auto flex justify-between items-center p-2">
        <div className="flex items-center gap-2 md:gap-4">
          <Image
            src="/Images/Clogo.png"
            width={60}
            height={60}
            alt="cuetbook-logo"
          />
          <div className="relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  className="pl-8 w-40 md:w-64 h-10 bg-gray-100 dark:bg-[rgb(58,59,60)] rounded-full"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchOpen(true)}
                />
              </div>
              {isSearchOpen && (
                <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg mt-1 z-50">
                  <div className="p-2">
                    {filterUsers.length > 0 ? (
                      filterUsers.map((user) => (<div className="flex items-center space-x-8 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer"
                        key={user._id}
                        onClick={() => handleUserClick(user?._id)}
                      >

                        <Search className="absolute text-sm  text-gray-400 " />
                        <div className="flex items-center gap-2"
                        >
                          <Avatar className="h-8 w-8">
                            {user?.profilePicture ? (
                              <AvatarImage
                                src={user?.profilePicture}
                                alt={user?.username}
                              />
                            ) : (
                              <AvatarFallback>{userPlaceholder}</AvatarFallback>
                            )}
                          </Avatar>
                          <span>{user?.username}</span>
                        </div>
                      </div>))


                    ) : (
                      <>
                        <div className="p-2 text-gray-500">No User Found</div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
        <nav className="hidden md:flex justify-around w-[40%] max-w-md">
          {[
            { icon: Home, path: "/", name: "home" },
            { icon: Video, path: "/video-feed", name: "video" },
            { icon: Users, path: "/friends-list", name: "friends" },
          ].map(({ icon: Icon, path, name }) => (
            <Button
              key={name}
              variant="ghost"
              size="icon"
              className="relative text-gray-600 dark:text-gray-400 hover:text-blue-600 hover:bg-transparent" onClick={() => handleNavigation(path)}
            >
              <Icon />
            </Button>
          ))}
        </nav>
        <div className="flex space-x-2 md:space-x-4 items-center">
          <Button variant="ghost" size="icon" className="md:hidden text-gray-600 cursor-pointer"
            onClick={toggleSidebar}>
            <Menu />
          </Button>
          <Button variant="ghost" size="icon" className="hidden md:block text-gray-600 pl-2">
            <Bell />
          </Button>
          <Button variant="ghost" size="icon" className="hidden md:block text-gray-600 pl-2">
            <MessageCircle />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                 <Avatar className="h-8 w-8 mr-2">
                  {user?.profilePicture ? (
                    <AvatarImage
                      src={user?.profilePicture}
                      alt={user?.username}
                    />
                  ) : (
                    <AvatarFallback className="dark:bg-gray-400">
                      {userPlaceholder}
                    </AvatarFallback>
                  )}
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 z-50" align="end">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center ">
                    <Avatar className="h-8 w-8 mr-2">
                      {user?.profilePicture ? (
                        <AvatarImage
                          src={user?.profilePicture}
                          alt={user?.username}
                        />
                      ) : (
                        <AvatarFallback className="dark:bg-gray-400">
                          {userPlaceholder}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div >
                      <p className="text-sm font-medium leading-none">
                        {user?.username}
                      </p>
                      <p className="text-xs mt-2 text-gray-600 leading-none">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <MessageCircle className="mr-2" />
                <span>Messages</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Home className="mr-2" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="cursor-pointer"
              >
                {theme === "light" ? (
                  <>
                    <Moon className="mr-2" />
                    <span>Dark Mode</span>
                  </>
                ) : (
                  <>
                    <Sun className="mr-2" />
                    <span>Light Mode</span>
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer"  onClick={handleLogout}>
                <LogOut className="mr-2" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </div>
    </header>
  );
};

export default Header;
