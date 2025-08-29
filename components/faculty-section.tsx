import { Award, BookOpen } from "lucide-react"

const faculty = [
  {
    name: "Dr. Rajesh Kumar",
    designation: "UPSC Expert & Former IAS Officer",
    experience: "15+ Years",
    image: "/placeholder.svg?height=200&width=200&text=Dr.Rajesh",
    specialization: "Public Administration, Ethics",
    achievements: ["IAS Rank 12", "500+ Students Mentored", "Author of 3 Books"],
  },
  {
    name: "Prof. Meera Sharma",
    designation: "History & Current Affairs Specialist",
    experience: "12+ Years",
    image: "/placeholder.svg?height=200&width=200&text=Prof.Meera",
    specialization: "Ancient & Modern History",
    achievements: ["PhD in History", "300+ Selections", "TV Panelist"],
  },
  {
    name: "Mr. Amit Verma",
    designation: "Mathematics & Reasoning Expert",
    experience: "10+ Years",
    image: "/placeholder.svg?height=200&width=200&text=Mr.Amit",
    specialization: "Quantitative Aptitude, Logic",
    achievements: ["IIT Graduate", "95% Success Rate", "Online Course Creator"],
  },
]

export function FacultySection() {
  return (
    <section id="faculty" className="bg-sky-50 py-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-sky-50">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 mt-0 py-0">Meet Our Expert Faculty</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn from experienced educators and successful civil servants who have guided thousands to success.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {faculty.map((member, index) => (
            <div key={index} className="rounded-2xl p-6 text-center hover:shadow-lg transition-shadow bg-blue-100">
              <div className="mb-6">
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-cyan-800 font-medium mb-2">{member.designation}</p>
                <p className="text-gray-600 text-sm">{member.specialization}</p>
              </div>

              <div className="space-y-3 mb-6">
                {member.achievements.map((achievement, achievementIndex) => (
                  <div key={achievementIndex} className="flex items-center justify-center text-sm text-gray-600">
                    <Award className="h-4 w-4 mr-2 text-cyan-800" />
                    {achievement}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center text-sm text-gray-600">
                <BookOpen className="h-4 w-4 mr-2" />
                {member.experience} Teaching Experience
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
