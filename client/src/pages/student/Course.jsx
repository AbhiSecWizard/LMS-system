import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const Course = () => {
  return (
    <Card className=" bg-red-700 rounded-sm mb-5 p-0 overflow-hidden shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
      
      {/* Image */}
      <img
        className="w-full h-36 object-cover rounded-t-xl"
        src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/ai-%26-machine-learning-course-design-template-a39c8ce857bc7b684e5bc6b6b3debddc_screen.jpg?ts=1732479662"
        alt="course"
      />

      {/* Content */}
      <CardContent className="p-4">
        <h1 className="hover:underline text-xl font-bold truncate">
          Nextjs Complete course in hindi
        </h1>

        <div className="flex items-center gap-3 mt-3">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>AK</AvatarFallback>
          </Avatar>

          <h2 className="font-bold">Abhishek Yadav</h2>
          <Button className="rounded-2xl">Beginner</Button>
        </div>

        <span className="font-bold text-2xl mt-6 block">₹161</span>
      </CardContent>
    </Card>
  )
}

export default Course

// CourseSkeleton.jsx
import { Skeleton } from "@/components/ui/skeleton"

export const CourseSkeleton = () => {
  return (
    <div className="rounded-xl overflow-hidden shadow-lg">
      {/* Image */}
      <Skeleton className="w-full h-36" />

      <div className="p-4 space-y-4">
        {/* Title */}
        <Skeleton className="h-6 w-3/4" />

        {/* Instructor row */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>

        {/* Price */}
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  )
}


