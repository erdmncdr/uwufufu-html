import apiClient from './client';

export const categoriesApi = {
  list: async (lang?: string) => {
    const response = await apiClient.get('/categories', {
      params: { lang },
    });
    return response.data;
  },

  getBySlug: async (slug: string, lang?: string) => {
    const response = await apiClient.get(`/categories/${slug}`, {
      params: { lang },
    });
    return response.data;
  },
};
