# Contributing to SwanyThree Ultimate

Thank you for your interest in contributing to SwanyThree Ultimate! This document provides guidelines and instructions for contributing.

## 🤝 Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Maintain professionalism

## 🚀 Getting Started

### 1. Fork and Clone

```bash
# Fork the repository on GitHub, then:
git clone https://github.com/YOUR_USERNAME/swanythree-ultimate.git
cd swanythree-ultimate
```

### 2. Setup Development Environment

Follow the [QUICKSTART.md](./QUICKSTART.md) guide to set up your local development environment.

### 3. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

**Branch naming convention:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Test additions/changes
- `chore/` - Maintenance tasks

## 📝 Development Workflow

### 1. Make Your Changes

- Write clean, readable code
- Follow existing code style
- Add comments for complex logic
- Update documentation if needed

### 2. Test Your Changes

```bash
# Backend
cd apps/backend
npm test  # Run tests
node -c src/index.js  # Syntax check

# Frontend
cd apps/frontend
npm run build  # Ensure build succeeds
npm test  # Run tests
```

### 3. Commit Your Changes

Follow conventional commit format:

```bash
git commit -m "type(scope): description"
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Tests
- `chore`: Maintenance

**Examples:**
```bash
git commit -m "feat(ai): add content idea generation"
git commit -m "fix(auth): resolve token refresh issue"
git commit -m "docs(readme): update installation steps"
```

### 4. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub with:
- Clear title and description
- Reference related issues
- Screenshots (for UI changes)
- Test results

## 🎯 Contribution Areas

### Backend

**What to contribute:**
- New API endpoints
- Database optimizations
- Security improvements
- Platform integrations (OAuth)
- Webhook handlers
- Performance enhancements

**Key files:**
- `apps/backend/src/routes/` - API routes
- `apps/backend/src/sockets/` - WebSocket handlers
- `apps/backend/src/middleware/` - Middleware
- `apps/backend/schema.sql` - Database schema

### Frontend

**What to contribute:**
- New pages/components
- UI/UX improvements
- Accessibility enhancements
- Mobile responsiveness
- Performance optimizations
- State management improvements

**Key files:**
- `apps/frontend/src/pages/` - Page components
- `apps/frontend/src/components/` - Reusable components
- `apps/frontend/src/store/` - State management
- `apps/frontend/src/lib/` - Utilities

### Documentation

**What to contribute:**
- Tutorial improvements
- API documentation
- Code examples
- Deployment guides
- Troubleshooting tips

**Key files:**
- `README.md` - Main documentation
- `API.md` - API reference
- `DEPLOYMENT.md` - Deployment guide
- `QUICKSTART.md` - Quick start guide

## 📋 Pull Request Checklist

Before submitting your PR, ensure:

- [ ] Code follows existing style
- [ ] All tests pass
- [ ] New features have tests
- [ ] Documentation updated
- [ ] Commit messages follow convention
- [ ] No console.log or debugging code
- [ ] Environment variables documented
- [ ] Breaking changes noted

## 🔍 Code Review Process

1. **Automated Checks**: CI runs automatically
2. **Maintainer Review**: Code review by maintainers
3. **Feedback**: Address review comments
4. **Approval**: Minimum 1 approval required
5. **Merge**: Squash and merge to main

## 🐛 Bug Reports

### Before Reporting

1. Search existing issues
2. Try latest version
3. Check documentation

### Creating a Bug Report

Include:
- **Description**: Clear description of the bug
- **Steps to Reproduce**: Step-by-step instructions
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Environment**:
  - OS: (e.g., macOS 13.0)
  - Node version: (e.g., 18.17.0)
  - Browser: (e.g., Chrome 120)
- **Screenshots**: If applicable
- **Logs**: Relevant error messages

**Template:**
```markdown
## Bug Description
[Clear description]

## Steps to Reproduce
1. Go to...
2. Click on...
3. See error

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happens]

## Environment
- OS: macOS 13.0
- Node: 18.17.0
- Browser: Chrome 120

## Screenshots
[If applicable]

## Logs
```
[Error logs]
```
```

## ✨ Feature Requests

### Creating a Feature Request

Include:
- **Problem**: What problem does it solve?
- **Solution**: Proposed solution
- **Alternatives**: Alternative solutions considered
- **Benefits**: Who benefits and how?
- **Implementation**: Any implementation ideas

**Template:**
```markdown
## Problem
[Describe the problem]

## Proposed Solution
[Your proposed solution]

## Alternatives Considered
[Other solutions you considered]

## Benefits
[Who benefits and how]

## Implementation Ideas
[Optional: Implementation suggestions]
```

## 🏗️ Project Structure

```
swanythree-ultimate/
├── apps/
│   ├── backend/           # Express API
│   │   ├── src/
│   │   │   ├── config/    # Configuration
│   │   │   ├── middleware/ # Express middleware
│   │   │   ├── routes/    # API routes
│   │   │   ├── sockets/   # WebSocket handlers
│   │   │   ├── models/    # Database models
│   │   │   ├── services/  # Business logic
│   │   │   └── utils/     # Utilities
│   │   ├── schema.sql     # Database schema
│   │   └── seed.sql       # Test data
│   └── frontend/          # React app
│       ├── src/
│       │   ├── components/ # React components
│       │   ├── pages/     # Page components
│       │   ├── hooks/     # Custom hooks
│       │   ├── store/     # State management
│       │   └── lib/       # Utilities
│       └── public/        # Static assets
├── scripts/               # Development scripts
├── .github/               # GitHub workflows
└── docs/                  # Documentation
```

## 🎨 Code Style

### JavaScript/JSX

- Use ES6+ features
- Prefer const/let over var
- Use arrow functions
- Async/await over callbacks
- Meaningful variable names
- Add JSDoc comments for functions

**Example:**
```javascript
/**
 * Generate podcast script using Claude AI
 * @param {Object} params - Generation parameters
 * @param {string} params.topic - Podcast topic
 * @param {string} params.duration - Duration in minutes
 * @returns {Promise<Object>} Generated script and metadata
 */
async function generatePodcast({ topic, duration }) {
  try {
    // Implementation
  } catch (error) {
    logger.error('Failed to generate podcast:', error);
    throw error;
  }
}
```

### React Components

- Functional components with hooks
- PropTypes or TypeScript (future)
- Destructure props
- Use custom hooks for logic
- Keep components small and focused

**Example:**
```jsx
function StreamCard({ stream, onStart, onStop }) {
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    setLoading(true);
    try {
      await onStart(stream.id);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>{stream.title}</h3>
      <button onClick={handleStart} disabled={loading}>
        {loading ? 'Starting...' : 'Start Stream'}
      </button>
    </div>
  );
}
```

### CSS/Tailwind

- Use Tailwind utility classes
- Custom classes in index.css for reusable patterns
- Mobile-first responsive design
- Dark mode support

## 🧪 Testing

### Writing Tests

We encourage adding tests for new features:

```javascript
// Backend example (future)
describe('Auth API', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123'
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });
});
```

### Running Tests

```bash
# Backend
cd apps/backend
npm test

# Frontend
cd apps/frontend
npm test
```

## 📊 Performance

Consider performance when contributing:

- **Database**: Use indexes, avoid N+1 queries
- **API**: Implement pagination, caching
- **Frontend**: Code splitting, lazy loading
- **WebSocket**: Efficient room management

## 🔒 Security

Security is critical:

- Never commit secrets or API keys
- Validate all user input
- Use parameterized queries
- Sanitize HTML content
- Follow OWASP guidelines
- Report security issues privately

## 📦 Dependencies

When adding dependencies:

- Justify the need
- Check bundle size impact
- Verify license compatibility
- Ensure active maintenance
- Update documentation

## 🚀 Release Process

1. Version bump (semantic versioning)
2. Update CHANGELOG.md
3. Create release tag
4. Deploy to staging
5. Test thoroughly
6. Deploy to production
7. Announce release

## 🤔 Questions?

- 💬 GitHub Discussions
- 📧 Email maintainers
- 📖 Check documentation

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to SwanyThree Ultimate! 🎉**
