import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';

interface ProjectProgressProps {
  progress: number;
  startDate: string;
  endDate: string;
  phases: {
    name: string;
    status: 'completed' | 'in-progress' | 'pending';
    percentage: number;
  }[];
  materials: {
    name: string;
    percentage: number;
    isRecycled: boolean;
  }[];
}

const ProjectProgress: React.FC<ProjectProgressProps> = ({ 
  progress, 
  startDate, 
  endDate, 
  phases,
  materials
}) => {
  const { t } = useLanguage();
  const COLORS = ['#2A11D8', '#E2725B', '#0C0539', '#6B8E23', '#CD853F'];
  
  const materialData = materials.map(material => ({
    name: material.name,
    value: material.percentage,
    isRecycled: material.isRecycled
  }));

  // Traduire les statuts des phases
  const getStatusTranslation = (status: string) => {
    switch(status) {
      case 'completed':
        return t('projectProgress.completed');
      case 'in-progress':
        return t('projectProgress.inProgress');
      case 'pending':
        return t('projectProgress.pending');
      default:
        return status;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="font-lufga text-xl mb-6">{t('projectProgress.title')}</h3>
      
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">{t('projectProgress.overallProgress')}</span>
          <span className="text-sm font-medium">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <motion.div 
            className="bg-accent h-2.5 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1 }}
          ></motion.div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>{t('projectProgress.start')}: {startDate}</span>
          <span>{t('projectProgress.estimatedCompletion')}: {endDate}</span>
        </div>
      </div>
      
      {/* Project Phases */}
      <div className="mb-8">
        <h4 className="font-lufga text-lg mb-4">{t('projectProgress.projectPhases')}</h4>
        <div className="space-y-4">
          {phases.map((phase, index) => (
            <div key={index}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">{phase.name}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  phase.status === 'completed' ? 'bg-green-100 text-green-800' :
                  phase.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {getStatusTranslation(phase.status)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    phase.status === 'completed' ? 'bg-green-500' :
                    phase.status === 'in-progress' ? 'bg-sage' :
                    'bg-gray-300'
                  }`}
                  style={{ width: `${phase.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Materials Breakdown */}
      <div>
        <h4 className="font-lufga text-lg mb-4">{t('projectProgress.materialsBreakdown')}</h4>
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={materialData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {materialData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full md:w-1/2">
            <div className="space-y-2">
              {materials.map((material, index) => (
                <div key={index} className="flex items-center">
                  <div 
                    className="w-4 h-4 mr-2 rounded-sm" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-sm">{material.name} ({material.percentage}%)</span>
                  {material.isRecycled && (
                    <span className="ml-2 text-xs bg-sage bg-opacity-20 text-sage px-2 py-0.5 rounded-full">
                      {t('projectProgress.recycled')}
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                <span className="font-medium">{t('projectProgress.recycledMaterials')}:</span> {materials.filter(m => m.isRecycled).reduce((acc, curr) => acc + curr.percentage, 0)}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectProgress;