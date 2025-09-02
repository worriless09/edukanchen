'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Search, 
  Plus, 
  BookOpen, 
  Calendar, 
  Clock, 
  Edit3, 
  Trash2, 
  Star, 
  Download,
  Filter,
  Grid,
  List,
  Tag
} from 'lucide-react'

interface Note {
  id: string
  title: string
  content: string
  subject: string
  tags: string[]
  createdAt: string
  updatedAt: string
  isFavorite: boolean
  color: string
}

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('updated')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [loading, setLoading] = useState(true)

  // Form states
  const [noteForm, setNoteForm] = useState({
    title: '',
    content: '',
    subject: '',
    tags: '',
    color: '#3B82F6'
  })

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockNotes: Note[] = [
      {
        id: '1',
        title: 'Organic Chemistry - Reaction Mechanisms',
        content: 'Key points on SN1 and SN2 reactions:\n\n1. SN1 reactions are unimolecular...\n2. SN2 reactions are bimolecular...\n\nImportant factors affecting reaction rates...',
        subject: 'Chemistry',
        tags: ['Organic Chemistry', 'Reactions', 'Mechanisms'],
        createdAt: '2025-08-30T10:00:00Z',
        updatedAt: '2025-08-31T14:30:00Z',
        isFavorite: true,
        color: '#EF4444'
      },
      {
        id: '2',
        title: 'Calculus - Integration Techniques',
        content: 'Various methods of integration:\n\n1. Integration by parts\n2. Substitution method\n3. Partial fractions\n4. Trigonometric substitution\n\nRemember the LIATE rule for integration by parts...',
        subject: 'Mathematics',
        tags: ['Calculus', 'Integration', 'Techniques'],
        createdAt: '2025-08-29T15:30:00Z',
        updatedAt: '2025-08-30T09:15:00Z',
        isFavorite: false,
        color: '#10B981'
      },
      {
        id: '3',
        title: 'Physics - Wave Optics',
        content: 'Key concepts in wave optics:\n\n1. Interference of light\n2. Diffraction patterns\n3. Polarization\n4. Double slit experiment\n\nYoung\'s double slit experiment demonstrates...',
        subject: 'Physics',
        tags: ['Optics', 'Waves', 'Light'],
        createdAt: '2025-08-28T11:45:00Z',
        updatedAt: '2025-08-29T16:20:00Z',
        isFavorite: true,
        color: '#8B5CF6'
      },
      {
        id: '4',
        title: 'Biology - Cell Structure',
        content: 'Important cellular components:\n\n1. Nucleus - control center\n2. Mitochondria - powerhouse\n3. Ribosomes - protein synthesis\n4. Endoplasmic reticulum\n\nPlant vs Animal cells differences...',
        subject: 'Biology',
        tags: ['Cell Biology', 'Structure', 'Organelles'],
        createdAt: '2025-08-27T13:20:00Z',
        updatedAt: '2025-08-28T10:30:00Z',
        isFavorite: false,
        color: '#F59E0B'
      },
      {
        id: '5',
        title: 'History - Indian Independence Movement',
        content: 'Timeline of key events:\n\n1857 - First War of Independence\n1885 - Formation of Indian National Congress\n1905 - Partition of Bengal\n1920 - Non-cooperation Movement\n\nKey leaders and their contributions...',
        subject: 'History',
        tags: ['Indian History', 'Independence', 'Freedom Struggle'],
        createdAt: '2025-08-26T09:15:00Z',
        updatedAt: '2025-08-27T14:45:00Z',
        isFavorite: true,
        color: '#EC4899'
      }
    ]
    
    setTimeout(() => {
      setNotes(mockNotes)
      setFilteredNotes(mockNotes)
      setLoading(false)
    }, 1000)
  }, [])

  // Filter and search logic
  useEffect(() => {
    let filtered = notes

    // Subject filter
    if (selectedSubject !== 'all') {
      filtered = filtered.filter(note => note.subject === selectedSubject)
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(note => 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'updated') {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      } else if (sortBy === 'created') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title)
      } else if (sortBy === 'favorite') {
        return b.isFavorite ? 1 : -1
      }
      return 0
    })

    setFilteredNotes(filtered)
  }, [notes, selectedSubject, searchQuery, sortBy])

  const subjects = Array.from(new Set(notes.map(note => note.subject)))

  const handleCreateNote = () => {
    if (!noteForm.title || !noteForm.content) return

    const newNote: Note = {
      id: Date.now().toString(),
      title: noteForm.title,
      content: noteForm.content,
      subject: noteForm.subject || 'General',
      tags: noteForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFavorite: false,
      color: noteForm.color
    }

    setNotes([newNote, ...notes])
    setNoteForm({ title: '', content: '', subject: '', tags: '', color: '#3B82F6' })
    setIsCreateDialogOpen(false)
  }

  const handleEditNote = (note: Note) => {
    setEditingNote(note)
    setNoteForm({
      title: note.title,
      content: note.content,
      subject: note.subject,
      tags: note.tags.join(', '),
      color: note.color
    })
    setIsCreateDialogOpen(true)
  }

  const handleUpdateNote = () => {
    if (!editingNote || !noteForm.title || !noteForm.content) return

    const updatedNote: Note = {
      ...editingNote,
      title: noteForm.title,
      content: noteForm.content,
      subject: noteForm.subject || 'General',
      tags: noteForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      updatedAt: new Date().toISOString(),
      color: noteForm.color
    }

    setNotes(notes.map(note => note.id === editingNote.id ? updatedNote : note))
    setEditingNote(null)
    setNoteForm({ title: '', content: '', subject: '', tags: '', color: '#3B82F6' })
    setIsCreateDialogOpen(false)
  }

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter(note => note.id !== noteId))
  }

  const toggleFavorite = (noteId: string) => {
    setNotes(notes.map(note => 
      note.id === noteId ? { ...note, isFavorite: !note.isFavorite } : note
    ))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Notes</h1>
            <p className="text-gray-600 mt-2">Organize and manage your study notes</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>New Note</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingNote ? 'Edit Note' : 'Create New Note'}</DialogTitle>
                <DialogDescription>
                  {editingNote ? 'Update your note content' : 'Add a new note to your collection'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    placeholder="Enter note title..."
                    value={noteForm.title}
                    onChange={(e) => setNoteForm({...noteForm, title: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Subject</label>
                    <Input
                      placeholder="e.g., Mathematics, Physics..."
                      value={noteForm.subject}
                      onChange={(e) => setNoteForm({...noteForm, subject: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Color</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={noteForm.color}
                        onChange={(e) => setNoteForm({...noteForm, color: e.target.value})}
                        className="w-12 h-10 rounded border"
                      />
                      <Input
                        value={noteForm.color}
                        onChange={(e) => setNoteForm({...noteForm, color: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Tags (comma separated)</label>
                  <Input
                    placeholder="e.g., important, revision, exam..."
                    value={noteForm.tags}
                    onChange={(e) => setNoteForm({...noteForm, tags: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Content</label>
                  <Textarea
                    placeholder="Write your note content here..."
                    value={noteForm.content}
                    onChange={(e) => setNoteForm({...noteForm, content: e.target.value})}
                    rows={10}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsCreateDialogOpen(false)
                      setEditingNote(null)
                      setNoteForm({ title: '', content: '', subject: '', tags: '', color: '#3B82F6' })
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={editingNote ? handleUpdateNote : handleCreateNote}>
                    {editingNote ? 'Update Note' : 'Create Note'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Notes</p>
                  <p className="text-2xl font-bold">{notes.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Star className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Favorites</p>
                  <p className="text-2xl font-bold">
                    {notes.filter(note => note.isFavorite).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Tag className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Subjects</p>
                  <p className="text-2xl font-bold">{subjects.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Clock className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Last Updated</p>
                  <p className="text-sm font-semibold">
                    {notes.length > 0 ? formatDate(notes[0].updatedAt).split(',')[0] : 'N/A'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Subjects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {subjects.map(subject => (
              <SelectItem key={subject} value={subject}>{subject}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="updated">Last Updated</SelectItem>
            <SelectItem value="created">Date Created</SelectItem>
            <SelectItem value="title">Title</SelectItem>
            <SelectItem value="favorite">Favorites First</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Notes Display */}
      {filteredNotes.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notes found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery 
                ? `No results found for "${searchQuery}"` 
                : 'Start by creating your first note!'}
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Note
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' 
          : 'space-y-4'}>
          {filteredNotes.map((note) => (
            <Card key={note.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: note.color }}
                      ></div>
                      <Badge variant="secondary" className="text-xs">
                        {note.subject}
                      </Badge>
                      {note.isFavorite && (
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      )}
                    </div>
                    <CardTitle className="text-lg leading-tight">
                      {note.title}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Updated {formatDate(note.updatedAt)}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFavorite(note.id)}
                    >
                      <Star className={`h-4 w-4 ${note.isFavorite ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditNote(note)}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteNote(note.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-3 line-clamp-4">
                  {note.content}
                </p>
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {note.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(note.createdAt).split(',')[0]}</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}