export const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`

export const site = {
  name: 'Tanmay Jain',
  location: 'Jaipur, India',
  email: 'tanmayj209@gmail.com',
  profile: { photo: '/me.jpg', cutout: 'assets-src/me-cutout.png', resume: '/resume.pdf' },
  openToWorkTab: true,
  links: {
    github: 'https://github.com/tanmayyyyayyy',
    linkedin: 'https://www.linkedin.com/in/tanmayyyayyy',
    leetcode: 'https://leetcode.com/u/VEfDeE2ALW/',
  },
  roles: ['AI/ML Developer', 'Full-Stack Developer', 'Builder'],
  intro: 'I build AI-powered products, full-stack applications, and intelligent systems that turn ideas into usable software.',
  about: "Hi, I'm Tanmay - a B.Tech CSE student in Jaipur specializing in AI/ML. I build AI-powered products and full-stack apps that blend intelligent systems with real-world workflows. Right now I'm exploring LangChain, LangGraph, Firebase and Google Cloud - and I love taking an idea from concept, to code, to deployment.",
  stack: ['C++', 'Python', 'JavaScript', 'TypeScript', 'Java', 'React', 'Vite', 'Tailwind CSS', 'HTML5', 'CSS3', 'Node.js', 'Express', 'FastAPI', 'MongoDB', 'PostgreSQL', 'Spring Boot', 'LangChain', 'LangGraph', 'Gemini', 'Firebase', 'Google Cloud'],
  projects: [
    { name: 'MORPHOS', description: 'An AI system designed to investigate problems through structured experimentation.', stack: 'LangChain, LangGraph, TypeScript, Firebase, AI APIs', type: 'AI PLATFORM', year: '', status: '', repoUrl: '', liveUrl: 'https://morphos-agent.web.app', image: '/projects/morphos.jpg', imageAlt: 'MORPHOS autonomous AI experimentation platform', isPlaceholder: false },
    { name: 'Micro Culture', description: 'An AI-powered social platform where communities develop their own rituals, language, identity and evolving memory.', stack: 'React, Node.js, Express, MongoDB, Groq, Tailwind', type: 'FULL-STACK / AI', year: '', status: '', repoUrl: '', liveUrl: 'https://micro-culture.onrender.com', image: '/projects/micro-culture.jpg', imageAlt: 'Micro Culture community landing page', isPlaceholder: false },
    { name: 'Kairova', description: 'An AI-focused product exploring intelligent workflows and modern web application architecture.', stack: 'React, JavaScript, AI, Full Stack', type: 'AI PRODUCT', year: '', status: '', repoUrl: '', liveUrl: '', image: '/projects/kairova.jpg', imageAlt: 'Kairova AI workflow product concept', isPlaceholder: true },
    { name: 'Smart Expense Tracker', description: 'A full-stack expense management application with intelligent tracking and visualization.', stack: 'TypeScript, React, Node.js, Database', type: 'WEB APPLICATION', year: '', status: '', repoUrl: '', liveUrl: 'https://smart-expense-tracker-1-2lsb.onrender.com', image: '/projects/smart-expense-tracker.jpg', imageAlt: 'Smart Expense Tracker financial dashboard', isPlaceholder: false },
    { name: 'Quick-Bite', description: 'A Java-based application focused on food ordering and application workflows.', stack: 'Java', type: 'APPLICATION', year: '', status: '', repoUrl: '', liveUrl: '', image: '/projects/quick-bite.jpg', imageAlt: 'Quick-Bite food ordering application concept', isPlaceholder: true },
  ],
  lab: [
    { title: 'Agentic AI experiments', body: 'Exploring how LangChain, LangGraph, Firebase and Google Cloud can power useful, goal-driven systems.', label: '01 / INTELLIGENCE' },
    { title: 'DSA in C++', body: 'Daily problem-solving practice: building strong fundamentals one deliberate solution at a time.', label: '02 / PRACTICE' },
  ],
  skills: [
    { title: 'AI / ML', body: 'Python, LangChain, LangGraph, Gemini' },
    { title: 'Frontend', body: 'React, Vite, Tailwind CSS, HTML5, CSS3' },
    { title: 'Backend & Database', body: 'Node.js, Express, FastAPI, Spring Boot, MongoDB, PostgreSQL' },
    { title: 'Languages', body: 'C++, Python, JavaScript, TypeScript, Java' },
    { title: 'Cloud & Tools', body: 'Firebase, Google Cloud, Git' },
  ],
}
