'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Star, Clock, Calendar, ExternalLink, ChevronLeft, Heart, ChevronDown, ChevronUp } from 'lucide-react';
import { MentorCard } from '@/components/MentorCard';
import type { MentorProfile } from '@/lib/types';

// Mock data for mentor profiles
const mentorProfiles: any[] = [
  {
    id: '1',
    user_id: 'u1',
    headline: 'Senior Software Engineer at Google',
    company: 'Google',
    job_title: 'Senior Software Engineer',
    years_of_experience: 8,
    bio: 'I help developers level up their skills. With over 8 years of experience in software engineering, I specialize in building scalable web applications and mentoring developers to reach their full potential.',
    expertise_tags: ['JavaScript', 'React', 'Node.js'],
    session_price: 10000,
    avg_rating: 4.8,
    total_sessions: 50,
    is_available: true,
    user: {
      id: 'u1',
      first_name: 'John',
      last_name: 'Doe',
      avatar_url: null,
      email: 'john@example.com',
      role: 'mentor' as const,
      verified: true,
      created_at: new Date().toISOString(),
      bio: null,
      linkedin_id: null
    },
    services: [
      { 
        id: 's1', 
        mentor_id: '1', 
        service_type: 'resume_review' as const, 
        description: 'Get feedback on your resume', 
        duration_minutes: 30, 
        price_override: null, 
        is_active: true 
      },
      { 
        id: 's2', 
        mentor_id: '1', 
        service_type: 'mock_interview' as const, 
        description: 'Practice coding interviews', 
        duration_minutes: 60, 
        price_override: null, 
        is_active: true 
      },
      { 
        id: 's3', 
        mentor_id: '1', 
        service_type: 'referral' as const, 
        description: 'Get a referral to top tech companies', 
        duration_minutes: 30, 
        price_override: null, 
        is_active: true 
      },
      { 
        id: 's4', 
        mentor_id: '1', 
        service_type: 'certification_prep' as const, 
        description: 'Prepare for technical certifications', 
        duration_minutes: 90, 
        price_override: null, 
        is_active: true 
      }
    ],
    experience: [
      'Senior Software Engineer, Google (2018-present)',
      'Software Engineer, Microsoft (2015-2018)',
      'Junior Developer, Amazon (2013-2015)'
    ],
    publications: [
      'The Future of Web Development',
      'React Best Practices for 2025',
      'JavaScript Performance Optimization'
    ],
    achievements: [
      'Google Developer Expert (GDE) 2023',
      'Stack Overflow Top Contributor 2022',
      'AWS Certified Solutions Architect'
    ],
    certifications: [
      'AWS Certified Solutions Architect',
      'Google Cloud Professional Developer',
      'Microsoft Certified: Azure Developer Associate'
    ],
    education: [
      'Bachelor of Science in Computer Science, Stanford University (2013)',
      'Master of Science in Software Engineering, MIT (2015)'
    ],
    languages: ['English', 'Spanish', 'French'],
    interests: ['Hiking', 'Photography', 'Open Source'],
    hobbies: ['Playing Guitar', 'Reading', 'Traveling'],
    social_media: {
      linkedin: 'https://linkedin.com/in/johndoe',
      github: 'https://github.com/johndoe',
      twitter: 'https://twitter.com/johndoe'
    },
    testimonials: [
      {
        id: 't1',
        name: 'Alice Smith',
        role: 'Software Engineer',
        company: 'Meta',
        content: 'John is an amazing mentor! He helped me prepare for my technical interviews and I landed a job at Meta. Highly recommended!'
      },
      {
        id: 't2',
        name: 'Bob Johnson',
        role: 'Full Stack Developer',
        company: 'Amazon',
        content: 'I worked with John on my resume and LinkedIn profile. He provided great feedback and helped me stand out from other candidates.'
      }
    ],
    projects: [
      {
        id: 'p1',
        title: 'E-commerce Platform',
        description: 'A fully functional e-commerce platform built with React and Node.js',
        technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
        url: 'https://github.com/johndoe/ecommerce-platform'
      },
      {
        id: 'p2',
        title: 'Task Management App',
        description: 'A task management application with real-time updates',
        technologies: ['React', 'Firebase', 'Redux'],
        url: 'https://github.com/johndoe/task-management-app'
      }
    ],
    contact: {
      email: 'john.doe@example.com',
      phone: '+1 555-123-4567',
      location: 'San Francisco, CA'
    },
    references: [
      {
        id: 'r1',
        name: 'Sarah Johnson',
        role: 'Senior Engineering Manager',
        company: 'Google',
        email: 'sarah.johnson@google.com',
        phone: '+1 555-987-6543'
      },
      {
        id: 'r2',
        name: 'Michael Brown',
        role: 'Principal Software Engineer',
        company: 'Microsoft',
        email: 'michael.brown@microsoft.com',
        phone: '+1 555-456-7890'
      }
    ],
    gallery: [
      {
        id: 'g1',
        title: 'Conferance Talk',
        image_url: 'https://picsum.photos/seed/gallery1/400/225',
        description: 'Speaking at a tech conference about React development'
      },
      {
        id: 'g2',
        title: 'Team Meeting',
        image_url: 'https://picsum.photos/seed/gallery2/400/225',
        description: 'Working with my team at Google'
      }
    ],
    events: [
      {
        id: 'e1',
        title: 'ReactConf 2025',
        date: '2025-03-15',
        location: 'New York, NY',
        description: 'Speaking at ReactConf 2025 about advanced React patterns'
      },
      {
        id: 'e2',
        title: 'Google I/O 2025',
        date: '2025-05-10',
        location: 'Mountain View, CA',
        description: 'Attending Google I/O 2025 to learn about the latest technologies'
      }
    ],
    news: [
      {
        id: 'n1',
        title: 'John Doe featured in TechCrunch',
        date: '2025-01-20',
        description: 'John Doe was featured in TechCrunch for his contributions to the React community',
        url: 'https://techcrunch.com/2025/01/20/john-doe-react-community'
      },
      {
        id: 'n2',
        title: 'New Book Release: React Best Practices',
        date: '2025-01-15',
        description: 'John Doe\'s new book "React Best Practices for 2025" is now available on Amazon',
        url: 'https://amazon.com/dp/1234567890'
      }
    ],
    newsletter: 'https://john-doe.dev/newsletter',
    videos: [
      {
        id: 'v1',
        title: 'Advanced React Patterns',
        description: 'Learn advanced React patterns for building scalable applications',
        url: 'https://youtube.com/watch?v=example1',
        thumbnail_url: 'https://picsum.photos/seed/video1/400/225',
        published_at: '2025-01-20T10:00:00Z',
        duration: '45:23'
      },
      {
        id: 'v2',
        title: 'System Design Interview Prep',
        description: 'Prepare for system design interviews with real-world examples',
        url: 'https://youtube.com/watch?v=example2',
        thumbnail_url: 'https://picsum.photos/seed/video2/400/225',
        published_at: '2025-01-15T14:30:00Z',
        duration: '52:15'
      },
      {
        id: 'v3',
        title: 'JavaScript Performance Optimization',
        description: 'Learn how to optimize JavaScript performance for faster web applications',
        url: 'https://youtube.com/watch?v=example3',
        thumbnail_url: 'https://picsum.photos/seed/video3/400/225',
        published_at: '2025-01-10T16:00:00Z',
        duration: '38:45'
      }
    ],
    blogs: [
      {
        id: 'b1',
        title: 'How to Ace Your Next Technical Interview',
        description: 'A comprehensive guide to preparing for technical interviews',
        url: 'https://john-doe.dev/blog/technical-interview-guide',
        thumbnail_url: 'https://picsum.photos/seed/blog1/400/225',
        published_at: '2025-01-18T09:00:00Z',
        read_time: '8 min read'
      },
      {
        id: 'b2',
        title: 'Building Scalable Web Applications',
        description: 'Best practices for building scalable web applications',
        url: 'https://john-doe.dev/blog/scalable-web-apps',
        thumbnail_url: 'https://picsum.photos/seed/blog2/400/225',
        published_at: '2025-01-12T16:00:00Z',
        read_time: '12 min read'
      },
      {
        id: 'b3',
        title: 'JavaScript Best Practices',
        description: 'Essential JavaScript best practices for modern web development',
        url: 'https://john-doe.dev/blog/javascript-best-practices',
        thumbnail_url: 'https://picsum.photos/seed/blog3/400/225',
        published_at: '2025-01-08T10:30:00Z',
        read_time: '10 min read'
      }
    ]
  },
  {
    id: '2',
    user_id: 'u2',
    headline: 'Product Manager at Microsoft',
    company: 'Microsoft',
    job_title: 'Product Manager',
    years_of_experience: 6,
    bio: 'I help product managers succeed. With over 6 years of experience in product management, I specialize in building user-centric products and mentoring aspiring product managers.',
    expertise_tags: ['Product Management', 'Agile', 'User Research'],
    session_price: 15000,
    avg_rating: 4.5,
    total_sessions: 30,
    is_available: true,
    user: {
      id: 'u2',
      first_name: 'Jane',
      last_name: 'Smith',
      avatar_url: null,
      email: 'jane@example.com',
      role: 'mentor' as const,
      verified: true,
      created_at: new Date().toISOString(),
      bio: null,
      linkedin_id: null
    },
    services: [
      { 
        id: 's5', 
        mentor_id: '2', 
        service_type: 'career_guidance' as const, 
        description: 'Plan your career path', 
        duration_minutes: 60, 
        price_override: null, 
        is_active: true 
      },
      { 
        id: 's6', 
        mentor_id: '2', 
        service_type: 'certification_prep' as const, 
        description: 'Learn product management', 
        duration_minutes: 90, 
        price_override: null, 
        is_active: true 
      },
      { 
        id: 's7', 
        mentor_id: '2', 
        service_type: 'mock_interview' as const, 
        description: 'Practice product management interviews', 
        duration_minutes: 60, 
        price_override: null, 
        is_active: true 
      },
      { 
        id: 's8', 
        mentor_id: '2', 
        service_type: 'resume_review' as const, 
        description: 'Get feedback on your PM resume', 
        duration_minutes: 30, 
        price_override: null, 
        is_active: true 
      }
    ],
    experience: [
      'Product Manager, Microsoft (2019-present)',
      'Associate Product Manager, Meta (2017-2019)',
      'Product Intern, Apple (2016)'
    ],
    publications: [
      'The Art of Product Management',
      'Agile Product Development: A Practical Guide',
      'User Research Methods for PMs'
    ],
    achievements: [
      'Microsoft MVP 2024',
      'Product Hunt Top 10 Products 2023',
      'Certified Scrum Product Owner (CSPO)'
    ],
    certifications: [
      'Certified Scrum Product Owner (CSPO)',
      'Product School Certified Product Manager (PMC)',
      'Google Analytics 4 Certification'
    ],
    education: [
      'Bachelor of Business Administration, Harvard University (2016)',
      'Master of Business Administration, Stanford University (2018)'
    ],
    languages: ['English', 'Mandarin', 'German'],
    interests: ['Reading', 'Running', 'Photography'],
    hobbies: ['Playing Piano', 'Cooking', 'Traveling'],
    social_media: {
      linkedin: 'https://linkedin.com/in/janesmith',
      twitter: 'https://twitter.com/janesmith'
    },
    testimonials: [
      {
        id: 't3',
        name: 'Charlie Brown',
        role: 'Product Manager',
        company: 'Google',
        content: 'Jane is an excellent mentor! She helped me prepare for my product management interviews and I landed a job at Google. Her insights are invaluable.'
      },
      {
        id: 't4',
        name: 'Diana Prince',
        role: 'Associate Product Manager',
        company: 'Amazon',
        content: 'I worked with Jane on my resume and product portfolio. She provided great feedback and helped me improve my product thinking skills.'
      }
    ],
    projects: [
      {
        id: 'p3',
        title: 'Task Management App',
        description: 'A task management application with real-time updates',
        technologies: ['React', 'Firebase', 'Redux'],
        url: 'https://github.com/janesmith/task-management-app'
      },
      {
        id: 'p4',
        title: 'E-commerce Platform',
        description: 'A fully functional e-commerce platform built with React and Node.js',
        technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
        url: 'https://github.com/janesmith/ecommerce-platform'
      }
    ],
    contact: {
      email: 'jane.smith@example.com',
      phone: '+1 555-234-5678',
      location: 'Seattle, WA'
    },
    references: [
      {
        id: 'r3',
        name: 'David Wilson',
        role: 'Senior Product Manager',
        company: 'Microsoft',
        email: 'david.wilson@microsoft.com',
        phone: '+1 555-876-5432'
      },
      {
        id: 'r4',
        name: 'Emily Davis',
        role: 'Product Director',
        company: 'Meta',
        email: 'emily.davis@meta.com',
        phone: '+1 555-345-6789'
      }
    ],
    gallery: [
      {
        id: 'g3',
        title: 'Product Launch',
        image_url: 'https://picsum.photos/seed/gallery3/400/225',
        description: 'Launching a new product at Microsoft'
      },
      {
        id: 'g4',
        title: 'User Research',
        image_url: 'https://picsum.photos/seed/gallery4/400/225',
        description: 'Conducting user research for a new feature'
      }
    ],
    events: [
      {
        id: 'e3',
        title: 'Product School Conference 2025',
        date: '2025-04-10',
        location: 'San Francisco, CA',
        description: 'Speaking at Product School Conference 2025 about agile product development'
      },
      {
        id: 'e4',
        title: 'Microsoft Build 2025',
        date: '2025-05-20',
        location: 'Seattle, WA',
        description: 'Attending Microsoft Build 2025 to learn about the latest product management practices'
      }
    ],
    news: [
      {
        id: 'n3',
        title: 'Jane Smith wins Product Manager of the Year',
        date: '2025-01-25',
        description: 'Jane Smith was awarded Product Manager of the Year by the Product Management Association',
        url: 'https://productmanagementassociation.org/2025/01/25/jane-smith-product-manager-of-the-year'
      },
      {
        id: 'n4',
        title: 'New Course: Agile Product Development',
        date: '2025-01-18',
        description: 'Jane Smith\'s new course "Agile Product Development: A Practical Guide" is now available on Udemy',
        url: 'https://udemy.com/course/agile-product-development'
      }
    ],
    newsletter: 'https://jane-smith.com/newsletter',
    videos: [
      {
        id: 'v4',
        title: 'Product Strategy 101',
        description: 'Learn the fundamentals of product strategy',
        url: 'https://youtube.com/watch?v=example4',
        thumbnail_url: 'https://picsum.photos/seed/video4/400/225',
        published_at: '2025-01-19T11:00:00Z',
        duration: '38:45'
      },
      {
        id: 'v5',
        title: 'User Story Mapping',
        description: 'Master user story mapping for better product planning',
        url: 'https://youtube.com/watch?v=example5',
        thumbnail_url: 'https://picsum.photos/seed/video5/400/225',
        published_at: '2025-01-14T15:30:00Z',
        duration: '42:10'
      },
      {
        id: 'v6',
        title: 'Agile Product Development',
        description: 'Learn how to build products using agile methodologies',
        url: 'https://youtube.com/watch?v=example6',
        thumbnail_url: 'https://picsum.photos/seed/video6/400/225',
        published_at: '2025-01-09T13:00:00Z',
        duration: '45:30'
      }
    ],
    blogs: [
      {
        id: 'b4',
        title: 'How to Get Your First PM Job',
        description: 'A step-by-step guide to landing your first product management role',
        url: 'https://jane-smith.com/blog/first-pm-job',
        thumbnail_url: 'https://picsum.photos/seed/blog4/400/225',
        published_at: '2025-01-17T08:00:00Z',
        read_time: '10 min read'
      },
      {
        id: 'b5',
        title: 'Product Metrics That Matter',
        description: 'Key metrics every product manager should track',
        url: 'https://jane-smith.com/blog/product-metrics',
        thumbnail_url: 'https://picsum.photos/seed/blog5/400/225',
        published_at: '2025-01-11T14:00:00Z',
        read_time: '9 min read'
      },
      {
        id: 'b6',
        title: 'User Research Methods for PMs',
        description: 'Essential user research methods for product managers',
        url: 'https://jane-smith.com/blog/user-research-methods',
        thumbnail_url: 'https://picsum.photos/seed/blog6/400/225',
        published_at: '2025-01-07T10:00:00Z',
        read_time: '11 min read'
      }
    ]
  },
  {
    id: '3',
    user_id: 'u3',
    headline: 'Data Scientist at Amazon',
    company: 'Amazon',
    job_title: 'Data Scientist',
    years_of_experience: 5,
    bio: 'I help data scientists excel. With over 5 years of experience in data science and machine learning, I specialize in building predictive models and mentoring data scientists to advance their careers.',
    expertise_tags: ['Machine Learning', 'Data Analysis', 'Python'],
    session_price: 12000,
    avg_rating: 4.7,
    total_sessions: 40,
    is_available: true,
    user: {
      id: 'u3',
      first_name: 'Bob',
      last_name: 'Johnson',
      avatar_url: null,
      email: 'bob@example.com',
      role: 'mentor' as const,
      verified: true,
      created_at: new Date().toISOString(),
      bio: null,
      linkedin_id: null
    },
    services: [
      { 
        id: 's9', 
        mentor_id: '3', 
        service_type: 'project_review' as const, 
        description: 'Learn ML concepts', 
        duration_minutes: 60, 
        price_override: null, 
        is_active: true 
      },
      { 
        id: 's10', 
        mentor_id: '3', 
        service_type: 'other' as const, 
        description: 'Master data visualization', 
        duration_minutes: 30, 
        price_override: null, 
        is_active: true 
      },
      { 
        id: 's11', 
        mentor_id: '3', 
        service_type: 'certification_prep' as const, 
        description: 'Prepare for data science certifications', 
        duration_minutes: 90, 
        price_override: null, 
        is_active: true 
      },
      { 
        id: 's12', 
        mentor_id: '3', 
        service_type: 'resume_review' as const, 
        description: 'Get feedback on your data science resume', 
        duration_minutes: 30, 
        price_override: null, 
        is_active: true 
      }
    ],
    experience: [
      'Data Scientist, Amazon (2020-present)',
      'Machine Learning Engineer, Tesla (2018-2020)',
      'Data Analyst, Netflix (2016-2018)'
    ],
    publications: [
      'Machine Learning for Beginners',
      'Data Visualization Best Practices',
      'Statistical Analysis for Data Science'
    ],
    achievements: [
      'Kaggle Grandmaster 2023',
      'AWS Certified Machine Learning Specialist',
      'Google Cloud Professional Data Engineer'
    ],
    certifications: [
      'AWS Certified Machine Learning Specialist',
      'Google Cloud Professional Data Engineer',
      'Microsoft Certified: Azure Data Scientist Associate'
    ],
    education: [
      'Bachelor of Science in Data Science, University of California, Berkeley (2016)',
      'Master of Science in Machine Learning, Carnegie Mellon University (2018)'
    ],
    languages: ['English', 'Japanese', 'Korean'],
    interests: ['Data Analysis', 'Machine Learning', 'Open Source'],
    hobbies: ['Playing Chess', 'Reading', 'Hiking'],
    social_media: {
      linkedin: 'https://linkedin.com/in/bobjohnson',
      github: 'https://github.com/bobjohnson',
      twitter: 'https://twitter.com/bobjohnson'
    },
    testimonials: [
      {
        id: 't5',
        name: 'Ethan Hunt',
        role: 'Data Scientist',
        company: 'Netflix',
        content: 'Bob is an exceptional mentor! He helped me prepare for my data science interviews and I landed a job at Netflix. His knowledge of machine learning is impressive.'
      },
      {
        id: 't6',
        name: 'Fiona Green',
        role: 'Machine Learning Engineer',
        company: 'Tesla',
        content: 'I worked with Bob on my portfolio and projects. He provided great feedback and helped me improve my machine learning skills.'
      }
    ],
    projects: [
      {
        id: 'p5',
        title: 'Predictive Sales Model',
        description: 'A machine learning model to predict sales using historical data',
        technologies: ['Python', 'Scikit-learn', 'Pandas', 'NumPy'],
        url: 'https://github.com/bobjohnson/predictive-sales-model'
      },
      {
        id: 'p6',
        title: 'Image Classification Model',
        description: 'An image classification model using convolutional neural networks',
        technologies: ['Python', 'TensorFlow', 'Keras'],
        url: 'https://github.com/bobjohnson/image-classification-model'
      }
    ],
    contact: {
      email: 'bob.johnson@example.com',
      phone: '+1 555-345-6789',
      location: 'Seattle, WA'
    },
    references: [
      {
        id: 'r5',
        name: 'Grace Lee',
        role: 'Senior Data Scientist',
        company: 'Amazon',
        email: 'grace.lee@amazon.com',
        phone: '+1 555-765-4321'
      },
      {
        id: 'r6',
        name: 'Henry Wilson',
        role: 'Principal Machine Learning Engineer',
        company: 'Tesla',
        email: 'henry.wilson@tesla.com',
        phone: '+1 555-234-5678'
      }
    ],
    gallery: [
      {
        id: 'g5',
        title: 'Kaggle Competition',
        image_url: 'https://picsum.photos/seed/gallery5/400/225',
        description: 'Winning a Kaggle competition with my team'
      },
      {
        id: 'g6',
        title: 'Data Science Conference',
        image_url: 'https://picsum.photos/seed/gallery6/400/225',
        description: 'Speaking at a data science conference about machine learning'
      }
    ],
    events: [
      {
        id: 'e5',
        title: 'Kaggle Days 2025',
        date: '2025-02-15',
        location: 'New York, NY',
        description: 'Participating in Kaggle Days 2025 to compete with other data scientists'
      },
      {
        id: 'e6',
        title: 'AWS re:Invent 2025',
        date: '2025-11-30',
        location: 'Las Vegas, NV',
        description: 'Attending AWS re:Invent 2025 to learn about the latest cloud computing technologies'
      }
    ],
    news: [
      {
        id: 'n5',
        title: 'Bob Johnson wins Kaggle Grandmaster title',
        date: '2025-01-28',
        description: 'Bob Johnson was awarded the Kaggle Grandmaster title for his outstanding performance in Kaggle competitions',
        url: 'https://kaggle.com/news/2025/01/28/bob-johnson-kaggle-grandmaster'
      },
      {
        id: 'n6',
        title: 'New Book: Machine Learning for Beginners',
        date: '2025-01-20',
        description: 'Bob Johnson\'s new book "Machine Learning for Beginners" is now available on Amazon',
        url: 'https://amazon.com/dp/0987654321'
      }
    ],
    newsletter: 'https://bob-johnson.ai/newsletter',
    videos: [
      {
        id: 'v7',
        title: 'Introduction to Machine Learning',
        description: 'Learn the basics of machine learning and AI',
        url: 'https://youtube.com/watch?v=example7',
        thumbnail_url: 'https://picsum.photos/seed/video7/400/225',
        published_at: '2025-01-18T13:00:00Z',
        duration: '48:30'
      },
      {
        id: 'v8',
        title: 'Python for Data Science',
        description: 'Master Python for data science and analysis',
        url: 'https://youtube.com/watch?v=example8',
        thumbnail_url: 'https://picsum.photos/seed/video8/400/225',
        published_at: '2025-01-13T16:45:00Z',
        duration: '55:20'
      },
      {
        id: 'v9',
        title: 'Data Visualization with Python',
        description: 'Learn how to create beautiful data visualizations with Python',
        url: 'https://youtube.com/watch?v=example9',
        thumbnail_url: 'https://picsum.photos/seed/video9/400/225',
        published_at: '2025-01-08T14:00:00Z',
        duration: '42:15'
      }
    ],
    blogs: [
      {
        id: 'b7',
        title: 'How to Break into Data Science',
        description: 'A beginner\'s guide to getting started in data science',
        url: 'https://bob-johnson.ai/blog/break-into-data-science',
        thumbnail_url: 'https://picsum.photos/seed/blog7/400/225',
        published_at: '2025-01-16T10:00:00Z',
        read_time: '11 min read'
      },
      {
        id: 'b8',
        title: 'Data Science Interview Tips',
        description: 'Tips and tricks for acing data science interviews',
        url: 'https://bob-johnson.ai/blog/data-science-interviews',
        thumbnail_url: 'https://picsum.photos/seed/blog8/400/225',
        published_at: '2025-01-10T15:00:00Z',
        read_time: '13 min read'
      },
      {
        id: 'b9',
        title: 'Machine Learning Algorithms Explained',
        description: 'A comprehensive guide to popular machine learning algorithms',
        url: 'https://bob-johnson.ai/blog/machine-learning-algorithms',
        thumbnail_url: 'https://picsum.photos/seed/blog9/400/225',
        published_at: '2025-01-05T11:30:00Z',
        read_time: '15 min read'
      }
    ]
  }
];

export default function MentorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [mentor, setMentor] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    about: false,
    experience: false,
    education: false,
    skills: false,
    projects: false,
    achievements: false,
    certifications: false,
    languages: false,
    interests: false,
    hobbies: false,
    social_media: false,
    references: false,
    testimonials: false,
    portfolio: false,
    blog: false,
    gallery: false,
    events: false,
    news: false,
    videos: false,
    contact: false
  });

  useEffect(() => {
    const fetchMentor = () => {
      setIsLoading(true);
      // Find mentor by id
      const foundMentor = mentorProfiles.find(m => m.id === params.id);
      if (foundMentor) {
        setMentor(foundMentor);
      }
      setIsLoading(false);
    };

    fetchMentor();
  }, [params.id]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => router.push('/mentors')}
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ChevronLeft size={20} />
              Back to Mentors
            </button>
          </div>
          <div className="mt-8 space-y-8">
            <div className="h-64 bg-slate-200 rounded-lg animate-pulse"></div>
            <div className="h-32 bg-slate-200 rounded-lg animate-pulse"></div>
            <div className="h-16 bg-slate-200 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Mentor Not Found</h2>
            <p className="text-slate-600 mb-8">The requested mentor profile does not exist.</p>
            <button
              onClick={() => router.push('/mentors')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Mentors
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center space-x-2 mb-8">
          <button
            onClick={() => router.push('/mentors')}
            className="text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ChevronLeft size={20} />
            Back to Mentors
          </button>
        </div>

        {/* Mentor Profile */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Cover Image */}
          <div className="h-64 bg-slate-100 relative">
            <button
              onClick={handleSave}
              className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
            >
              <Heart
                size={24}
                className={isSaved ? 'fill-red-500 text-red-500' : 'text-slate-400'}
              />
            </button>
          </div>

          {/* Profile Info */}
          <div className="px-8 -mt-16 mb-8">
            {/* Avatar */}
            <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-slate-200 mb-6">
              <div className="w-full h-full bg-slate-300 flex items-center justify-center">
                <span className="text-slate-600 font-bold text-2xl">
                  {mentor.user?.first_name?.[0] || 'M'}
                </span>
              </div>
            </div>

            {/* Name & Role */}
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-slate-900">
                {mentor.user?.first_name} {mentor.user?.last_name}
              </h1>
              <p className="text-lg text-slate-600">{mentor.headline}</p>
            </div>

            {/* Company & Experience */}
            <div className="flex flex-wrap gap-4 mb-6">
              <span className="bg-slate-100 px-3 py-1 rounded-lg text-slate-700">
                {mentor.company}
              </span>
              <span className="bg-slate-100 px-3 py-1 rounded-lg text-slate-700">
                {mentor.years_of_experience} years experience
              </span>
              <span className="bg-slate-100 px-3 py-1 rounded-lg text-slate-700 flex items-center gap-1">
                <Star size={16} className="text-yellow-400" />
                {mentor.avg_rating.toFixed(1)} ({mentor.total_sessions} sessions)
              </span>
            </div>

            {/* Bio */}
            <div className="mb-8">
              <p className={`text-slate-700 leading-relaxed ${!expandedSections.about && 'line-clamp-3'}`}>
                {mentor.bio}
              </p>
              {mentor.bio.length > 200 && (
                <button
                  onClick={() => toggleSection('about')}
                  className="text-blue-600 hover:text-blue-800 transition-colors mt-2 inline-flex items-center gap-1"
                >
                  {expandedSections.about ? 'Show less' : 'See more'}
                  {expandedSections.about ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Book a Session
              </button>
              <button className="px-6 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-2">
                <ExternalLink size={18} />
                View LinkedIn
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-t border-slate-200 px-8 py-6">
            <div className="flex space-x-8 mb-8">
              <button className="py-2 px-4 border-b-2 border-blue-600 text-blue-600 font-medium">
                About
              </button>
              <button className="py-2 px-4 text-slate-500 hover:text-slate-700 transition-colors">
                Services
              </button>
              <button className="py-2 px-4 text-slate-500 hover:text-slate-700 transition-colors">
                Reviews
              </button>
              <button className="py-2 px-4 text-slate-500 hover:text-slate-700 transition-colors">
                Blogs
              </button>
              <button className="py-2 px-4 text-slate-500 hover:text-slate-700 transition-colors">
                Videos
              </button>
            </div>

            {/* About Content */}
            <div className="space-y-8">
              {/* Experience */}
              {mentor.experience && (
                <div className="border border-slate-200 rounded-lg p-6 bg-blue-50">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-slate-900">Experience</h2>
                    {mentor.experience.length > 3 && (
                      <button
                        onClick={() => toggleSection('experience')}
                        className="text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-1"
                      >
                        {expandedSections.experience ? 'Show less' : 'See more'}
                        {expandedSections.experience ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    )}
                  </div>
                  <div className="space-y-4">
                    {mentor.experience.slice(0, expandedSections.experience ? mentor.experience.length : 3).map((exp: string, index: number) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="mt-2 w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                        <p className="text-slate-700">{exp}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {mentor.education && (
                <div className="border border-slate-200 rounded-lg p-6 bg-green-50">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-slate-900">Education</h2>
                    {mentor.education.length > 3 && (
                      <button
                        onClick={() => toggleSection('education')}
                        className="text-green-600 hover:text-green-800 transition-colors inline-flex items-center gap-1"
                      >
                        {expandedSections.education ? 'Show less' : 'See more'}
                        {expandedSections.education ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    )}
                  </div>
                  <div className="space-y-4">
                    {mentor.education.slice(0, expandedSections.education ? mentor.education.length : 3).map((edu: string, index: number) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="mt-2 w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                        <p className="text-slate-700">{edu}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {mentor.expertise_tags && (
                <div className="border border-slate-200 rounded-lg p-6 bg-purple-50">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-slate-900">Skills</h2>
                    {mentor.expertise_tags.length > 6 && (
                      <button
                        onClick={() => toggleSection('skills')}
                        className="text-purple-600 hover:text-purple-800 transition-colors inline-flex items-center gap-1"
                      >
                        {expandedSections.skills ? 'Show less' : 'See more'}
                        {expandedSections.skills ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {mentor.expertise_tags.slice(0, expandedSections.skills ? mentor.expertise_tags.length : 6).map((skill: string, index: number) => (
                      <span key={index} className="bg-purple-100 px-3 py-1 rounded-full text-purple-700 text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {mentor.projects && (
                <div className="border border-slate-200 rounded-lg p-6 bg-yellow-50">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-slate-900">Projects</h2>
                    {mentor.projects.length > 3 && (
                      <button
                        onClick={() => toggleSection('projects')}
                        className="text-yellow-600 hover:text-yellow-800 transition-colors inline-flex items-center gap-1"
                      >
                        {expandedSections.projects ? 'Show less' : 'See more'}
                        {expandedSections.projects ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    )}
                  </div>
                  <div className="space-y-4">
                    {mentor.projects.slice(0, expandedSections.projects ? mentor.projects.length : 3).map((project: any, index: number) => (
                      <div key={index} className="bg-white p-4 rounded-lg border border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">{project.title}</h3>
                        <p className="text-slate-600 text-sm mb-2">{project.description}</p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {project.technologies.map((tech: string, techIndex: number) => (
                            <span key={techIndex} className="bg-yellow-100 px-2 py-1 rounded text-yellow-700 text-xs">
                              {tech}
                            </span>
                          ))}
                        </div>
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-yellow-600 hover:text-yellow-800 text-sm inline-flex items-center gap-1"
                        >
                          View Project <ExternalLink size={14} />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Achievements */}
              {mentor.achievements && (
                <div className="border border-slate-200 rounded-lg p-6 bg-red-50">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-slate-900">Achievements</h2>
                    {mentor.achievements.length > 3 && (
                      <button
                        onClick={() => toggleSection('achievements')}
                        className="text-red-600 hover:text-red-800 transition-colors inline-flex items-center gap-1"
                      >
                        {expandedSections.achievements ? 'Show less' : 'See more'}
                        {expandedSections.achievements ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {mentor.achievements.slice(0, expandedSections.achievements ? mentor.achievements.length : 3).map((achievement: string, index: number) => (
                      <div key={index} className="bg-white px-3 py-2 rounded-lg border border-slate-200">
                        <p className="text-slate-700">{achievement}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {mentor.certifications && (
                <div className="border border-slate-200 rounded-lg p-6 bg-indigo-50">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-slate-900">Certifications</h2>
                    {mentor.certifications.length > 3 && (
                      <button
                        onClick={() => toggleSection('certifications')}
                        className="text-indigo-600 hover:text-indigo-800 transition-colors inline-flex items-center gap-1"
                      >
                        {expandedSections.certifications ? 'Show less' : 'See more'}
                        {expandedSections.certifications ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {mentor.certifications.slice(0, expandedSections.certifications ? mentor.certifications.length : 3).map((cert: string, index: number) => (
                      <div key={index} className="bg-white px-3 py-2 rounded-lg border border-slate-200">
                        <p className="text-slate-700">{cert}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Languages */}
              {mentor.languages && (
                <div className="border border-slate-200 rounded-lg p-6 bg-pink-50">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-slate-900">Languages</h2>
                    {mentor.languages.length > 3 && (
                      <button
                        onClick={() => toggleSection('languages')}
                        className="text-pink-600 hover:text-pink-800 transition-colors inline-flex items-center gap-1"
                      >
                        {expandedSections.languages ? 'Show less' : 'See more'}
                        {expandedSections.languages ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {mentor.languages.slice(0, expandedSections.languages ? mentor.languages.length : 3).map((language: string, index: number) => (
                      <span key={index} className="bg-pink-100 px-3 py-1 rounded-full text-pink-700 text-sm">
                        {language}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Interests */}
              {mentor.interests && (
                <div className="border border-slate-200 rounded-lg p-6 bg-teal-50">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-slate-900">Interests</h2>
                    {mentor.interests.length > 3 && (
                      <button
                        onClick={() => toggleSection('interests')}
                        className="text-teal-600 hover:text-teal-800 transition-colors inline-flex items-center gap-1"
                      >
                        {expandedSections.interests ? 'Show less' : 'See more'}
                        {expandedSections.interests ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {mentor.interests.slice(0, expandedSections.interests ? mentor.interests.length : 3).map((interest: string, index: number) => (
                      <span key={index} className="bg-teal-100 px-3 py-1 rounded-full text-teal-700 text-sm">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Hobbies */}
              {mentor.hobbies && (
                <div className="border border-slate-200 rounded-lg p-6 bg-orange-50">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-slate-900">Hobbies</h2>
                    {mentor.hobbies.length > 3 && (
                      <button
                        onClick={() => toggleSection('hobbies')}
                        className="text-orange-600 hover:text-orange-800 transition-colors inline-flex items-center gap-1"
                      >
                        {expandedSections.hobbies ? 'Show less' : 'See more'}
                        {expandedSections.hobbies ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {mentor.hobbies.slice(0, expandedSections.hobbies ? mentor.hobbies.length : 3).map((hobby: string, index: number) => (
                      <span key={index} className="bg-orange-100 px-3 py-1 rounded-full text-orange-700 text-sm">
                        {hobby}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Media */}
              {mentor.social_media && (
                <div className="border border-slate-200 rounded-lg p-6 bg-cyan-50">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-slate-900">Social Media</h2>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {Object.entries(mentor.social_media).map(([platform, url]: [string, any]) => (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-2"
                      >
                        <span className="text-slate-700 capitalize">{platform}</span>
                        <ExternalLink size={16} />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact */}
              {mentor.contact && (
                <div className="border border-slate-200 rounded-lg p-6 bg-lime-50">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-slate-900">Contact</h2>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-lime-100 flex items-center justify-center">
                        <span className="text-lime-700 font-medium">@</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Email</p>
                        <p className="text-sm text-slate-600">{mentor.contact.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-lime-100 flex items-center justify-center">
                        <span className="text-lime-700 font-medium">📞</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Phone</p>
                        <p className="text-sm text-slate-600">{mentor.contact.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-lime-100 flex items-center justify-center">
                        <span className="text-lime-700 font-medium">📍</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Location</p>
                        <p className="text-sm text-slate-600">{mentor.contact.location}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* References */}
              {mentor.references && (
                <div className="border border-slate-200 rounded-lg p-6 bg-emerald-50">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-slate-900">References</h2>
                    {mentor.references.length > 3 && (
                      <button
                        onClick={() => toggleSection('references')}
                        className="text-emerald-600 hover:text-emerald-800 transition-colors inline-flex items-center gap-1"
                      >
                        {expandedSections.references ? 'Show less' : 'See more'}
                        {expandedSections.references ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    )}
                  </div>
                  <div className="space-y-4">
                    {mentor.references.slice(0, expandedSections.references ? mentor.references.length : 3).map((reference: any, index: number) => (
                      <div key={index} className="bg-white p-4 rounded-lg border border-slate-200">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                            <span className="text-emerald-700 font-medium">{reference.name[0]}</span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{reference.name}</p>
                            <p className="text-xs text-slate-500">{reference.role}, {reference.company}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500 text-sm">📧</span>
                            <p className="text-sm text-slate-600">{reference.email}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500 text-sm">📞</span>
                            <p className="text-sm text-slate-600">{reference.phone}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Testimonials */}
              {mentor.testimonials && (
                <div className="border border-slate-200 rounded-lg p-6 bg-gray-50">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-slate-900">Testimonials</h2>
                    {mentor.testimonials.length > 3 && (
                      <button
                        onClick={() => toggleSection('testimonials')}
                        className="text-gray-600 hover:text-gray-800 transition-colors inline-flex items-center gap-1"
                      >
                        {expandedSections.testimonials ? 'Show less' : 'See more'}
                        {expandedSections.testimonials ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    )}
                  </div>
                  <div className="space-y-4">
                    {mentor.testimonials.slice(0, expandedSections.testimonials ? mentor.testimonials.length : 3).map((testimonial: any, index: number) => (
                      <div key={index} className="bg-white p-4 rounded-lg border border-slate-200">
                        <p className="text-slate-600 text-sm italic mb-3">"{testimonial.content}"</p>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                            <span className="text-slate-600 font-medium">{testimonial.name[0]}</span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{testimonial.name}</p>
                            <p className="text-xs text-slate-500">{testimonial.role}, {testimonial.company}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Gallery */}
              {mentor.gallery && (
                <div className="border border-slate-200 rounded-lg p-6 bg-rose-50">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-slate-900">Gallery</h2>
                    {mentor.gallery.length > 3 && (
                      <button
                        onClick={() => toggleSection('gallery')}
                        className="text-rose-600 hover:text-rose-800 transition-colors inline-flex items-center gap-1"
                      >
                        {expandedSections.gallery ? 'Show less' : 'See more'}
                        {expandedSections.gallery ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mentor.gallery.slice(0, expandedSections.gallery ? mentor.gallery.length : 3).map((item: any, index: number) => (
                      <div key={index} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                        <div className="relative h-48">
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                          <p className="text-slate-600 text-sm">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Events */}
              {mentor.events && (
                <div className="border border-slate-200 rounded-lg p-6 bg-violet-50">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-slate-900">Events</h2>
                    {mentor.events.length > 3 && (
                      <button
                        onClick={() => toggleSection('events')}
                        className="text-violet-600 hover:text-violet-800 transition-colors inline-flex items-center gap-1"
                      >
                        {expandedSections.events ? 'Show less' : 'See more'}
                        {expandedSections.events ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    )}
                  </div>
                  <div className="space-y-4">
                    {mentor.events.slice(0, expandedSections.events ? mentor.events.length : 3).map((event: any, index: number) => (
                      <div key={index} className="bg-white p-4 rounded-lg border border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">{event.title}</h3>
                        <div className="flex flex-wrap gap-3 text-slate-500 text-sm mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            {new Date(event.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-slate-500 text-sm">📍</span>
                            {event.location}
                          </div>
                        </div>
                        <p className="text-slate-600 text-sm">{event.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* News */}
              {mentor.news && (
                <div className="border border-slate-200 rounded-lg p-6 bg-fuchsia-50">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-slate-900">News</h2>
                    {mentor.news.length > 3 && (
                      <button
                        onClick={() => toggleSection('news')}
                        className="text-fuchsia-600 hover:text-fuchsia-800 transition-colors inline-flex items-center gap-1"
                      >
                        {expandedSections.news ? 'Show less' : 'See more'}
                        {expandedSections.news ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    )}
                  </div>
                  <div className="space-y-4">
                    {mentor.news.slice(0, expandedSections.news ? mentor.news.length : 3).map((newsItem: any, index: number) => (
                      <div key={index} className="bg-white p-4 rounded-lg border border-slate-200">
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">{newsItem.title}</h3>
                        <div className="flex items-center gap-3 text-slate-500 text-sm mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            {new Date(newsItem.date).toLocaleDateString()}
                          </div>
                        </div>
                        <p className="text-slate-600 text-sm mb-3">{newsItem.description}</p>
                        <a
                          href={newsItem.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-fuchsia-600 hover:text-fuchsia-800 text-sm inline-flex items-center gap-1"
                        >
                          Read More <ExternalLink size={14} />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Newsletter */}
              {mentor.newsletter && (
                <div className="border border-slate-200 rounded-lg p-6 bg-indigo-50">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-slate-900">Newsletter</h2>
                  </div>
                  <p className="text-slate-700 mb-4">Subscribe to {mentor.user?.first_name}'s newsletter for weekly updates and insights.</p>
                  <button
                    onClick={() => window.open(mentor.newsletter, '_blank')}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Subscribe Now
                  </button>
                </div>
              )}

              {/* Blogs */}
              {mentor.blogs && mentor.blogs.length > 0 && (
                <div className="border border-slate-200 rounded-lg p-6 bg-yellow-50">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-slate-900">Blogs</h2>
                    {mentor.blogs.length > 3 && (
                      <button
                        onClick={() => toggleSection('blog')}
                        className="text-yellow-600 hover:text-yellow-800 transition-colors inline-flex items-center gap-1"
                      >
                        {expandedSections.blog ? 'Show less' : 'See more'}
                        {expandedSections.blog ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {mentor.blogs.slice(0, expandedSections.blog ? mentor.blogs.length : 3).map((blog: any, index: number) => (
                      <div key={index} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                        <div className="relative h-48">
                          <img
                            src={blog.thumbnail_url}
                            alt={blog.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-slate-900 mb-2">{blog.title}</h3>
                          <p className="text-slate-600 text-sm mb-3">{blog.description}</p>
                          <div className="flex items-center gap-3 text-slate-500 text-sm">
                            <div className="flex items-center gap-1">
                              <Calendar size={14} />
                              {new Date(blog.published_at).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock size={14} />
                              {blog.read_time}
                            </div>
                          </div>
                          <button
                            onClick={() => window.open(blog.url, '_blank')}
                            className="mt-3 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                          >
                            Read More
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Videos */}
              {mentor.videos && mentor.videos.length > 0 && (
                <div className="border border-slate-200 rounded-lg p-6 bg-red-50">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-slate-900">Videos</h2>
                    {mentor.videos.length > 3 && (
                      <button
                        onClick={() => toggleSection('videos')}
                        className="text-red-600 hover:text-red-800 transition-colors inline-flex items-center gap-1"
                      >
                        {expandedSections.videos ? 'Show less' : 'See more'}
                        {expandedSections.videos ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {mentor.videos.slice(0, expandedSections.videos ? mentor.videos.length : 3).map((video: any, index: number) => (
                      <div key={index} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                        <div className="relative aspect-video">
                          <img
                            src={video.thumbnail_url}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-sm">
                            {video.duration}
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-slate-900 mb-2">{video.title}</h3>
                          <p className="text-slate-600 text-sm mb-3">{video.description}</p>
                          <div className="flex items-center gap-3 text-slate-500 text-sm">
                            <div className="flex items-center gap-1">
                              <Calendar size={14} />
                              {new Date(video.published_at).toLocaleDateString()}
                            </div>
                          </div>
                          <button
                            onClick={() => window.open(video.url, '_blank')}
                            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                          >
                            Watch Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Services */}
        {mentor.services && mentor.services.length > 0 && (
          <div className="mt-12 border border-slate-200 rounded-lg p-6 bg-white">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mentor.services.map((service: any, index: number) => (
                <div key={index} className="bg-slate-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {service.service_type.replace(/_/g, ' ')}
                  </h3>
                  <p className="text-slate-600 text-sm mb-4">{service.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                      <Clock size={14} />
                      {service.duration_minutes} minutes
                    </div>
                    <div className="text-lg font-bold text-slate-900">
                      ${(service.price_override || mentor.session_price / 100).toFixed(2)}
                    </div>
                  </div>
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    Book Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Similar Mentors */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Similar Mentors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentorProfiles
              .filter(m => m.id !== mentor.id)
              .slice(0, 3)
              .map((similarMentor) => (
                <MentorCard key={similarMentor.id} mentor={similarMentor} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
