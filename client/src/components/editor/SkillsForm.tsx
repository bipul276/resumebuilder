import { Plus, X, Folder, AlertTriangle } from 'lucide-react';
import { useResumeStore } from '../../stores/useResumeStore';
import { useState } from 'react';
import type { Skill } from '@resumebuilder/shared';
import { getTemplateCapabilities } from '../../constants/templateCapabilities';

const COMMON_CATEGORIES = [
    'Languages',
    'Frameworks',
    'Databases',
    'DevOps',
    'Tools',
    'Cloud',
    'Other'
];

export function SkillsForm() {
    const { resume, addSkill, updateSkillFull, removeSkill } = useResumeStore();
    const { skills, templateId } = resume;
    const capabilities = getTemplateCapabilities(templateId);

    const [newSkill, setNewSkill] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [newLevel, setNewLevel] = useState(80);
    const [showCategoryInput, setShowCategoryInput] = useState(false);

    const handleAddSkill = () => {
        if (newSkill.trim()) {
            addSkill();
            const addedSkill = useResumeStore.getState().resume.skills.at(-1);
            if (addedSkill) {
                updateSkillFull(addedSkill.id, {
                    name: newSkill.trim(),
                    category: newCategory.trim() || undefined,
                    level: newLevel
                });
            }
            setNewSkill('');
            setNewLevel(80);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddSkill();
        }
    };

    // Group skills by category
    const groupedSkills = skills.reduce((acc, skill) => {
        const category = skill.category || 'Uncategorized';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(skill);
        return acc;
    }, {} as Record<string, Skill[]>);

    const hasCategories = Object.keys(groupedSkills).some(cat => cat !== 'Uncategorized');

    const renderSkillItem = (skill: Skill) => (
        <div
            key={skill.id}
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                padding: '8px 12px',
                background: 'var(--color-bg-panel)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                width: '100%',
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 500 }}>{skill.name}</span>
                <button
                    onClick={() => removeSkill(skill.id)}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--color-text-muted)',
                        padding: '4px',
                    }}
                >
                    <X size={14} />
                </button>
            </div>

            {/* Level slider - conditional rendering based on capability */}
            <div style={{ position: 'relative', marginTop: '4px' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    opacity: capabilities.skills.level ? 1 : 0.5,
                    pointerEvents: capabilities.skills.level ? 'auto' : 'none',
                }}>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={skill.level || 0}
                        onChange={(e) => updateSkillFull(skill.id, { level: parseInt(e.target.value) })}
                        style={{ flex: 1, height: '4px' }}
                        title={`Level: ${skill.level || 0}%`}
                        disabled={!capabilities.skills.level}
                    />
                    <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', width: '30px', textAlign: 'right' }}>
                        {skill.level || 0}%
                    </span>
                </div>
                {!capabilities.skills.level && (
                    <div style={{
                        marginTop: '4px',
                        fontSize: '9px',
                        color: '#ecc94b',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                    }}>
                        <AlertTriangle size={10} />
                        Hidden in layout
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="fade-in">
            <div className="form-section">
                <h2 className="form-section-title">Skills</h2>

                {/* Toggle for category mode */}
                <div style={{ marginBottom: '16px' }}>
                    <button
                        className={`btn ${showCategoryInput ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => setShowCategoryInput(!showCategoryInput)}
                        style={{ fontSize: '13px', padding: '6px 12px' }}
                    >
                        <Folder size={14} />
                        {showCategoryInput ? 'Hide Categories' : 'Add with Category'}
                    </button>
                </div>

                {/* Add skill form */}
                <div className="form-row" style={{ marginBottom: '20px', gap: '8px', alignItems: 'flex-start' }}>
                    {showCategoryInput && (
                        <div className="form-group" style={{ flex: '0 0 140px' }}>
                            <label className="form-label">Category</label>
                            <select
                                className="form-input"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                            >
                                <option value="">No category</option>
                                {COMMON_CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label">Skill Name</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="e.g., JavaScript"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>

                    {/* Add-time level slider */}
                    <div className="form-group" style={{ flex: '0 0 100px' }}>
                        <label className="form-label" style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            color: capabilities.skills.level ? 'inherit' : 'var(--color-text-disabled)'
                        }}>
                            Level <span style={{ fontSize: '0.8em', opacity: 0.8 }}>{newLevel}%</span>
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={newLevel}
                                onChange={(e) => setNewLevel(parseInt(e.target.value))}
                                style={{
                                    width: '100%',
                                    marginTop: '8px',
                                    opacity: capabilities.skills.level ? 1 : 0.5,
                                    cursor: capabilities.skills.level ? 'pointer' : 'not-allowed'
                                }}
                                disabled={!capabilities.skills.level}
                            />
                            {!capabilities.skills.level && (
                                <div title="Current layout does not support skill levels" style={{
                                    position: 'absolute',
                                    right: 0,
                                    top: -20,
                                    color: '#ecc94b'
                                }}>
                                    <AlertTriangle size={12} />
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        className="btn btn-primary"
                        onClick={handleAddSkill}
                        disabled={!newSkill.trim()}
                        style={{ marginTop: '26px' }}
                    >
                        <Plus size={18} />
                    </button>
                </div>

                {skills.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '40px 20px',
                        color: 'var(--color-text-muted)',
                    }}>
                        <p>No skills added yet.</p>
                        <p>Type a skill name and press Enter or click Add.</p>
                    </div>
                ) : hasCategories ? (
                    // Grouped display
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                            <div
                                key={category}
                                style={{
                                    padding: '16px',
                                    background: 'var(--color-bg-panel)',
                                    borderRadius: 'var(--radius-lg)',
                                    border: '1px solid var(--color-border)',
                                }}
                            >
                                <div style={{
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    color: 'var(--color-text-secondary)',
                                    marginBottom: '10px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                }}
                                >
                                    {category}
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
                                    {categorySkills.map(renderSkillItem)}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    // Flat display
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                        gap: '8px',
                        padding: '16px',
                        background: 'var(--color-bg-panel)',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--color-border)',
                    }}>
                        {skills.map(renderSkillItem)}
                    </div>
                )}

                <p style={{
                    marginTop: '16px',
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--color-text-muted)',
                }}>
                    💡 Tip: Skill levels are used in templates like "Creative" to show progress bars.
                </p>
            </div>
        </div>
    );
}
