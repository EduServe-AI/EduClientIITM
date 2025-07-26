import { PROGRAM_LEVELS } from "@/constants/levels";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Book, ScrollText, Trophy } from 'lucide-react';
import { motion } from "framer-motion"
import { ProgramLevelId } from "@/types/types"

interface LevelSelectorProps {
    selectedLevel : string | null;
    setSelectedLevel : (value : ProgramLevelId) => void;
    handleLevelClick : () => void; 
}

// color and icon for each level
export const getLevelProperties = (level : ProgramLevelId) => {
    switch (level) {
        case "foundation":
            return {
                color: "bg-violet-100 hover:bg-violet-200 border-violet-300",
                hover : " hover:bg-violet-200",
                selectedColor: "border-violet-500",
                icon: <Book className="w-6 h-6 text-violet-700" />,
            }
        case "diploma":
            return {
                color: "bg-sky-100 hover:bg-sky-200 border-sky-300",
                hover : " hover:bg-sky-200",
                selectedColor: "border-sky-500",
                icon: <ScrollText className="w-6 h-6 text-sky-700" />,
            }
        case "bsc":
            return {
                color: "bg-emerald-100 hover:bg-emerald-200 border-emerald-300",
                hover : " hover:bg-emerald-200",
                selectedColor: "border-emerald-500",
                icon: <GraduationCap className="w-6 h-6 text-emerald-700" />,
            }
        case "bs":
            return {
               color: "bg-amber-100 hover:bg-amber-200 border-amber-300",
               hover : " hover:bg-amber-200",
               selectedColor: "border-amber-500",
               icon: <Trophy className="w-6 h-6 text-amber-700" />,
            }   
        default:
            return {
                color: "bg-gray-100 hover:bg-gray-200 border-gray-300",
                hover : " hover:bg-gray-200",
                selectedColor: "border-gray-500",
                icon: null, 
            };             
    }
}

export default function LevelSelector({selectedLevel , setSelectedLevel , handleLevelClick}: LevelSelectorProps){

    return (

        <div className="max-w-4xl mx-auto p-8">

            <h2 className="text-2xl font-semibold text-center mb-8 text-gray-800">
                Select Your Level in Programme
            </h2> 

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {PROGRAM_LEVELS.map((level , index) => {

                const properties = getLevelProperties(level.name as ProgramLevelId);
                const isSelected = selectedLevel === level.name;

                return (
                <motion.div
                 key={level.name}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: index * 0.1 }}
                >
                    <Card
                     className={`
                        ${properties.color}
                        ${isSelected ? `border-2 ${properties.selectedColor}` : 'border'}
                        min-h-[220px] p-6 cursor-pointer transition-all duration-300 transform hover:scale-105
                        flex flex-col items-center text-center justify-between rounded-xl
                     `}
                     onClick={() => setSelectedLevel(level.name)}
                    >  
                        
                        <div className="mb-4">{properties.icon}</div>
                        <h3 className="text-xl font-medium mb-2">{level.title}</h3>
                        <p className="text-sm text-gray-600">{level.description}</p>

                    </Card>

                </motion.div>
               )
              }
              )}
            </div>

           <div className="flex flex-row justify-end mt-6">

            <Button
             variant="outline"
             color=""
             className="bg-gray-700 hover:bg-gray-900 hover:cursor-pointer text-white hover:text-white w-20"
             onClick={handleLevelClick}
             disabled={!selectedLevel}
            >
                Next
            </Button>

           </div>

        </div>

    )
}