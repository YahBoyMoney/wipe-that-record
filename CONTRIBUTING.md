# 🤝 Contributing to Wipe That Record

Thank you for your interest in contributing to **Wipe That Record**! This project helps Californians navigate the complex process of criminal record expungement, and your contributions make a real difference in people's lives.

## 🎯 **Code of Conduct**

This project adheres to a code of conduct that fosters an inclusive and respectful community. By participating, you agree to uphold these standards.

## 🚀 **Getting Started**

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account
- Stripe account (for payment testing)
- Git knowledge
- TypeScript/React experience

### Development Setup
```bash
# 1. Fork and clone the repository
git clone https://github.com/your-username/wipe-that-record.git
cd wipe-that-record

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# 4. Start development server
npm run dev

# 5. Access the application
# Frontend: http://localhost:3000
# Admin: http://localhost:3000/admin
```

## 🔧 **Development Workflow**

### Branch Strategy
- `main`: Production-ready code
- `develop`: Integration branch for features
- `feature/*`: New features and improvements
- `hotfix/*`: Critical bug fixes

### Making Changes
1. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**
   - Follow existing code patterns
   - Add tests for new functionality
   - Update documentation as needed

3. **Test Your Changes**
   ```bash
   npm run test          # Unit tests
   npm run test:e2e      # End-to-end tests
   npm run lint          # Code linting
   npm run type-check    # TypeScript validation
   ```

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

5. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   Then create a Pull Request on GitHub.

## 📝 **Commit Message Convention**

We use [Conventional Commits](https://www.conventionalcommits.org/) for clear history:

```
type(scope): description

feat(api): add lead analytics endpoint
fix(ui): resolve mobile responsive issue
docs(readme): update installation instructions
test(payment): add stripe webhook tests
chore(deps): update dependencies
```

### Types
- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code formatting
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance tasks

## 🏗️ **Project Structure**

```
wipe-that-record/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (web)/          # Public website
│   │   ├── (payload)/      # Admin panel
│   │   └── api/            # API endpoints
│   ├── components/         # Reusable UI components
│   ├── collections/        # PayloadCMS collections
│   ├── lib/               # Utility functions
│   └── views/             # Custom admin views
├── public/                # Static assets
└── docs/                  # Documentation files
```

## 🧪 **Testing Guidelines**

### Writing Tests
- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test API endpoints and database operations
- **E2E Tests**: Test complete user workflows

### Test Structure
```typescript
describe('Feature Name', () => {
  beforeEach(() => {
    // Setup code
  });

  it('should perform expected behavior', () => {
    // Test implementation
  });

  afterEach(() => {
    // Cleanup code
  });
});
```

### Coverage Requirements
- Maintain >80% code coverage
- All new features must include tests
- Critical paths require comprehensive testing

## 🎨 **UI/UX Guidelines**

### Design Principles
- **Accessibility First**: WCAG 2.1 AA compliance
- **Mobile Responsive**: Mobile-first approach
- **Performance**: Optimize for Core Web Vitals
- **Consistency**: Follow existing design patterns

### Component Standards
- Use TypeScript for all components
- Include PropTypes or interface definitions
- Follow naming conventions
- Add Storybook stories for complex components

## 🔐 **Security Considerations**

### Security Requirements
- Never commit secrets or API keys
- Validate all user inputs
- Use parameterized queries
- Implement proper authentication
- Follow OWASP security practices

### Sensitive Data
- Customer information is confidential
- Legal documents require special handling
- Payment data must follow PCI compliance
- Log security events appropriately

## 📊 **Performance Standards**

### Metrics to Maintain
- **Lighthouse Score**: >90 in all categories  
- **Core Web Vitals**: Green scores
- **Bundle Size**: Monitor and optimize
- **API Response**: <200ms average

### Optimization Techniques
- Use Next.js Image optimization
- Implement code splitting
- Optimize database queries
- Enable proper caching

## 🚀 **Deployment Process**

### Staging Environment
- All PRs deploy to staging automatically
- Manual testing required before merge
- Stakeholder approval for UI changes

### Production Deployment
- Only maintainers can deploy to production
- Requires passing all CI/CD checks
- Database migrations run automatically
- Rollback plan always prepared

## 📚 **Documentation Standards**

### Code Documentation
- Document complex business logic
- Add JSDoc comments for functions
- Update README for new features
- Include inline comments for clarity

### API Documentation
- Document all endpoints
- Include request/response examples
- Specify error codes and messages
- Update Postman collections

## 🏆 **Recognition**

Contributors who make significant impacts will be:
- Added to the README contributors section
- Invited to maintainer status (for regular contributors)
- Recognized in release notes
- Eligible for project swag and rewards

## 🤔 **Questions & Support**

### Getting Help
- **GitHub Issues**: Bug reports and feature requests
- **Discussions**: General questions and ideas
- **Email**: contact@wipethatrecord.com for sensitive issues
- **Documentation**: Check existing docs first

### Areas We Need Help
- **Frontend Development**: React/Next.js expertise
- **Backend Development**: API and database optimization
- **Legal Research**: California expungement law updates
- **UX/UI Design**: User experience improvements
- **Testing**: Automated testing coverage
- **Documentation**: User guides and technical docs

## 📋 **Issue Templates**

When creating issues, please use our templates:
- **Bug Report**: For reporting problems
- **Feature Request**: For suggesting improvements
- **Documentation**: For doc updates
- **Question**: For general questions

## ✅ **Pull Request Checklist**

Before submitting a PR, ensure:
- [ ] Code follows project conventions
- [ ] Tests pass locally
- [ ] Documentation updated
- [ ] No merge conflicts
- [ ] Commits follow convention
- [ ] PR description is clear
- [ ] Screenshots for UI changes
- [ ] Security implications considered

## 🌟 **Thank You**

Your contributions help make legal services more accessible to everyone. Together, we're building technology that changes lives and creates opportunities for second chances.

---

**Happy coding, and thank you for making a difference!** 🚀

*For questions about this guide, please [open an issue](https://github.com/YahBoMoney/wipe-that-record/issues) or contact the maintainers.* 