'use client'
import MeetCard from '@/components/meetCard'
import { Button } from '@/components/ui/button'
import { getSessionsQueryFn } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

export default function Sessions() {
  const [currentTab, setCurrentTab] = useState('Upcoming')

  const {
    data: sessions = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['sessions'],
    queryFn: getSessionsQueryFn,
  })

  console.log('userSessions', sessions)

  const Tabs = ['Upcoming', 'Completed', 'Cancelled']

  // Filter sessions based on current tab
  const filteredSessions = sessions.filter(session => {
    const now = new Date()
    const sessionEndTime = new Date(session.end_time)

    if (currentTab === 'Upcoming') {
      return session.status === 'scheduled' && sessionEndTime >= now
    } else if (currentTab === 'Completed') {
      return session.status === 'completed'
    } else if (currentTab === 'Cancelled') {
      return session.status === 'cancelled'
    }
    return false
  })

  return (
    <div className="flex flex-col gap-5 p-4 sm:p-7 max-w-7xl ml-5 h-full">
      {/* Top Heading - session */}

      <div className="pb-4 border-b border-border">
        <h3 className="text-lg leading-6 font-medium text-foreground">
          My Sessions
        </h3>
        <p className="mt-2 max-w-4xl text-sm text-muted-foreground">
          Workcation is a property rental website. Etiam ullamcorper massa
          viverra consequat, consectetur id nulla tempus. Fringilla egestas
          justo massa purus sagittis malesuada.
        </p>
        {/* List of Tabs - Upcoming , Completed , Cancelled */}
        <div className="flex flex-col gap-4 mt-4">
          <div className="flex flex-row gap-1 flex-wrap bg-accent p-1 rounded-md">
            {Tabs.map(tab => (
              <Button
                key={tab}
                className={`text-foreground ${currentTab === tab ? 'text-white bg-primary hover:bg-primary hover:text-white' : 'text-foreground bg-transparent hover:bg-primary/20 hover:text-primary'} cursor-pointer`}
                onClick={() => setCurrentTab(tab)}
              >
                {tab}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Sessions List with Scroll Shadow */}
      <div className="flex flex-col gap-4 items-center sm:items-start w-full mt-4 overflow-y-auto flex-1 relative">
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground w-full">
            Loading sessions...
          </div>
        ) : isError ? (
          <div className="text-center py-8 text-red-500 w-full">
            Error loading sessions: {error?.message}
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground w-full">
            No {currentTab.toLowerCase()} sessions found
          </div>
        ) : (
          filteredSessions.map(session => (
            <MeetCard
              key={session.id}
              id={session.id}
              instructorId={session.instructorId}
              instructorName={session.instructor.username}
              title={session.title}
              startTime={new Date(session.start_time)}
              endTime={new Date(session.end_time)}
              status={session.status}
            />
          ))
        )}
      </div>
    </div>
  )
}
