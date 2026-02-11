'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { HelpCircle, Mail, Phone, MessageCircle, FileText, ChevronDown, ChevronUp, Send, CheckCircle, Book, Video, MessageSquare, LifeBuoy, Users, Download, Code } from 'lucide-react'
import toast from 'react-hot-toast'

const faqs = [
    {
        question: 'How do I reset my password?',
        answer: 'Go to Settings → Security → Change Password. Enter your current password and new password to reset. You will receive a confirmation email once the password is changed.'
    },
    {
        question: 'How can I generate reports?',
        answer: 'Navigate to Reports page and click "Generate Report". Select report type, enter a title, and click Generate. The report will be added to your reports list and you can download it in various formats.'
    },
    {
        question: 'What permissions does each role have?',
        answer: 'Admin: Full access to all features including user management, system settings, and all CRUD operations. Manager: Can manage orders, products, and view analytics. User: Basic view-only access to dashboard, orders, and products.'
    },
    {
        question: 'How do I export data?',
        answer: 'Use the Export CSV or Export Excel buttons on the FilterBar or any management page to download your data. You can also export individual reports from the Reports page.'
    },
    {
        question: 'How do I add new users?',
        answer: 'Go to Users Management page and click "Add New User". Fill in the required information including name, email, and role. The user will receive an email with login instructions.'
    },
    {
        question: 'How do I update product inventory?',
        answer: 'Navigate to Products Management, find the product you want to update, click Edit, or use the +10/-10 buttons to quickly adjust stock levels. You can also update status, price, and other details.'
    },
    {
        question: 'How do I contact support?',
        answer: 'Use the contact form below or email support@analytics.com. Response time is within 24 hours. For urgent issues, please use the live chat during business hours.'
    }
]

const guides = [
    { title: 'Getting Started Guide', description: 'Learn the basics of the analytics dashboard', icon: Book, duration: '5 min' },
    { title: 'User Management', description: 'How to manage users and permissions', icon: Users, duration: '8 min' },
    { title: 'Report Generation', description: 'Create and export custom reports', icon: FileText, duration: '6 min' },
    { title: 'Data Export', description: 'Export data to CSV and Excel formats', icon: Download, duration: '4 min' },
    { title: 'API Documentation', description: 'Integrate with our REST API', icon: Code, duration: '15 min' },
    { title: 'Video Tutorials', description: 'Watch step-by-step video guides', icon: Video, duration: '20 min' },
]

export default function HelpPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(0)
    const [searchTerm, setSearchTerm] = useState('')
    const [contactForm, setContactForm] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
        priority: 'normal'
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const filteredFaqs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!contactForm.name || !contactForm.email || !contactForm.subject || !contactForm.message) {
            toast.error('Please fill in all required fields')
            return
        }

        if (!contactForm.email.includes('@')) {
            toast.error('Please enter a valid email address')
            return
        }

        setIsSubmitting(true)

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false)
            setIsSubmitted(true)
            toast.success('Support ticket created successfully! Ticket #' + Math.floor(Math.random() * 10000))

            // Reset after 3 seconds
            setTimeout(() => {
                setIsSubmitted(false)
                setContactForm({ name: '', email: '', subject: '', message: '', priority: 'normal' })
            }, 3000)
        }, 1500)
    }

    return (
        <div className="p-4 sm:p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Help & Support</h1>
                <p className="text-gray-600 dark:text-gray-400">Get help, find answers, and contact support</p>
            </div>

            {/* Hero Search */}
            <Card className="mb-8 bg-gradient-to-r from-blue-500/10 to-purple-600/10 border-0">
                <CardContent className="p-8 text-center">
                    <LifeBuoy className="w-16 h-16 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">How can we help you?</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
                        Search our knowledge base or browse through frequently asked questions
                    </p>
                    <div className="max-w-xl mx-auto">
                        <div className="relative">
                            <HelpCircle className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search for answers..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"/>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Contact Form & FAQs */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Contact Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Mail className="w-5 h-5" />
                                <span>Contact Support</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isSubmitted ? (
                                <div className="text-center py-8">
                                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                        Message Sent!
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                                        Thank you for contacting us. A support representative will get back to you within 24 hours.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Your Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={contactForm.name}
                                                onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="John Doe"
                                                required/>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                value={contactForm.email}
                                                onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="john@example.com"
                                                required/>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Subject *
                                        </label>
                                        <input
                                            type="text"
                                            value={contactForm.subject}
                                            onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="How can we help?"
                                            required/>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Priority
                                        </label>
                                        <select
                                            value={contactForm.priority}
                                            onChange={(e) => setContactForm({...contactForm, priority: e.target.value})}
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                            <option value="low">Low</option>
                                            <option value="normal">Normal</option>
                                            <option value="high">High</option>
                                            <option value="urgent">Urgent</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Message *
                                        </label>
                                        <textarea
                                            rows={4}
                                            value={contactForm.message}
                                            onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Please describe your issue in detail..."
                                            required/>
                                    </div>
                                    <div className="flex justify-end">
                                        <Button
                                            type="submit"
                                            icon={<Send size={18} />}
                                            isLoading={isSubmitting}>
                                            Submit Ticket
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </CardContent>
                    </Card>

                    {/* FAQs */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <HelpCircle className="w-5 h-5" />
                                <span>Frequently Asked Questions</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {filteredFaqs.map((faq, index) => (
                                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                        <button
                                            onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                            <span className="font-medium text-gray-900 dark:text-white">{faq.question}</span>
                                            {openFaq === index ?
                                                <ChevronUp size={20} className="text-gray-500 flex-shrink-0 ml-2" /> :
                                                <ChevronDown size={20} className="text-gray-500 flex-shrink-0 ml-2" />
                                            }
                                        </button>
                                        {openFaq === index && (
                                            <div className="p-4 pt-0 border-t border-gray-200 dark:border-gray-700">
                                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{faq.answer}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {filteredFaqs.length === 0 && (
                                    <div className="text-center py-8">
                                        <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                        <p className="text-gray-600 dark:text-gray-400">No FAQs match your search</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/*  Contact Info & Resources */}
                <div className="space-y-6">
                    {/* Contact Methods */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Methods</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start space-x-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/40">
                                    <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">Email Support</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">support@analytics.com</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">24/7, Response within 24h</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4 p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/40">
                                    <Phone className="w-6 h-6 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">Phone Support</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">+880 123-4567-555</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Mon-Fri, 9AM-6PM EST</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-4 p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                                <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/40">
                                    <MessageCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">Live Chat</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Available 9AM-6PM EST</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Average response: 2 minutes</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Start Guide */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Book className="w-5 h-5" />
                                <span>Quick Start Guide</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start h-auto py-3"
                                    onClick={() => toast.success('Downloading Getting Started Guide')}
                                >
                                    <FileText className="w-4 h-4 mr-3 text-blue-500" />
                                    <div className="text-left">
                                        <p className="font-medium">Getting Started</p>
                                        <p className="text-xs text-gray-500">Learn the basics in 5 minutes</p>
                                    </div>
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start h-auto py-3"
                                    onClick={() => toast.success('Downloading User Guide')}
                                >
                                    <Users className="w-4 h-4 mr-3 text-green-500" />
                                    <div className="text-left">
                                        <p className="font-medium">User Management</p>
                                        <p className="text-xs text-gray-500">Manage users and roles</p>
                                    </div>
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start h-auto py-3"
                                    onClick={() => toast.success('Downloading Report Guide')}
                                >
                                    <FileText className="w-4 h-4 mr-3 text-purple-500" />
                                    <div className="text-left">
                                        <p className="font-medium">Report Generation</p>
                                        <p className="text-xs text-gray-500">Create custom reports</p>
                                    </div>
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start h-auto py-3"
                                    onClick={() => toast.success('Opening Video Tutorials')}
                                >
                                    <Video className="w-4 h-4 mr-3 text-amber-500" />
                                    <div className="text-left">
                                        <p className="font-medium">Video Tutorials</p>
                                        <p className="text-xs text-gray-500">Watch step-by-step guides</p>
                                    </div>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* System Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span>System Status</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">API Services</span>
                                    <span className="flex items-center text-green-600 dark:text-green-400">
                                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                                        Operational
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Database</span>
                                    <span className="flex items-center text-green-600 dark:text-green-400">
                                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                                        Operational
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Authentication</span>
                                    <span className="flex items-center text-green-600 dark:text-green-400">
                                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                                        Operational
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Storage</span>
                                    <span className="flex items-center text-green-600 dark:text-green-400">
                                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                                        Operational
                                    </span>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Uptime</span>
                                        <span className="text-sm font-semibold text-gray-900 dark:text-white">99.9%</span>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Response Time</span>
                                        <span className="text-sm font-semibold text-gray-900 dark:text-white">187ms</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Community */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <MessageSquare className="w-5 h-5" />
                                <span>Community</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start"
                                    onClick={() => toast('Opening Community Forum', { icon: '💬', duration: 3000 })}>
                                    <MessageSquare className="w-4 h-4 mr-2" />
                                    Community Forum
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start"
                                    onClick={() => toast('Opening Feature Requests', { icon: '✨', duration: 3000 })}>
                                    <HelpCircle className="w-4 h-4 mr-2" />
                                    Feature Requests
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start"
                                    onClick={() => toast.success('Joining Discord Server')}
                                >
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    Discord Server
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}