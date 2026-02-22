import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Edit2, ToggleLeft, ToggleRight, RefreshCw, X } from 'lucide-react';
import { Card, Button, DataPulseLoader, CategoryIcon } from '../../../components/common';
import { categoryService } from '../../../services/categoryService';
import type { Category, CreateCategoryRequest } from '../../../services/categoryService';
import toast from 'react-hot-toast';

// Default emoji icons for categories
const defaultIcons: Record<string, string> = {
    'Infrastructure': '🏗️',
    'Environment': '🌳',
    'Public Safety': '🔦',
    'Transportation': '🚌',
    'Utilities': '💡',
    'default': '📋',
};

// Color palette for categories
const colorPalette = [
    '#0D7377', '#32936F', '#2196F3', '#9C27B0', '#FF9800', '#F44336',
    '#795548', '#607D8B', '#3F51B5', '#009688'
];

const CategoriesPage: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    // Form state
    const [formData, setFormData] = useState<CreateCategoryRequest>({
        name: '',
        description: '',
        icon: '📋',
    });

    const fetchCategories = useCallback(async () => {
        try {
            setLoading(true);
            const data = await categoryService.getAllCategories();
            setCategories(data);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            toast.error('Failed to load categories');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleOpenModal = (category?: Category) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                name: category.name,
                description: category.description,
                icon: category.icon || defaultIcons[category.name] || defaultIcons['default'],
            });
        } else {
            setEditingCategory(null);
            setFormData({ name: '', description: '', icon: '📋' });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingCategory(null);
        setFormData({ name: '', description: '', icon: '📋' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error('Category name is required');
            return;
        }

        try {
            setSaving(true);
            if (editingCategory) {
                await categoryService.updateCategory(editingCategory.id, formData);
                toast.success('Category updated successfully');
            } else {
                await categoryService.createCategory(formData);
                toast.success('Category created successfully');
            }
            handleCloseModal();
            fetchCategories();
        } catch (error) {
            console.error('Failed to save category:', error);
            toast.error(editingCategory ? 'Failed to update category' : 'Failed to create category');
        } finally {
            setSaving(false);
        }
    };

    const handleToggleActive = async (category: Category) => {
        try {
            if (!category.active) {
                await categoryService.reactivateCategory(category.id);
                toast.success('Category reactivated');
            } else {
                await categoryService.deleteCategory(category.id);
                toast.success('Category deactivated');
            }
            fetchCategories();
        } catch (error) {
            console.error('Failed to toggle category:', error);
            toast.error(category.active ? 'Failed to deactivate category' : 'Failed to reactivate category');
        }
    };

    const getCategoryColor = (index: number) => {
        return colorPalette[index % colorPalette.length];
    };


    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <DataPulseLoader size={60} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#263238] font-['Noto_Sans_JP']">
                        Category Management
                    </h1>
                    <p className="text-[#546E7A]">Manage incident categories ({categories.length} total)</p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="ghost"
                        icon={<RefreshCw size={18} />}
                        onClick={fetchCategories}
                    >
                        Refresh
                    </Button>
                    <Button
                        variant="primary"
                        icon={<Plus size={18} />}
                        onClick={() => handleOpenModal()}
                    >
                        Create Category
                    </Button>
                </div>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categories.map((category, index) => (
                    <Card
                        key={category.id}
                        className={`relative ${!category.active ? 'opacity-60' : ''}`}
                    >
                        {/* Status Badge */}
                        {!category.active && (
                            <span className="absolute top-3 right-3 px-2 py-0.5 bg-[#B0BEC5] text-white text-xs rounded-full">
                                Inactive
                            </span>
                        )}

                        {/* Icon */}
                        <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4"
                            style={{ backgroundColor: `${getCategoryColor(index)}20` }}
                        >
                            <CategoryIcon iconName={category.icon || category.name} size={32} className="text-[#263238]" />
                        </div>

                        {/* Name & Description */}
                        <h3 className="text-lg font-semibold text-[#263238] text-center mb-1">
                            {category.name}
                        </h3>
                        <p className="text-sm text-[#546E7A] text-center mb-4 line-clamp-2">
                            {category.description || 'No description'}
                        </p>

                        {/* Actions */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleOpenModal(category)}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 
                           border border-[#B0BEC5] rounded-lg hover:bg-[#ECEFF1] 
                           text-[#546E7A] text-sm transition-colors"
                            >
                                <Edit2 size={14} />
                                Edit
                            </button>
                            <button
                                onClick={() => handleToggleActive(category)}
                                className={`px-3 py-2 rounded-lg text-sm transition-colors ${category.active
                                    ? 'bg-[#32936F]/10 text-[#32936F] hover:bg-[#32936F]/20'
                                    : 'bg-[#B0BEC5]/20 text-[#546E7A] hover:bg-[#B0BEC5]/30'
                                    }`}
                                title={category.active ? 'Deactivate' : 'Activate'}
                            >
                                {category.active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                            </button>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Empty State */}
            {categories.length === 0 && (
                <Card className="text-center py-16">
                    <div className="text-4xl mb-4">📋</div>
                    <h3 className="text-xl font-semibold text-[#263238] mb-2">No categories found</h3>
                    <p className="text-[#546E7A] mb-4">Create your first category to get started</p>
                    <Button variant="primary" icon={<Plus size={18} />} onClick={() => handleOpenModal()}>
                        Create Category
                    </Button>
                </Card>
            )}

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-md relative">
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-4 right-4 p-1 hover:bg-[#ECEFF1] rounded"
                        >
                            <X size={20} className="text-[#546E7A]" />
                        </button>

                        <h2 className="text-xl font-bold text-[#263238] mb-6">
                            {editingCategory ? 'Edit Category' : 'Create Category'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#263238] mb-1">
                                    Category Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-[#B0BEC5] rounded-lg 
                             focus:border-[#0D7377] focus:ring-2 focus:ring-[#0D7377]/20 outline-none"
                                    placeholder="e.g., Infrastructure"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#263238] mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-[#B0BEC5] rounded-lg 
                             focus:border-[#0D7377] focus:ring-2 focus:ring-[#0D7377]/20 outline-none resize-none"
                                    placeholder="Brief description of this category"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#263238] mb-1">
                                    Icon (emoji)
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={formData.icon}
                                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                        className="w-20 px-4 py-2 border border-[#B0BEC5] rounded-lg text-center text-2xl
                               focus:border-[#0D7377] focus:ring-2 focus:ring-[#0D7377]/20 outline-none"
                                    />
                                    <div className="flex-1 flex flex-wrap gap-1">
                                        {['🏗️', '🌳', '🔦', '🚌', '💡', '🚧', '🗑️', '🚰', '⚡', '🏥'].map((emoji) => (
                                            <button
                                                key={emoji}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, icon: emoji })}
                                                className={`w-8 h-8 rounded hover:bg-[#ECEFF1] ${formData.icon === emoji ? 'bg-[#0D7377]/10 ring-2 ring-[#0D7377]' : ''}`}
                                            >
                                                {emoji}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    fullWidth
                                    onClick={handleCloseModal}
                                    disabled={saving}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    fullWidth
                                    disabled={saving}
                                >
                                    {saving ? 'Saving...' : editingCategory ? 'Save Changes' : 'Create Category'}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default CategoriesPage;
