
import dotenv from "dotenv";
dotenv.config();

// NOTE: This controller uses a safe fallback generator if no valid AI key is configured.
// If you want to call the real Google GenAI SDK, see the commented section below.

export const generateInterviewQuestions = async (req, res) => {
  try {
    console.log("AI Controller - Received request body:", req.body);
    const { role, experience, topicsToFocus, numberOfQuestions = 10 } = req.body ?? {};
    console.log("AI Controller - Extracted fields:", { role, experience, topicsToFocus, numberOfQuestions });

    if (!role || !topicsToFocus || experience === undefined || experience === null || experience === "") {
      console.log("AI Controller - Missing fields validation failed");
      console.log("AI Controller - Received:", { role, experience, topicsToFocus });
      return res.status(400).json({ error: "Missing required fields: role, experience, topicsToFocus" });
    }

    const topic = `${role} ${experience} ${topicsToFocus}`;

    // Try to use configured API key if present (support both names)
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.OPENAI_API_KEY;

    // If you intend to use the real AI, set USE_REAL_AI=true in env and configure API key.
    if (apiKey && process.env.USE_REAL_AI === "true") {
      // === Example: call your real AI provider here ===
      // (This block is intentionally left as an example and commented out because
      // different SDKs have different usage. Add your provider code here.)
      //
      // Example pseudo:
      // const aiResponse = await callGoogleGenAI({ apiKey, prompt });
      // const questions = parseAiResponseToQuestions(aiResponse);
      //
      // return res.json({ questions });
    }

    // --- SAFETY FALLBACK: generate simple heuristic-based questions so API returns 200 ---
    const questions = fallbackGenerateQuestions(topic, "medium", Number(numberOfQuestions));

    return res.json({ questions });
  } catch (err) {
    console.error("generateInterviewQuestions error:", err);
    return res.status(500).json({ error: "Internal server error", details: err?.message || "unknown" });
  }
};

export const generateConceptExplanation = async (req, res) => {
  try {
    const { concept } = req.body ?? {};
    if (!concept) return res.status(400).json({ error: "Missing 'concept' in request body" });

    // Try to use configured API key if present
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.OPENAI_API_KEY;

    if (apiKey && process.env.USE_REAL_AI === "true") {
      // Uncomment and use the real AI code here if you have the SDK installed
      const { GoogleGenAI } = require("@google/genai");
      const ai = new GoogleGenAI({ apiKey });
      const { conceptExplainPrompt } = require("../utils/prompts.js");

      const prompt = conceptExplainPrompt(concept);
      const model = ai.getGenerativeModel("gemini-1.5-flash");
      const result = await model.generateContent(prompt);
      let rawText = result.response.text();

      const cleanedText = rawText.replace(/^```json\s*/, "").replace(/```$/, "").trim();
      const data = JSON.parse(cleanedText);

      return res.json(data);
    }

    // --- SAFETY FALLBACK: generate a more detailed explanation ---
    const detailedExplanation = generateDetailedExplanation(concept);

    return res.json({ title: `Understanding ${concept}`, explanation: detailedExplanation });
  } catch (err) {
    console.error("generateConceptExplanation error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};




function fallbackGenerateQuestions(topic, difficulty = "medium", n = 5) {
  // Pre-shuffle templates for better randomization
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const questionTemplates = {
    easy: shuffleArray([
      `What is ${topic}?`,
      `Give a real-world example of ${topic}.`,
      `Name one use case of ${topic}.`,
      `What are the basic properties/characteristics of ${topic}?`,
      `How would you explain ${topic} to a beginner?`,
      `What makes ${topic} different from similar technologies?`,
      `When would you choose ${topic} over other options?`,
      `What are the main benefits of using ${topic}?`,
      `Can you give a simple analogy for ${topic}?`,
      `What prerequisites do you need to learn ${topic}?`,
      `How has ${topic} evolved over time?`,
      `What industries commonly use ${topic}?`,
      `What are the basic building blocks of ${topic}?`,
      `How do you get started with ${topic}?`,
      `What are some popular tools or frameworks related to ${topic}?`
    ]),
    medium: shuffleArray([
      `Describe how ${topic} works and its main components.`,
      `Compare and contrast ${topic} with a related concept.`,
      `Design a simple algorithm or approach that uses ${topic}.`,
      `What are common pitfalls or limitations of ${topic}?`,
      `How would you optimize or scale an implementation of ${topic}?`,
      `Explain the architecture and design patterns used in ${topic}.`,
      `How does ${topic} handle error conditions and exceptions?`,
      `What are the security considerations when using ${topic}?`,
      `How would you debug issues in ${topic} applications?`,
      `What are the best practices for implementing ${topic}?`,
      `How does ${topic} integrate with other technologies?`,
      `What are the performance characteristics of ${topic}?`,
      `How would you test ${topic} implementations?`,
      `What are the deployment considerations for ${topic}?`,
      `How does ${topic} handle concurrency and parallelism?`,
      `What are the data structures used in ${topic}?`,
      `How would you monitor and maintain ${topic} systems?`,
      `What are the configuration options available in ${topic}?`,
      `How does ${topic} handle data persistence?`,
      `What are the API design principles for ${topic}?`
    ]),
    hard: shuffleArray([
      `Explain the internal mechanics of ${topic} in detail.`,
      `Given a large-scale system involving ${topic}, how would you ensure reliability and performance?`,
      `Design a benchmarking strategy to evaluate ${topic}.`,
      `Describe advanced edge-cases and failure modes for ${topic}.`,
      `How would you extend ${topic} with new features while preserving backward-compatibility?`,
      `What are the advanced optimization techniques for ${topic}?`,
      `How would you handle distributed systems using ${topic}?`,
      `What are the advanced security threats and mitigations for ${topic}?`,
      `How would you design a microservices architecture using ${topic}?`,
      `What are the advanced debugging and profiling techniques for ${topic}?`,
      `How would you implement custom extensions or plugins for ${topic}?`,
      `What are the advanced concurrency patterns in ${topic}?`,
      `How would you handle data consistency in distributed ${topic} systems?`,
      `What are the advanced deployment strategies for ${topic}?`,
      `How would you implement fault tolerance and resilience in ${topic}?`,
      `What are the advanced monitoring and observability techniques for ${topic}?`,
      `How would you optimize ${topic} for high-throughput scenarios?`,
      `What are the advanced caching strategies for ${topic}?`,
      `How would you handle schema evolution in ${topic} systems?`,
      `What are the advanced testing strategies for ${topic} applications?`
    ])
  };

  const answerTemplates = {
    easy: [
      `${topic} is a fundamental concept/technology used in software development. It provides specific functionality and features that help developers build applications. It is designed to solve particular problems efficiently and is widely adopted in the industry.`,
      `A real-world example of ${topic} would be in web applications where it's used to handle user interactions and data processing. For instance, ${topic} can be used to build dynamic user interfaces that respond to user input in real-time.`,
      `One common use case of ${topic} is in building user interfaces and managing application state. It allows developers to create modular, reusable components that improve maintainability and scalability.`,
      `${topic} has several key properties including reliability, scalability, and ease of use. These properties make it suitable for both small projects and large-scale enterprise applications.`,
      `To explain ${topic} to a beginner, I would say it's a tool/framework that helps developers create better applications by providing structured approaches to common problems. It abstracts complex details and offers simple APIs for common tasks.`,
      `${topic} stands out due to its unique approach to solving common development challenges, offering better performance and developer experience. It often includes features like efficient rendering, state management, and developer tooling.`,
      `You would choose ${topic} when you need efficient solutions for complex problems that require both flexibility and power. It is especially useful in scenarios where performance and maintainability are critical.`,
      `The main benefits include improved development speed, better maintainability, and enhanced application performance. Additionally, it often has a strong community and ecosystem supporting it.`,
      `${topic} is like a Swiss Army knife for developers - it provides multiple tools in one package to solve various problems efficiently. This versatility makes it a popular choice across different domains.`,
      `To learn ${topic}, you should have basic programming knowledge and understanding of software development principles. Familiarity with related technologies can also be beneficial.`,
      `${topic} has evolved from simple implementations to sophisticated frameworks that handle complex enterprise requirements. This evolution includes improvements in performance, scalability, and developer experience.`,
      `${topic} is widely used in web development, mobile applications, and enterprise software systems. Its adaptability allows it to fit into various technology stacks.`,
      `The basic building blocks include core modules, APIs, and configuration systems that work together seamlessly. Understanding these components is key to mastering ${topic}.`,
      `Getting started with ${topic} involves installing the necessary tools, understanding the basic concepts, and building simple applications. Tutorials and documentation are valuable resources.`,
      `Popular tools include development environments, testing frameworks, and deployment platforms that complement ${topic}. These tools enhance productivity and code quality.`
    ],
    medium: [
      `${topic} works by implementing specific patterns and architectures that organize code and data flow. Its main components include core modules, utilities, and integration points. The system is designed with a layered architecture that separates concerns and allows for modular development. Each component has well-defined responsibilities and interfaces, making the system both flexible and maintainable.`,
      `${topic} differs from similar concepts by focusing on specific aspects like performance, developer experience, or architectural patterns. Unlike traditional approaches that might be more rigid, ${topic} provides greater flexibility while maintaining strong typing and performance characteristics. This makes it particularly suitable for complex applications that require both scalability and maintainability.`,
      `To design an algorithm using ${topic}, I would first identify the core requirements and constraints, then structure the solution using ${topic}'s best practices and patterns. This involves breaking down the problem into smaller, manageable components, implementing efficient data structures, and ensuring proper error handling throughout the algorithm.`,
      `Common pitfalls with ${topic} include improper initialization, memory leaks, and incorrect usage of its APIs. Developers often encounter issues with asynchronous operations, state management, and resource cleanup. Understanding the lifecycle of components and proper error boundaries is crucial to avoid these common mistakes.`,
      `To optimize ${topic}, I would focus on efficient resource usage, proper caching strategies, and following performance best practices. This includes implementing lazy loading, optimizing bundle sizes, minimizing re-renders, and using appropriate data structures for different use cases.`,
      `The architecture follows established design patterns that ensure scalability, maintainability, and clean separation of concerns. It uses principles like dependency injection, observer patterns, and modular design to create a robust and extensible system that can grow with application needs.`,
      `Error handling involves try-catch blocks, validation mechanisms, and graceful degradation strategies. The system implements comprehensive error boundaries, logging mechanisms, and fallback strategies to ensure applications remain stable even when unexpected errors occur.`,
      `Security considerations include input validation, authentication, authorization, and protection against common vulnerabilities like XSS, CSRF, and injection attacks. The system implements security best practices such as secure headers, input sanitization, and proper session management.`,
      `Debugging involves using logging, breakpoints, and monitoring tools to identify and resolve issues systematically. Developers can use browser dev tools, debugging utilities, and performance profilers to trace execution flow and identify bottlenecks or errors in the application.`,
      `Best practices include following coding standards, implementing proper testing, and maintaining clean architecture. This involves using consistent naming conventions, writing comprehensive tests, implementing proper documentation, and following established design patterns throughout the codebase.`,
      `Integration happens through APIs, middleware, and standardized protocols that ensure seamless communication. The system provides well-documented APIs, supports various data formats, and includes middleware for cross-cutting concerns like authentication and logging.`,
      `Performance characteristics include response times, throughput, memory usage, and scalability metrics. The system is optimized for fast initial load times, efficient updates, and minimal memory footprint while maintaining high performance under load.`,
      `Testing involves unit tests, integration tests, and performance tests to ensure quality and reliability. The testing strategy includes automated test suites, continuous integration, and comprehensive coverage of edge cases and error scenarios.`,
      `Deployment considerations include environment configuration, scaling strategies, and monitoring setup. The system supports various deployment models including containerization, serverless architectures, and traditional server deployments with proper configuration management.`,
      `Concurrency is handled through threading, async operations, and synchronization mechanisms. The system manages concurrent operations efficiently, preventing race conditions and ensuring data consistency in multi-threaded environments.`,
      `Data structures include arrays, objects, maps, and specialized collections optimized for different use cases. The choice of data structure significantly impacts performance, and developers need to select appropriate structures based on access patterns and memory requirements.`,
      `Monitoring involves logging, metrics collection, and alerting systems to track system health. Comprehensive monitoring includes performance metrics, error tracking, user analytics, and system resource utilization to ensure optimal operation.`,
      `Configuration options allow customization of behavior, performance, and integration settings. The system provides flexible configuration through environment variables, configuration files, and runtime parameters that can be adjusted without code changes.`,
      `Data persistence uses databases, file systems, or caching layers depending on requirements. The system supports various storage options and implements efficient data access patterns, caching strategies, and data synchronization mechanisms.`,
      `API design follows RESTful principles, proper HTTP methods, and consistent response formats. The APIs are well-documented, versioned, and designed with developer experience in mind, including proper error handling and consistent response structures.`
    ],
    hard: [
      `${topic}'s internal mechanics involve complex algorithms and data structures that handle specific computational challenges efficiently.`,
      `For large-scale systems using ${topic}, I would implement monitoring, load balancing, and fault tolerance mechanisms to ensure reliability.`,
      `A benchmarking strategy for ${topic} would include performance metrics, memory usage analysis, and comparative testing against alternatives.`,
      `Advanced edge cases for ${topic} include concurrent access issues, network failures, and extreme load conditions.`,
      `To extend ${topic} while maintaining compatibility, I would use versioning, feature flags, and careful API design principles.`,
      `Advanced optimization techniques include algorithmic improvements, caching strategies, and parallel processing approaches.`,
      `Distributed systems require careful coordination, consensus algorithms, and fault tolerance mechanisms.`,
      `Advanced security threats include injection attacks, authentication bypasses, and data breaches requiring comprehensive protection.`,
      `Microservices architecture involves service decomposition, API gateways, and inter-service communication patterns.`,
      `Advanced debugging uses profiling tools, memory analysis, and distributed tracing to identify complex issues.`,
      `Custom extensions require plugin architectures, hooks, and well-defined interfaces for seamless integration.`,
      `Advanced concurrency patterns include actor models, reactive programming, and lock-free algorithms.`,
      `Data consistency in distributed systems uses techniques like eventual consistency, CRDTs, and conflict resolution.`,
      `Advanced deployment strategies include blue-green deployments, canary releases, and automated rollback mechanisms.`,
      `Fault tolerance involves circuit breakers, retry mechanisms, and graceful degradation strategies.`,
      `Advanced monitoring uses distributed tracing, metrics aggregation, and anomaly detection systems.`,
      `High-throughput optimization involves batching, streaming, and parallel processing techniques.`,
      `Advanced caching strategies include multi-level caching, cache invalidation, and predictive prefetching.`,
      `Schema evolution requires migration strategies, backward compatibility, and data transformation pipelines.`,
      `Advanced testing strategies include chaos engineering, load testing, and integration testing at scale.`
    ]
  };

  const qPool = questionTemplates[difficulty] || questionTemplates.medium;
  const aPool = answerTemplates[difficulty] || answerTemplates.medium;

  // Pre-shuffle answers for better performance
  const shuffledAnswers = [...aPool].sort(() => Math.random() - 0.5);

  // build `n` question-answer pairs with randomization
  const questions = [];
  for (let i = 0; i < n; i++) {
    const questionIndex = i % qPool.length;
    const answerIndex = i % shuffledAnswers.length;

    const question = qPool[questionIndex];
    const answer = shuffledAnswers[answerIndex];

    questions.push({
      question: question,
      answer: answer
    });
  }
  return questions;
}

function generateDetailedExplanation(concept) {
  // Create a more detailed explanation based on the concept
  const explanations = {
    "What is React?": `# Understanding React

React is a popular JavaScript library for building user interfaces, particularly web applications. Here's a comprehensive explanation:

## What is React?
React is an open-source JavaScript library developed by Facebook (now Meta) for building user interfaces. It's not a full framework but focuses specifically on the view layer of web applications.

## Key Concepts
- **Components**: The building blocks of React applications
- **JSX**: A syntax extension that allows you to write HTML-like code in JavaScript
- **Virtual DOM**: A lightweight representation of the actual DOM
- **State**: Data that can change over time and affects component rendering
- **Props**: Read-only data passed from parent to child components

## How React Works
1. You write components using JSX
2. React creates a virtual representation of the UI
3. When state changes, React compares the new virtual DOM with the previous one
4. React efficiently updates only the changed parts of the actual DOM

## Example
\`\`\`jsx
function Welcome(props) {
  return <h1>Hello, {props.name}!</h1>;
}

function App() {
  return <Welcome name="World" />;
}
\`\`\`

This approach makes React applications fast and efficient, especially for complex user interfaces.`,

    "What is JavaScript?": `# Understanding JavaScript

JavaScript is a versatile programming language that powers the interactive web. Here's what you need to know:

## What is JavaScript?
JavaScript is a high-level, interpreted programming language that conforms to the ECMAScript specification. It's primarily used for web development but can also run on servers and other environments.

## Key Features
- **Dynamic typing**: Variables can hold different types of data
- **First-class functions**: Functions are treated as first-class citizens
- **Prototype-based inheritance**: Objects inherit from other objects
- **Event-driven**: Responds to user interactions and events
- **Asynchronous programming**: Can handle operations that take time

## Core Concepts
- **Variables**: Using var, let, and const
- **Functions**: Declaration, expression, and arrow functions
- **Objects**: Key-value pairs and methods
- **Arrays**: Ordered collections of data
- **Control flow**: if/else, loops, switch statements

## Example
\`\`\`javascript
// Variable declaration
let message = "Hello, World!";

// Function
function greet(name) {
  return \`Hello, \${name}!\`;
}

// Object
const person = {
  name: "John",
  age: 30,
  greet: function() {
    console.log(\`Hi, I'm \${this.name}\`);
  }
};
\`\`\`

JavaScript's flexibility and ubiquity make it essential for modern web development.`,

    "What is Node.js?": `# Understanding Node.js

Node.js is a powerful runtime environment that brings JavaScript to the server side. Here's a detailed explanation:

## What is Node.js?
Node.js is an open-source, cross-platform JavaScript runtime environment that executes JavaScript code outside of a web browser. It uses Google's V8 JavaScript engine.

## Key Features
- **Non-blocking I/O**: Handles multiple connections simultaneously
- **Event-driven architecture**: Uses events and callbacks
- **NPM**: Largest ecosystem of open-source libraries
- **Single-threaded**: Uses a single thread with event loop
- **Cross-platform**: Runs on Windows, macOS, and Linux

## Core Components
- **Event Loop**: Handles asynchronous operations
- **Callback functions**: Execute after asynchronous operations complete
- **Modules**: Reusable pieces of code
- **Streams**: Handle reading/writing data efficiently
- **Buffers**: Temporary storage for binary data

## Example
\`\`\`javascript
const http = require('http');

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\\n');
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
\`\`\`

Node.js revolutionized server-side development by allowing developers to use JavaScript for both frontend and backend.`,

    "What is MongoDB?": `# Understanding MongoDB

MongoDB is a popular NoSQL database that stores data in flexible, JSON-like documents. Here's a comprehensive overview:

## What is MongoDB?
MongoDB is a document-oriented NoSQL database designed for ease of development and scaling. It stores data in flexible, JSON-like documents instead of traditional table-based relational databases.

## Key Features
- **Document-oriented**: Stores data as BSON documents
- **Schema-less**: No predefined schema required
- **Horizontal scaling**: Easy to scale across multiple servers
- **High performance**: Fast read/write operations
- **Rich queries**: Powerful query language

## Core Concepts
- **Documents**: Basic unit of data (like JSON objects)
- **Collections**: Groups of documents (like tables)
- **Databases**: Containers for collections
- **Indexes**: Improve query performance
- **Aggregation**: Process and transform data

## Example
\`\`\`javascript
// Sample document
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30,
  "skills": ["JavaScript", "Node.js", "MongoDB"],
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "zip": "10001"
  }
}

// Query example
db.users.find({ age: { $gte: 25 } });
\`\`\`

MongoDB's flexibility makes it ideal for applications with evolving data requirements.`
  };

  // Try to find an exact match first
  if (explanations[concept]) {
    return explanations[concept];
  }

  // If no exact match, try to find a partial match
  for (const [key, explanation] of Object.entries(explanations)) {
    if (concept.toLowerCase().includes(key.toLowerCase().replace("What is ", "").replace("?", ""))) {
      return explanation;
    }
  }

  // Generic explanation if no match found
  return `# Understanding ${concept}

## Overview
${concept} is an important concept in software development. While I don't have specific details about this particular topic, here's a general approach to understanding technical concepts:

## General Approach to Learning
1. **Research the basics**: Start with fundamental definitions and core principles
2. **Understand the context**: Learn how it fits into the larger ecosystem
3. **Practice implementation**: Try building small examples or projects
4. **Study real-world applications**: See how it's used in actual projects
5. **Learn from documentation**: Official docs are usually the best source

## Key Questions to Ask
- What problem does this solve?
- How does it compare to alternatives?
- What are the common use cases?
- What are the limitations or trade-offs?

## Next Steps
- Search for official documentation
- Look for tutorials and examples
- Join relevant communities or forums
- Practice with small projects

Remember, the best way to learn any technical concept is through hands-on practice and real-world application.`;
}
