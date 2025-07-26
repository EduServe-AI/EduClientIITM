import {ProgramLevelId} from "../types/types"


export interface ProgramLevel {
    name : ProgramLevelId ;
    title : String ;
    description : String ;
    prerequisites? : ProgramLevelId[];
    totalSubjects : number ;
    totalProjects? : number ; 
}

export const PROGRAM_LEVELS : ProgramLevel[] = [
    {
        name : "foundation",
        title : "Foundation",
        description : "Build strong fundamentals in mathematics, statistics, and programming essentials",
        totalSubjects : 8
    } , 
    {
        name : "diploma", 
        title : "Diploma",
        description : "Core Data Science concepts and Programming skills",
        totalSubjects : 12,
        totalProjects : 4,
        prerequisites : ["foundation"]
    },
    {
        name : "bsc",
        title : "BSc" , 
        description : "Advanced data science and Programming skills",
        totalSubjects : 7,
        prerequisites : ["foundation","diploma"]
    },
    {
        name : "bs", 
        title : "BS",
        description : "Specialized research, advanced AI/ML, and industry capstone projects",
        totalSubjects : 7,
        prerequisites : ["foundation","diploma","bsc"] 
    }

]
