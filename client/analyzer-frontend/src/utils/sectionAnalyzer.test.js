import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSectionAnalysis } from './sectionAnalyzer.js';

test('buildSectionAnalysis creates interactive section details from existing AI analysis', () => {
  const analysis = {
    strengths: ['React', 'Node.js'],
    missingSkills: ['Docker'],
    improvements: ['Mention metrics'],
    summary: 'Strong frontend candidate',
    sectionScores: {
      skills: 0.8,
      experience: 0.7,
      education: 0.6,
      projects: 0.5,
      formatting: 0.75,
      contact: 0.65,
    },
    parsedResume: {
      hardSkills: ['React', 'Node.js'],
      softSkills: ['Leadership'],
      achievements: ['Built a dashboard'],
      github: 'https://github.com/example',
      linkedin: 'https://linkedin.com/in/example',
      portfolio: 'https://example.com',
      certifications: ['AWS Certified'],
      languages: ['English'],
    },
  };

  const result = buildSectionAnalysis(analysis);

  assert.equal(result.sections.length, 6);
  assert.equal(result.sections[0].label, 'Skills');
  assert.ok(result.sections[0].recommendations.length >= 1);
  assert.ok(result.sections[0].keywords.found.includes('React'));
  assert.ok(result.sections[5].label === 'Contact Information');
});
