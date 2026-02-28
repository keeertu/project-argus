# Contributing to Project Argus

Thank you for your interest in contributing to Project Argus! This document will help you get started.

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- Git

### Setup for Development

1. **Clone the repository**
```bash
git clone https://github.com/kesertu/project-argus.git
cd project-argus
```

2. **Backend Setup**
```bash
cd project-argus-backend
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your AWS credentials (optional for local dev)
python -m uvicorn main:app --reload
```

3. **Frontend Setup**
```bash
cd project-argus-frontend
npm install
cp .env.example .env
# Edit .env with backend URL (default: http://localhost:8080)
npm run dev
```

## Project Structure

```
project-argus/
├── project-argus-backend/     # FastAPI backend
│   ├── routers/              # API endpoints
│   ├── services/             # Business logic
│   ├── scrapers/             # Web scraping
│   ├── models/               # Data models
│   └── data/                 # Price benchmarks
├── project-argus-frontend/    # React frontend
│   └── src/
│       ├── components/       # React components
│       ├── api/              # API client
│       └── data/             # Demo data
└── docs/                     # Documentation
```

## How to Contribute

### Reporting Bugs
- Use GitHub Issues
- Include steps to reproduce
- Include screenshots if applicable
- Mention your OS and browser

### Suggesting Features
- Open a GitHub Issue
- Describe the feature
- Explain why it would be useful
- Provide examples if possible

### Code Contributions

1. **Fork the repository**
2. **Create a feature branch**
```bash
git checkout -b feature/your-feature-name
```

3. **Make your changes**
- Follow existing code style
- Add comments for complex logic
- Update documentation if needed

4. **Test your changes**
```bash
# Backend tests
cd project-argus-backend
python -m pytest

# Frontend tests
cd project-argus-frontend
npm test
```

5. **Commit your changes**
```bash
git add .
git commit -m "Add: your feature description"
```

6. **Push to your fork**
```bash
git push origin feature/your-feature-name
```

7. **Create a Pull Request**
- Go to the original repository
- Click "New Pull Request"
- Select your branch
- Describe your changes
- Submit!

## Code Style

### Python (Backend)
- Follow PEP 8
- Use type hints
- Add docstrings to functions
- Keep functions small and focused

### JavaScript/React (Frontend)
- Use functional components
- Use hooks for state management
- Follow React best practices
- Use meaningful variable names

## Adding New Features

### Adding a New City
1. Update `project-argus-backend/data/price_benchmarks.json`
2. Add city data with localities and prices
3. Test with demo listings

### Adding a New Scraping Platform
1. Update `project-argus-backend/scrapers/listing_scraper.py`
2. Add platform detection
3. Add mock data for the platform
4. Update frontend platform detection

### Adding New Analysis Features
1. Create new service in `project-argus-backend/services/`
2. Update risk scoring algorithm
3. Add UI components in frontend
4. Update documentation

## Testing

### Manual Testing
1. Test all demo buttons
2. Test URL input with different platforms
3. Test manual form entry
4. Test on mobile devices
5. Check all animations

### Automated Testing
```bash
# Backend
cd project-argus-backend
pytest

# Frontend
cd project-argus-frontend
npm test
```

## Documentation

- Update README.md for major changes
- Update API documentation in code
- Add comments for complex logic
- Update deployment guides if needed

## Questions?

- Open a GitHub Issue
- Tag it with "question"
- We'll respond as soon as possible!

## Code of Conduct

- Be respectful and inclusive
- Help others learn
- Give constructive feedback
- Focus on the code, not the person

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Project Argus! Together we can protect India's renters from scams. 🛡️
