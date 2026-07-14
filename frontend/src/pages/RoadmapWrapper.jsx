import React from 'react';
import { useParams, Navigate } from 'react-router-dom';

// Import your components
import FrontendRoadmap from './FrontendRoadmap';
import BackendRoadmap from './BackendRoadmap';
import FullStackRoadmap from './FullStackRoadmap';
import DSARoadmap from './DSARoadmap';
import OOPRoadmap from './OOPRoadmap';
import DBMSRoadmap from './DBMSRoadmap';
import DataAnalystRoadmap from './DataAnalystRoadmap';
import MLRoadmap from './MLRoadmap';
import GenAIRoadmap from './GenAIRoadmap';
import PromptEngineerRoadmap from './PromptEngineerRoadmap';
import CyberSecurityRoadmap from './CyberSecurityRoadmap';

const RoadmapWrapper = () => {
  const { id } = useParams();

  // Store the components as functions/references
  const roadmaps = {
    'frontend': FrontendRoadmap,
    'backend': BackendRoadmap,
    'fullstack': FullStackRoadmap,
    'dsa': DSARoadmap,
    'oops': OOPRoadmap,
    'dbms': DBMSRoadmap,
    'data-analyst': DataAnalystRoadmap,
    'machine-learning': MLRoadmap,
    'generative-ai': GenAIRoadmap,
    'prompt-engineer': PromptEngineerRoadmap,
    'cyber-security': CyberSecurityRoadmap,
  };

  const SelectedComponent = roadmaps[id];

  // If the ID isn't found, redirect
  if (!SelectedComponent) {
    return <Navigate to="/roadmaps" replace />;
  }

  // Render the component dynamically
  return <SelectedComponent />;
};

export default RoadmapWrapper;