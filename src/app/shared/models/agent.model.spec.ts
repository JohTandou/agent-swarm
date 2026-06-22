import type { Agent, AgentCategory, AgentRoute } from './agent.model';

describe('Agent model', () => {
  it('should accept a valid Agent object with all required fields', () => {
    const agent: Agent = {
      id: 'orchestrateur',
      name: 'Orchestrateur',
      emoji: '🎯',
      role: "Chef d'orchestre du pipeline",
      description: "Interface unique avec l'utilisateur et chef d'orchestre du pipeline",
      route: 'FULL',
      active: true,
      category: 'build',
      sourcePath: 'agents/orchestrateur.md',
    };

    expect(agent.id).toBe('orchestrateur');
    expect(agent.route).toBe('FULL');
    expect(agent.active).toBe(true);
  });

  it('should support all AgentRoute values', () => {
    const routes: AgentRoute[] = ['DIRECT', 'SIMPLE', 'ADAPT', 'MEDIUM', 'FULL'];
    expect(routes.length).toBe(5);
  });

  it('should support all AgentCategory values', () => {
    const categories: AgentCategory[] = ['build', 'qualité', 'infrastructure'];
    expect(categories.length).toBe(3);
  });

  it('should allow inactive agents', () => {
    const agent: Agent = {
      id: 'back',
      name: 'Back',
      emoji: '⚙️',
      role: 'Implémente le backend',
      description: 'Agent backend',
      route: 'FULL',
      active: false,
      category: 'build',
      sourcePath: 'agents/back.md',
    };

    expect(agent.active).toBe(false);
  });
});
