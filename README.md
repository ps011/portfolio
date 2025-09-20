## Portfolio
Welcome to Portfolio – a versatile and customizable personal website template designed for developers, designers, and professionals who want to showcase their work in a polished and professional manner. Whether you're an individual looking to create a personal portfolio or a team wanting a unified online presence, Portfolio offers a perfect solution.

## Deployment Process

The project uses GitHub Actions for automated deployment with a two-stage release process:

### Deployment Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    GitHub Actions Workflow                     │
│                        (deploy.yml)                           │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Trigger Events                               │
│  • Pull Request labeled on main branch                         │
│  • Manual workflow dispatch                                    │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Job 1: release                              │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ 1. Checkout code (head_ref or ref)                        │ │
│  │ 2. Setup Node.js from .nvmrc                              │ │
│  │ 3. Configure Git context                                  │ │
│  │ 4. Checkout main branch                                   │ │
│  │ 5. Bump version (yarn release:next-version)               │ │
│  │ 6. Create release branch (release/v{version})             │ │
│  │ 7. Merge feature branch (if PR event)                     │ │
│  │ 8. Commit package.json changes                            │ │
│  │ 9. Push release branch to origin                          │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Job 2: merge-release                        │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ 1. Checkout release branch                                 │ │
│  │ 2. Configure Git context                                  │ │
│  │ 3. Fetch and checkout main                                │ │
│  │ 4. Pull latest main                                        │ │
│  │ 5. Merge release branch into main                          │ │
│  │ 6. Push merged changes to main                            │ │
│  │ 7. Create and push Git tag (v{version})                   │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Final State                                 │
│  • Main branch updated with new version                       │
│  • Git tag created (v{version})                               │
│  • Release branch available for reference                     │
└─────────────────────────────────────────────────────────────────┘
```

### Workflow Details

**Trigger Conditions:**
- Pull request labeled on the main branch
- Manual workflow dispatch

**Key Features:**
- Automated version bumping using custom scripts
- Branch-based release management
- Automatic merging and tagging
- Uses custom GitHub token for authentication
- Maintains clean Git history with `--no-ff` merges

**Version Management:**
- Uses `yarn release:next-version` to bump version
- Reads current version with `yarn --silent release:current-version`
- Creates semantic version tags (v{version})
