import React, { useEffect, useState } from "react";
import PostContent from "./profileContent/PostContent";
import { Card, CardContent } from "@/components/ui/card";
import {
  Briefcase,
  Cake,
  GraduationCap,
  Heart,
  Home,
  Mail,
  MapPin,
  Phone,
  Rss,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import MutualFriends from "./profileContent/MutualFriends";
import EditBio from "./profileContent/EditBio";
import { formatDateInDDMMYYY } from "@/lib/utils";

const ProfileDetails = ({
  activeTab,
  id,
  profileData,
  isOwner,
  fetchProfile,
}) => {
  const [isEditBioModel, setIsEditBioModel] = useState(false);
  const [likePosts, setLikePosts] = useState(new Set());
  const userPosts = [
    {
      _id: 1,
      content: "Petals of perfection 🌸",
      mediaUrl: "https://images.pexels.com/photos/25820097/pexels-photo-25820097/free-photo-of-colorful-flowers-at-florists.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      mediaType: "image",
      user: {
        username: "Rashme Akther",
        profilePicture: "https://example.com/profile1.jpg"
      },
      createdAt: "2024-05-05T10:00:00Z",
      comments: [
        {
          text: "Nice Picture",
          userName: "Pritha Saha",
        }
        
      ],
      likes: 5,
      shares:7,
    },
    {
      _id: 2,
      content: "🌅🌇🌙",
      mediaUrl: "https://cdn.pixabay.com/video/2022/03/18/111204-689949818_tiny.mp4",
      mediaType: "video",
      user: {
        username: "Pritha Saha",
        profilePicture: "https://example.com/profile5.jpg"
      },
      createdAt: "2025-01-01T08:45:00Z",
      comments: [
        {
          text: "OMG",
          userName: "Rashme Akther",
        },
        {text: "Nice video",
          userName: "Muntaha Alam",
        }
      ],
      likes: 8,
      shares:5,
    },
    {
      _id: 3,
      content: "The stars are out to play tonight 🌠",
      mediaUrl: "https://images.pexels.com/photos/355465/pexels-photo-355465.jpeg?auto=compress&cs=tinysrgb&w=600",
      mediaType: "image",
      user: {
        username: "Walisa Alam",
        profilePicture: "https://example.com/profile2.jpg"
      },
      createdAt: "2024-12-11T18:00:00Z",
      comments: [
        {
          text: "WOW",
          userName: "Habiba Akther",
        },
        {
          text: "Nice Picture",
          userName: "Pritha Saha",
        }
      ],
      likes: 7,
      shares:2,
    },
    {
      _id: 4,
      content: "Happiness is homemade 🎂",
      mediaUrl: "https://images.pexels.com/photos/1639564/pexels-photo-1639564.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      mediaType: "image",
      user: {
        username: "Nusrat Tazin",
        profilePicture: "https://example.com/profile3.jpg"
      },
      createdAt: "2024-11-26T14:30:00Z",
      comments: [
        {
          text: "Nice & Attractive",
          userName: "RAISA Afa",
        },
        {
          text: "Nice Picture",
          userName: "Pritha Saha",
        },
        {
          text: "Nice Picture",
          userName: "Pritha Saha",
        }
      ],
      likes: 3,
      shares:2,
    },
    {
      _id: 5,
      content: "Amazing travel moments ✈️",
      mediaUrl: "https://media.istockphoto.com/id/1753779792/video/aerial-drone-shot-of-morning-mist-over-tranquil-farmland-with-single-big-tree-under-orange.mp4?s=mp4-640x640-is&k=20&c=Vnku2vtoVM61shIsqaYyXX2s-slAC39mWZ4Vzz4dOaM=",
      mediaType: "video",
      user: {
        username: "Nazifa",
        profilePicture: "https://example.com/profile4.jpg"
      },
      createdAt: "2024-09-20T09:15:00Z",
      comments: [
        {
          text: "Nice video",
          userName: "Muntaha Alam",
        }
      ],
      likes: 1,
      shares:9,
    },
    
  ];
  const tabContent = {
    posts: (
      <div className="flex flex-col lg:flex-row gap-6 ">
        <div className="w-full lg:w-[70%] space-y-6 mb-4">
          {userPosts?.map((post) => (
            <PostContent
              key={post._id}
              post={post}/>
              
          ))}
        </div>
        <div className="w-full lg:w-[30%]">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 dark:text-gray-300">
                Intro
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                This is Rashme
              </p>
              <div className="space-y-2 mb-4 dark:text-gray-300">
                <div className="flex items-center">
                  <Home className="w-5 h-5 mr-2" />
                  <span> Live in Chittagong</span>
                </div>
                <div className="flex items-center">
                  <Heart className="w-5 h-5 mr-2" />
                  <span>Single</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span> From Chittagong</span>
                </div>
                <div className="flex items-center">
                  <Briefcase className="w-5 h-5 mr-2" />
                  <span>Work at Home </span>
                </div>
                <div className="flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  <span>UnderGraduate </span>
                </div>
              </div>
              <div className="flex items-center mb-4 dark:text-gray-300">
                <Rss className="w-5 h-5 mr-2" />
                <span>Followed by 90 people</span>
              </div>
                <Button
                  className="w-full "
                  onClick={() => setIsEditBioModel(true)}
                >
                  Edit Bio
                </Button>
              
            </CardContent>
          </Card>
        </div>
      </div>
    ),
    about: (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-4"
      >
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 dark:text-gray-300">
              About{" "} Rashme Akther
            </h2>
            <div className="space-y-2 mb-4 dark:text-gray-300">
                <div className="flex items-center">
                  <Home className="w-5 h-5 mr-2" />
                  <span> Live in Chittagong</span>
                </div>
                <div className="flex items-center">
                  <Heart className="w-5 h-5 mr-2" />
                  <span>Single</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span> From Chittagong</span>
                </div>
                <div className="flex items-center">
                  <Briefcase className="w-5 h-5 mr-2" />
                  <span>Work at Home </span>
                </div>
                <div className="flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  <span>UnderGraduate </span>
                </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                <span>01752093284</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                <span>aktherrashme22@gmail.com</span>
              </div>
              <div className="flex items-center">
                <Cake className="w-5 h-5 mr-2" />
                <span>Birthday:26 Nov,2002</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    ),
    friends: (<MutualFriends/>),
    photos: (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-4"
      >
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 dark:text-gray-300">
              Photos
            </h2>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {userPosts
                ?.filter(
                  (post) => post?.mediaType === "image" && post?.mediaUrl
                )
                .map((post) => (
                  <img
                    key={post?._id}
                    src={post?.mediaUrl}
                    alt="user_all_photos"
                    className="w-[200px] h-[150px] object-cover rounded-lg"
                  />
                ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    ),
  };
  return (
    <div>
      {tabContent[activeTab] || null}
      <EditBio
        isOpen={isEditBioModel}
        onClose={() => setIsEditBioModel(false)}
        
      ></EditBio>
    </div>
  );
};

export default ProfileDetails;
