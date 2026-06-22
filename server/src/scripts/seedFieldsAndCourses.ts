import 'dotenv/config';
import mongoose from 'mongoose';
import { Course } from '../models/Course';
import { Field } from '../models/Field';
import { User } from '../models/User';

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@opencourse.dev';

const fields = [
    {
        name: 'Web Development',
        slug: 'web-development',
        description: 'Frontend, backend, and full-stack application development.',
    },
    {
        name: 'Data Science',
        slug: 'data-science',
        description: 'Data analysis, visualization, statistics, and machine learning foundations.',
    },
    {
        name: 'Cloud Computing',
        slug: 'cloud-computing',
        description: 'Cloud platforms, deployment, infrastructure, and scalable systems.',
    },
    {
        name: 'Cybersecurity',
        slug: 'cybersecurity',
        description: 'Security fundamentals, defensive practices, and secure engineering.',
    },
    {
        name: 'Artificial Intelligence',
        slug: 'artificial-intelligence',
        description: 'AI concepts, applied machine learning, and intelligent application design.',
    },
];

const courses = [
    {
        title: 'Full Stack Web Development Fundamentals',
        slug: 'full-stack-web-development-fundamentals',
        description:
            'Learn how modern web apps are built from UI components to APIs, databases, authentication, and deployment.',
        fieldSlug: 'web-development',
        level: 'beginner' as const,
        thumbnail:
            'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    },
    {
        title: 'Data Science Foundations',
        slug: 'data-science-foundations',
        description:
            'Build a practical foundation in data cleaning, exploratory analysis, visualization, and basic predictive modeling.',
        fieldSlug: 'data-science',
        level: 'beginner' as const,
        thumbnail:
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    },
    {
        title: 'Cloud Deployment Essentials',
        slug: 'cloud-deployment-essentials',
        description:
            'Understand cloud services, environment configuration, deployment workflows, monitoring, and production basics.',
        fieldSlug: 'cloud-computing',
        level: 'beginner' as const,
        thumbnail:
            'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    },
    {
        title: 'Cybersecurity Basics for Developers',
        slug: 'cybersecurity-basics-for-developers',
        description:
            'Learn core security concepts every developer should know, including auth, input validation, secure APIs, and common attacks.',
        fieldSlug: 'cybersecurity',
        level: 'beginner' as const,
        thumbnail:
            'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
    },
    {
        title: 'Practical AI for Beginners',
        slug: 'practical-ai-for-beginners',
        description:
            'Explore AI fundamentals, prompt-based workflows, model behavior, and how to build useful AI-powered features.',
        fieldSlug: 'artificial-intelligence',
        level: 'beginner' as const,
        thumbnail:
            'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
    },
];

async function main() {
    if (!MONGO_URI) {
        console.error('MONGO_URI or MONGODB_URI is required.');
        process.exit(1);
    }

    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const admin = await User.findOne({ email: ADMIN_EMAIL.toLowerCase(), role: 'admin' });
    if (!admin) {
        throw new Error(`Admin user not found for ${ADMIN_EMAIL}`);
    }

    const fieldBySlug = new Map<string, mongoose.Types.ObjectId>();

    for (const field of fields) {
        const savedField = await Field.findOneAndUpdate({ slug: field.slug }, field, {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
        });
        fieldBySlug.set(savedField.slug, savedField._id as mongoose.Types.ObjectId);
        console.log(`Field ready: ${savedField.name}`);
    }

    for (const course of courses) {
        const fieldId = fieldBySlug.get(course.fieldSlug);
        if (!fieldId) {
            throw new Error(`Missing field for course "${course.title}"`);
        }

        const savedCourse = await Course.findOneAndUpdate(
            { slug: course.slug },
            {
                title: course.title,
                slug: course.slug,
                description: course.description,
                field: fieldId,
                level: course.level,
                thumbnail: course.thumbnail,
                isPublished: true,
                createdBy: admin._id,
            },
            {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true,
                runValidators: true,
            },
        );

        console.log(`Course ready: ${savedCourse.title}`);
    }

    await mongoose.disconnect();
    console.log('Done.');
}

main().catch(async (error) => {
    console.error('Seed failed:', error);
    await mongoose.disconnect();
    process.exit(1);
});
