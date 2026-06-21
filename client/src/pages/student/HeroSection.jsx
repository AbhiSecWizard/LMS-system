import { Input } from "@/components/ui/input"
import { Button } from "@base-ui/react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const HeroSection = () => {
    const [searchQuery, setSearchQuery] = useState("")
    const navigate = useNavigate()
    const searchHandler = (e)=>{
        e.preventDefault()
    // alert("you are searching")
    if(searchQuery.trim() !== "")
        navigate(`/course/search?query=${searchQuery}`)
    setSearchQuery("")
    }
  return (
    <div className=" md:px-94 relative bg-gradient-to-r from-blue-500 bg-indigo-600 dark:from-gray-800 dark:to-gray-900 py-16 px-4 text-center">
<div className='max-w-3xl mx-auto '>
    <h1 className='text-white text-4xl font-bold mb-4'>Find the Best Courses For You</h1>
    <p className='text-white dark:text-gray-600 my-4'>
        Discover, Learn, and Upskill with our wide range of courses
    </p>
</div>
    <form onSubmit={searchHandler} className="flex">
        <Input 
        value={searchQuery}
        onChange={(e)=>setSearchQuery(e.target.value)}
        type="text"
        placeholder="Search Courses"
        className="focus-visible:ring-0 border-none bg-white py-3 text-black  shadow-xl pl-5 capitalize rounded-l-full "
        />
        <Button type="submit" className="bg-blue-600 dark:bg-gray-700 text-white text-whtie px-5 cursor-pointer rounded-r-full hover:bg-blue-900 dark:hover:bg-blue-800"> Search</Button>
    </form>
    <Button onClick={()=>navigate("/course/search?query=")}className="bg-white dark:bg-gray-800 text-blue-600 rounded-full px-6 mt-3 cursor-pointer py-2 hover:bg-gray-200">
        Explore Course
    </Button>
    </div>
  )
}

export default HeroSection
