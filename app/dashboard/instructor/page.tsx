// pages/instructor-dashboard.js
export default function InstructorDashboard() {
  const subjects = [
    { name: 'Mathematics', students: 25 },
    { name: 'Physics', students: 18 },
    { name: 'Computer Science', students: 30 },
    { name: 'English Literature', students: 22 },
  ]

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Instructor Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {subjects.map((subject, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow cursor-pointer"
          >
            <h2 className="text-xl font-semibold mb-2">{subject.name}</h2>
            <p className="text-gray-600">
              Students Enrolled: {subject.students}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
