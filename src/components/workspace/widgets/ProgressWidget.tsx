import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, ArrowRight, Award, BookOpen } from 'lucide-react';
import { useProgress } from '../../../contexts/ProgressContext';
import type { Widget } from '../../../core/engine';

export default function ProgressWidget({ widget }: { widget: Widget }) {
  const navigate = useNavigate();
  const { enrolledCourses, courseProgress, getCompleted32Courses } = useProgress();
  const completed32 = getCompleted32Courses();
  const totalProgress = enrolledCourses.length > 0
    ? Math.round(enrolledCourses.reduce((sum, cid) => sum + (courseProgress[cid] || 0), 0) / enrolledCourses.length)
    : 0;

  return (
    <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-stone-100 bg-stone-50/50">
        <BarChart3 className="h-3 w-3 text-emerald-600" />
        <span className="text-[9px] font-bold font-mono text-stone-700 uppercase tracking-wider">Progreso</span>
      </div>
      <div className="p-3 space-y-2.5">
        {/* Overall progress bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[9px] text-stone-500 font-mono">
            <span>Progreso general</span>
            <span className="font-bold text-emerald-700">{totalProgress}%</span>
          </div>
          <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-500"
              style={{ width: `${totalProgress}%` }}
            />
          </div>
        </div>

        {/* Course enrollment */}
        {enrolledCourses.length > 0 && (
          <div className="space-y-1">
            <p className="text-[8px] font-mono text-stone-400 uppercase tracking-wider">Cursos inscritos</p>
            {enrolledCourses.slice(0, 2).map(cid => (
              <div key={cid} className="flex items-center gap-2">
                <BookOpen className="h-2.5 w-2.5 text-stone-400 shrink-0" />
                <span className="text-[10px] text-stone-600 truncate flex-1">{cid}</span>
                <span className="text-[8px] font-mono text-emerald-600">{courseProgress[cid] || 0}%</span>
              </div>
            ))}
          </div>
        )}

        {/* 32 courses badge */}
        {completed32.length > 0 && (
          <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-amber-50 border border-amber-200">
            <Award className="h-3 w-3 text-amber-600 shrink-0" />
            <span className="text-[9px] font-medium text-amber-800">
              {completed32.length}/32 cursos completados
            </span>
          </div>
        )}

        <button
          onClick={() => navigate('/campus')}
          className="w-full text-[8px] font-mono text-stone-400 hover:text-emerald-600 text-center pt-1"
        >
          Ir a mi progreso →
        </button>
      </div>
    </div>
  );
}
