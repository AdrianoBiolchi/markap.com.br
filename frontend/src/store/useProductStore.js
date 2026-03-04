import { create } from 'zustand';
import api from '../api';

const mapProduct = (p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    productionCost: Number(p.productionCost) || 0,
    laborCost: Number(p.laborCost) || 0,
    packagingCost: Number(p.packagingCost) || 0,
    shippingCost: Number(p.shippingCost) || 0,
    monthlyRent: Number(p.monthlyRent) || 0,
    ownerSalary: Number(p.ownerSalary) || 0,
    employeesCost: Number(p.employeesCost) || 0,
    utilitiesCost: Number(p.utilitiesCost) || 0,
    otherFixedCosts: Number(p.otherFixedCosts) || 0,
    expectedVolume: Number(p.expectedVolume) || 0,
    cardFee: Number(p.cardFee) || 0,
    commission: Number(p.commission) || 0,
    marketplaceFee: Number(p.marketplaceFee) || 0,
    taxRate: Number(p.taxRate) || 0,
    desiredMargin: Number(p.desiredMargin) || 0,
    suggestedPrice: Number(p.suggestedPrice) || 0,
    netMargin: Number(p.netMargin) || 0,
    healthScore: Number(p.healthScore) || 0,
    breakEven: Number(p.breakEven) || 0,
});

export const useProductStore = create((set) => ({
    products: [],
    isLoading: false,
    error: null,

    fetchProducts: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.get('/products');
            set({ products: res.data.map(mapProduct), isLoading: false });
        } catch (err) {
            set({ error: 'Erro ao carregar produtos', isLoading: false });
        }
    },

    addProduct: async (product) => {
        set({ isLoading: true });
        try {
            const res = await api.post('/products', product);
            set((state) => ({ products: [mapProduct(res.data), ...state.products], isLoading: false }));
            return true;
        } catch (err) {
            set({ error: 'Erro ao adicionar produto', isLoading: false });
            return false;
        }
    },

    removeProduct: async (productId) => {
        try {
            await api.delete(`/products/${productId}`);
            set((state) => ({
                products: state.products.filter(p => p.id !== productId)
            }));
            return true;
        } catch (err) {
            set({ error: 'Erro ao remover produto' });
            return false;
        }
    },

    updateProduct: async (product) => {
        set({ isLoading: true });
        try {
            const res = await api.put(`/products/${product.id}`, product);
            const updated = mapProduct(res.data);
            set((state) => ({
                products: state.products.map(p => p.id === product.id ? updated : p),
                isLoading: false
            }));
            return true;
        } catch (err) {
            set({ error: 'Erro ao atualizar produto', isLoading: false });
            return false;
        }
    },
}));
