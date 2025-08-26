import { Badge } from '@/components/ui/badge'

const faculty = [
  {
    name: 'Dr. Rajesh Kumar',
    designation: 'Former IAS Officer',
    specialization: 'Public Administration & Ethics',
    experience: '15+ years',
    image: '/placeholder.svg?height=300&width=300&text=Dr.+Rajesh+Kumar',
    achievements: ['IAS Rank 12', 'Former District Collector', 'UPSC Interview Expert']
  },
  {
    name: 'Prof. Meera Sharma',
    designation: 'History Expert',
    specialization: 'Ancient & Medieval History',
    experience: '12+ years',
    image: '/placeholder.svg?height=300&width=300&text=Prof.+Meera+Sharma',
    achievements: ['PhD in History', 'Author of 5 books', 'NCERT Consultant']
  },
  {
    name: 'Mr. Anil Gupta',
    designation: 'Economics Faculty',
    specialization: 'Indian Economy & Current Affairs',
    experience: '10+ years',
    image: '/placeholder.svg?height=300&width=300&text=Mr.+Anil+Gupta',
    achievements: ['MA Economics', 'RBI Grade B Officer', 'Economic Survey Expert']
  },
  {
    name: 'Dr. Priya Singh',
    designation: 'Science & Technology Expert',
    specialization: 'General Science & Environment',
    experience: '8+ years',
    image: '/placeholder.svg?height=300&width=300&text=Dr.+Priya+Singh',
    achievements: ['PhD in Environmental Science', 'ISRO Scientist', 'Research Publications']
  }
]

export function FacultySection() {
  return (
    <section id="faculty" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Meet Our Expert Faculty
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn from the best minds in the industry - IAS officers, subject experts, and top-ranked professionals 
            who have guided thousands of students to success.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {faculty.map((member, index) => (
            <div key={index} className="bg-primary-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="mb-4">
                <img 
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-primary-200"
                />
                <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-primary-600 font-medium mb-2">{member.designation}</p>
                <Badge variant="secondary" className="mb-3">{member.experience}</Badge>
              </div>
              
              <div className="space-y-2 mb-4">
                <p className="text-sm font-medium text-gray-700">Specialization:</p>
                <p className="text-sm text-gray-600">{member.specialization}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Key Achievements:</p>
                <div className="space-y-1">
                  {member.achievements.map((achievement, idx) => (
                    <p key={idx} className="text-xs text-gray-600">• {achievement}</p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
