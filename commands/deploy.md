---
description: "Deploy application to production or staging environment"
---
Delegate this task to the devops-engineer agent. Execute the following workflow:

1. Verify build artifacts and run pre-deploy checks
2. Select target environment (staging/production)
3. Execute deployment pipeline with rollback capability
4. Run health checks and smoke tests post-deploy
5. Monitor error rates for 5 minutes after cutover
6. Report deployment status with metrics

Agent chain: devops-engineer -> cloud-architect