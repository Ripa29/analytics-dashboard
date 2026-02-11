'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Briefcase, Users, UserPlus, UserMinus, Mail, Phone, Calendar, Star, XCircle,
    Search, Filter, Download, MessageCircle, FileText, MoreVertical } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card'
import { Button } from '@/src/components/ui/Button'
import { useDashboardStore } from '@/lib/store/dashboardStore'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'


interface TeamMember {
    id: string
    name: string
    email: string
    phone: string
    role: 'manager' | 'team_lead' | 'senior' | 'junior' | 'intern'
    department: string
    position: string
    avatar: string
    joinedDate: Date
    performance: number
    projects: number
    tasks: number
    completedTasks: number
    status: 'active' | 'vacation' | 'sick' | 'remote'
    skills: string[]
    rating: number
}

export default function TeamManagementPage() {
    const { user, darkMode } = useDashboardStore()
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState('')
    const [departmentFilter, setDepartmentFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState('all')
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
    const [showMemberDetails, setShowMemberDetails] = useState(false)

    // Check if user is manager
    if (!user || user.role !== 'manager') {
        return (
            <div className="p-6">
                <Card>
                    <CardContent className="p-8 text-center">
                        <Briefcase className="w-16 h-16 text-red-400 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            Access Denied
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            You don't have permission to access Team Management.
                        </p>
                        <Button
                            onClick={() => router.push('/')}
                            className="mt-6"
                        >
                            Return to Dashboard
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Mock team members data
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
        {
            id: '1',
            name: 'Sarah Johnson',
            email: 'sarah.j@company.com',
            phone: '+1 234-567-8901',
            role: 'team_lead',
            department: 'Engineering',
            position: 'Senior Team Lead',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
            joinedDate: new Date('2022-03-15'),
            performance: 95,
            projects: 4,
            tasks: 12,
            completedTasks: 45,
            status: 'active',
            skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
            rating: 4.8
        },
        {
            id: '2',
            name: 'Michael Chen',
            email: 'michael.c@company.com',
            phone: '+1 234-567-8902',
            role: 'senior',
            department: 'Engineering',
            position: 'Senior Developer',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
            joinedDate: new Date('2022-06-20'),
            performance: 88,
            projects: 3,
            tasks: 8,
            completedTasks: 32,
            status: 'active',
            skills: ['Python', 'Django', 'PostgreSQL', 'Docker'],
            rating: 4.5
        },
        {
            id: '3',
            name: 'Emily Rodriguez',
            email: 'emily.r@company.com',
            phone: '+1 234-567-8903',
            role: 'senior',
            department: 'Design',
            position: 'UI/UX Lead',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
            joinedDate: new Date('2022-09-10'),
            performance: 92,
            projects: 5,
            tasks: 10,
            completedTasks: 38,
            status: 'vacation',
            skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping'],
            rating: 4.9
        },
        {
            id: '4',
            name: 'James Wilson',
            email: 'james.w@company.com',
            phone: '+1 234-567-8904',
            role: 'junior',
            department: 'Engineering',
            position: 'Junior Developer',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
            joinedDate: new Date('2023-01-05'),
            performance: 75,
            projects: 2,
            tasks: 5,
            completedTasks: 18,
            status: 'active',
            skills: ['JavaScript', 'HTML', 'CSS', 'React'],
            rating: 4.0
        },
        {
            id: '5',
            name: 'Lisa Thompson',
            email: 'lisa.t@company.com',
            phone: '+1 234-567-8905',
            role: 'intern',
            department: 'Marketing',
            position: 'Marketing Intern',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
            joinedDate: new Date('2023-08-15'),
            performance: 82,
            projects: 1,
            tasks: 3,
            completedTasks: 12,
            status: 'active',
            skills: ['Social Media', 'Content Writing', 'SEO'],
            rating: 4.2
        },
        {
            id: '6',
            name: 'David Brown',
            email: 'david.b@company.com',
            phone: '+1 234-567-8906',
            role: 'senior',
            department: 'Sales',
            position: 'Senior Sales Manager',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
            joinedDate: new Date('2022-11-30'),
            performance: 90,
            projects: 6,
            tasks: 15,
            completedTasks: 52,
            status: 'remote',
            skills: ['Negotiation', 'CRM', 'Lead Generation', 'Presentation'],
            rating: 4.7
        }
    ])

    // Get department list
    const departments = Array.from(new Set(teamMembers.map(m => m.department)))

    // Filter team members
    const filteredMembers = teamMembers.filter(member => {
        const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.position.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesDepartment = departmentFilter === 'all' || member.department === departmentFilter
        const matchesStatus = statusFilter === 'all' || member.status === statusFilter
        return matchesSearch && matchesDepartment && matchesStatus
    })

    // Get role badge color
    const getRoleColor = (role: string) => {
        switch (role) {
            case 'team_lead': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
            case 'senior': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
            case 'junior': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
            case 'intern': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
        }
    }

    // Get status badge color
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
            case 'vacation': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
            case 'sick': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            case 'remote': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
        }
    }

    // Handle add member
    const handleAddMember = () => {
        toast.success('Invitation sent to new team member!', {
            icon: '📧',
            style: {
                background: darkMode ? '#1F2937' : '#fff',
                color: darkMode ? '#fff' : '#363636',
            }
        })
    }

    // Handle remove member
    const handleRemoveMember = (id: string) => {
        setTeamMembers(teamMembers.filter(m => m.id !== id))
        toast.success('Team member removed successfully', {
            icon: '✅',
            style: {
                background: darkMode ? '#1F2937' : '#fff',
                color: darkMode ? '#fff' : '#363636',
            }
        })
    }

    // Calculate team stats
    const teamStats = {
        total: teamMembers.length,
        active: teamMembers.filter(m => m.status === 'active').length,
        onLeave: teamMembers.filter(m => m.status === 'vacation' || m.status === 'sick').length,
        remote: teamMembers.filter(m => m.status === 'remote').length,
        avgPerformance: Math.round(teamMembers.reduce((acc, m) => acc + m.performance, 0) / teamMembers.length),
        totalProjects: teamMembers.reduce((acc, m) => acc + m.projects, 0),
        totalTasks: teamMembers.reduce((acc, m) => acc + m.tasks, 0),
        completedTasks: teamMembers.reduce((acc, m) => acc + m.completedTasks, 0)
    }

    return (
        <div className="p-4 sm:p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center space-x-3">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Team Management
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Manage your team members and track performance
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <Button
                        variant="secondary"
                        icon={<Download size={18} />}
                    >
                        Export
                    </Button>
                    <Button
                        icon={<UserPlus size={18} />}
                        onClick={handleAddMember}
                    >
                        Add Member
                    </Button>
                </div>
            </div>

            {/* Team Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                    <CardContent className="p-4">
                        <p className="text-green-100 text-xs">Total Team</p>
                        <p className="text-2xl font-bold">{teamStats.total}</p>
                        <p className="text-green-100 text-xs mt-1">members</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <CardContent className="p-4">
                        <p className="text-blue-100 text-xs">Active</p>
                        <p className="text-2xl font-bold">{teamStats.active}</p>
                        <p className="text-blue-100 text-xs mt-1">members</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
                    <CardContent className="p-4">
                        <p className="text-amber-100 text-xs">On Leave</p>
                        <p className="text-2xl font-bold">{teamStats.onLeave}</p>
                        <p className="text-amber-100 text-xs mt-1">members</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                    <CardContent className="p-4">
                        <p className="text-purple-100 text-xs">Remote</p>
                        <p className="text-2xl font-bold">{teamStats.remote}</p>
                        <p className="text-purple-100 text-xs mt-1">members</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
                    <CardContent className="p-4">
                        <p className="text-indigo-100 text-xs">Performance</p>
                        <p className="text-2xl font-bold">{teamStats.avgPerformance}%</p>
                        <p className="text-indigo-100 text-xs mt-1">average</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white">
                    <CardContent className="p-4">
                        <p className="text-pink-100 text-xs">Projects</p>
                        <p className="text-2xl font-bold">{teamStats.totalProjects}</p>
                        <p className="text-pink-100 text-xs mt-1">active</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white">
                    <CardContent className="p-4">
                        <p className="text-cyan-100 text-xs">Tasks</p>
                        <p className="text-2xl font-bold">{teamStats.completedTasks}</p>
                        <p className="text-cyan-100 text-xs mt-1">completed</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search team members..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center space-x-2">
                                <Filter className="text-gray-400" size={18} />
                                <select
                                    value={departmentFilter}
                                    onChange={(e) => setDepartmentFilter(e.target.value)}
                                    className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="all">All Departments</option>
                                    {departments.map(dept => (
                                        <option key={dept} value={dept}>{dept}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-center space-x-2">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="all">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="vacation">Vacation</option>
                                    <option value="sick">Sick Leave</option>
                                    <option value="remote">Remote</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Team Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMembers.map((member) => (
                    <Card
                        key={member.id}
                        className="hover:shadow-xl transition-all duration-300 cursor-pointer group"
                        onClick={() => {
                            setSelectedMember(member)
                            setShowMemberDetails(true)
                        }}
                    >
                        <CardContent className="p-6">
                            {/* Header */}
                            <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="relative">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold">
                                            <img
                                                src={member.avatar}
                                                alt={member.name}
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        </div>
                                        <div className={cn(
                                            "absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-gray-900",
                                            member.status === 'active' && 'bg-green-500',
                                            member.status === 'vacation' && 'bg-blue-500',
                                            member.status === 'sick' && 'bg-red-500',
                                            member.status === 'remote' && 'bg-purple-500'
                                        )} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                            {member.name}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {member.position}
                                        </p>
                                        <div className="flex items-center mt-1 space-x-2">
                                            <span className={cn(
                                                "px-2 py-0.5 rounded-full text-xs font-medium",
                                                getRoleColor(member.role)
                                            )}>
                                                {member.role.replace('_', ' ').toUpperCase()}
                                            </span>
                                            <span className={cn(
                                                "px-2 py-0.5 rounded-full text-xs font-medium",
                                                getStatusColor(member.status)
                                            )}>
                                                {member.status.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <MoreVertical className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                                </button>
                            </div>

                            {/* Contact Info */}
                            <div className="mt-4 space-y-2">
                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                    <Mail className="w-4 h-4 mr-2" />
                                    <span className="truncate">{member.email}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                    <Phone className="w-4 h-4 mr-2" />
                                    <span>{member.phone}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    <span>Joined {member.joinedDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                                </div>
                            </div>

                            {/* Performance Bar */}
                            <div className="mt-4">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                        Performance
                                    </span>
                                    <span className="text-xs font-bold text-gray-900 dark:text-white">
                                        {member.performance}%
                                    </span>
                                </div>
                                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                                        style={{ width: `${member.performance}%` }}
                                    />
                                </div>
                            </div>

                            {/* Skills */}
                            <div className="mt-4">
                                <div className="flex flex-wrap gap-1">
                                    {member.skills.slice(0, 3).map((skill, index) => (
                                        <span
                                            key={index}
                                            className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md text-xs text-gray-700 dark:text-gray-300"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                    {member.skills.length > 3 && (
                                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md text-xs text-gray-700 dark:text-gray-300">
                                            +{member.skills.length - 3}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="text-center">
                                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                                            {member.projects}
                                        </p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            Projects
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                                            {member.tasks}
                                        </p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            Tasks
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <div className="flex items-center justify-center">
                                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                            <span className="text-lg font-bold text-gray-900 dark:text-white ml-1">
                                                {member.rating}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            Rating
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-4 flex items-center space-x-2">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="flex-1"
                                    icon={<MessageCircle size={16} />}
                                >
                                    Message
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    icon={<UserMinus size={16} />}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleRemoveMember(member.id)
                                    }}
                                >
                                    Remove
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Member Details Modal */}
            {showMemberDetails && selectedMember && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center space-x-2">
                                    <Users className="w-5 h-5" />
                                    <span>Team Member Details</span>
                                </CardTitle>
                                <button
                                    onClick={() => setShowMemberDetails(false)}
                                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                                >
                                    <XCircle className="w-5 h-5" />
                                </button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {/* Member Info */}
                                <div className="flex items-center space-x-6">
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-3xl font-bold">
                                        <img
                                            src={selectedMember.avatar}
                                            alt={selectedMember.name}
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {selectedMember.name}
                                        </h2>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            {selectedMember.position}
                                        </p>
                                        <div className="flex items-center space-x-2 mt-2">
                                            <span className={cn("px-3 py-1 rounded-full text-xs font-medium", getRoleColor(selectedMember.role))}>
                                                {selectedMember.role.replace('_', ' ').toUpperCase()}
                                            </span>
                                            <span className={cn("px-3 py-1 rounded-full text-xs font-medium", getStatusColor(selectedMember.status))}>
                                                {selectedMember.status.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Info */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <Mail className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                                                <p className="font-medium text-gray-900 dark:text-white">{selectedMember.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <Phone className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                                                <p className="font-medium text-gray-900 dark:text-white">{selectedMember.phone}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <Briefcase className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Department</p>
                                                <p className="font-medium text-gray-900 dark:text-white">{selectedMember.department}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <Calendar className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Joined Date</p>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {selectedMember.joinedDate.toLocaleDateString('en-US', {
                                                        month: 'long',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Skills */}
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Skills</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedMember.skills.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Performance Metrics */}
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Performance Metrics</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600 dark:text-gray-400">Performance</span>
                                                <span className="font-bold text-green-600">{selectedMember.performance}%</span>
                                            </div>
                                            <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-green-500 rounded-full"
                                                    style={{ width: `${selectedMember.performance}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600 dark:text-gray-400">Projects</span>
                                                <span className="font-bold text-blue-600">{selectedMember.projects}</span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">Active projects</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600 dark:text-gray-400">Tasks Completed</span>
                                                <span className="font-bold text-purple-600">{selectedMember.completedTasks}</span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">Total tasks</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-end space-x-3 pt-4 border-t">
                                    <Button variant="secondary" icon={<MessageCircle size={18} />}>
                                        Send Message
                                    </Button>
                                    <Button icon={<FileText size={18} />}>
                                        View Full Profile
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}