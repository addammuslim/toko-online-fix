import {
  Product,
  Category,
  WebSettings,
  HomeSection,
  Order,
  CartItem,
  PosShift,
  Review,
  Testimonial,
  ContactMessage,
  ActivityLog,
  StaffUser,
  Expense,
  Promotion,
  LoyaltyReward,
  Customer,
  CustomPage
} from '../types';
import {
  initialCategories,
  initialProducts,
  initialWebSettings,
  initialHomeSections,
  initialOrders,
  initialReviews,
  initialTestimonials,
  initialStaffUsers,
  initialActiveShift,
  initialExpenses,
  initialPromotions,
  initialLoyaltyRewards,
  initialCustomers,
  initialCustomPages
} from '../data/initialData';

const KEYS = {
  PRODUCTS: 'ns_products',
  CATEGORIES: 'ns_categories',
  SETTINGS: 'ns_settings',
  HOME_SECTIONS: 'ns_home_sections',
  ORDERS: 'ns_orders',
  CART: 'ns_cart',
  POS_SHIFT: 'ns_pos_shift',
  REVIEWS: 'ns_reviews',
  TESTIMONIALS: 'ns_testimonials',
  INBOX: 'ns_inbox',
  LOGS: 'ns_logs',
  USERS: 'ns_users',
  ADMIN_AUTH: 'ns_admin_auth',
  EXPENSES: 'ns_expenses',
  PROMOTIONS: 'ns_promotions',
  LOYALTY: 'ns_loyalty',
  CUSTOMERS: 'ns_customers',
  CURRENT_CUSTOMER: 'ns_current_customer',
  CUSTOM_PAGES: 'ns_custom_pages'
};

function getStored<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return defaultValue;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
}

export const StorageService = {
  getProducts(): Product[] {
    return getStored<Product[]>(KEYS.PRODUCTS, initialProducts);
  },
  saveProducts(products: Product[]): void {
    setStored(KEYS.PRODUCTS, products);
  },
  updateProduct(product: Product): void {
    const products = this.getProducts();
    const index = products.findIndex((p) => p.id === product.id);
    if (index >= 0) {
      products[index] = product;
    } else {
      products.unshift(product);
    }
    this.saveProducts(products);
  },
  deleteProduct(id: string): void {
    const products = this.getProducts().filter((p) => p.id !== id);
    this.saveProducts(products);
  },

  getCategories(): Category[] {
    return getStored<Category[]>(KEYS.CATEGORIES, initialCategories);
  },
  saveCategories(categories: Category[]): void {
    setStored(KEYS.CATEGORIES, categories);
  },

  getSettings(): WebSettings {
    return getStored<WebSettings>(KEYS.SETTINGS, initialWebSettings);
  },
  saveSettings(settings: WebSettings): void {
    setStored(KEYS.SETTINGS, settings);
    document.documentElement.style.setProperty('--brand-primary', settings.primaryColor);
    document.documentElement.style.setProperty('--brand-primary-hover', settings.primaryHoverColor);
    document.documentElement.style.setProperty('--brand-secondary', settings.secondaryColor);
    document.documentElement.style.setProperty('--brand-accent', settings.accentColor);
    document.documentElement.style.setProperty('--brand-focus', settings.focusRingColor);
  },

  getHomeSections(): HomeSection[] {
    const sections = getStored<HomeSection[]>(KEYS.HOME_SECTIONS, initialHomeSections);
    return sections.sort((a, b) => a.order - b.order);
  },
  saveHomeSections(sections: HomeSection[]): void {
    setStored(KEYS.HOME_SECTIONS, sections);
  },

  getOrders(): Order[] {
    return getStored<Order[]>(KEYS.ORDERS, initialOrders);
  },
  saveOrders(orders: Order[]): void {
    setStored(KEYS.ORDERS, orders);
  },
  addOrder(order: Order): void {
    const orders = this.getOrders();
    orders.unshift(order);
    this.saveOrders(orders);

    // Decrement stock
    const products = this.getProducts();
    for (const item of order.items) {
      const prod = products.find((p) => p.id === item.productId);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.quantity);
        if (item.variantName && prod.variants) {
          const variant = prod.variants.find((v) => v.name === item.variantName);
          if (variant) {
            variant.stock = Math.max(0, variant.stock - item.quantity);
          }
        }
      }
    }
    this.saveProducts(products);

    // Update customer loyalty stats if order is from a customer
    if (order.customerId || order.customerPhone) {
      const customers = this.getCustomers();
      const cust = customers.find(
        (c) =>
          c.id === order.customerId ||
          c.phone === order.customerPhone ||
          c.email === order.customerEmail
      );
      if (cust) {
        cust.orderCount += 1;
        cust.totalSpent += order.totalAmount;
        cust.loyaltyPoints += Math.floor(order.totalAmount / 10000); // 1 point per 10k
        this.saveCustomers(customers);

        // Update session customer if matching
        const currentCust = this.getLoggedInCustomer();
        if (currentCust && currentCust.id === cust.id) {
          this.setLoggedInCustomer(cust);
        }
      }
    }
  },
  updateOrder(order: Order): void {
    const orders = this.getOrders();
    const index = orders.findIndex((o) => o.id === order.id);
    if (index >= 0) {
      orders[index] = order;
      this.saveOrders(orders);
    }
  },

  getCart(): CartItem[] {
    return getStored<CartItem[]>(KEYS.CART, []);
  },
  saveCart(cart: CartItem[]): void {
    setStored(KEYS.CART, cart);
  },
  clearCart(): void {
    this.saveCart([]);
  },

  getShift(): PosShift {
    return getStored<PosShift>(KEYS.POS_SHIFT, initialActiveShift);
  },
  saveShift(shift: PosShift): void {
    setStored(KEYS.POS_SHIFT, shift);
  },

  getReviews(): Review[] {
    return getStored<Review[]>(KEYS.REVIEWS, initialReviews);
  },
  saveReviews(reviews: Review[]): void {
    setStored(KEYS.REVIEWS, reviews);
  },
  addReview(review: Review): void {
    const reviews = this.getReviews();
    reviews.unshift(review);
    this.saveReviews(reviews);
  },

  getTestimonials(): Testimonial[] {
    return getStored<Testimonial[]>(KEYS.TESTIMONIALS, initialTestimonials);
  },
  saveTestimonials(testimonials: Testimonial[]): void {
    setStored(KEYS.TESTIMONIALS, testimonials);
  },

  getInbox(): ContactMessage[] {
    return getStored<ContactMessage[]>(KEYS.INBOX, []);
  },
  saveInbox(messages: ContactMessage[]): void {
    setStored(KEYS.INBOX, messages);
  },
  addInbox(message: ContactMessage): void {
    const msgs = this.getInbox();
    msgs.unshift(message);
    this.saveInbox(msgs);
  },
  deleteInbox(id: string): void {
    const msgs = this.getInbox().filter((m) => m.id !== id);
    this.saveInbox(msgs);
  },
  markInboxRead(id: string): void {
    const msgs = this.getInbox().map((m) =>
      m.id === id ? { ...m, status: 'read' as const } : m
    );
    this.saveInbox(msgs);
  },

  getLogs(): ActivityLog[] {
    return getStored<ActivityLog[]>(KEYS.LOGS, [
      {
        id: 'log-init',
        event: 'system_initialized',
        category: 'admin_action',
        details: 'Toko Online & POS Nusantara Heritage berhasil diinisialisasi',
        createdAt: new Date().toISOString()
      }
    ]);
  },
  addLog(
    event: string,
    category: ActivityLog['category'],
    details: string,
    metadata?: Record<string, any>
  ): void {
    const logs = this.getLogs();
    const newLog: ActivityLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      event,
      category,
      details,
      metadata,
      createdAt: new Date().toISOString()
    };
    logs.unshift(newLog);
    if (logs.length > 300) logs.pop();
    setStored(KEYS.LOGS, logs);
  },

  getStaff(): StaffUser[] {
    return getStored<StaffUser[]>(KEYS.USERS, initialStaffUsers);
  },
  saveStaff(users: StaffUser[]): void {
    setStored(KEYS.USERS, users);
  },

  isAdminLoggedIn(): boolean {
    return getStored<boolean>(KEYS.ADMIN_AUTH, false);
  },
  setAdminLoggedIn(status: boolean): void {
    setStored(KEYS.ADMIN_AUTH, status);
  },

  // EXPENSES (Pengeluaran)
  getExpenses(): Expense[] {
    return getStored<Expense[]>(KEYS.EXPENSES, initialExpenses);
  },
  saveExpenses(expenses: Expense[]): void {
    setStored(KEYS.EXPENSES, expenses);
  },
  addExpense(expense: Expense): void {
    const expenses = this.getExpenses();
    expenses.unshift(expense);
    this.saveExpenses(expenses);
  },
  deleteExpense(id: string): void {
    const expenses = this.getExpenses().filter((e) => e.id !== id);
    this.saveExpenses(expenses);
  },

  // PROMOTIONS & VOUCHERS
  getPromotions(): Promotion[] {
    return getStored<Promotion[]>(KEYS.PROMOTIONS, initialPromotions);
  },
  savePromotions(promotions: Promotion[]): void {
    setStored(KEYS.PROMOTIONS, promotions);
  },
  addPromotion(promotion: Promotion): void {
    const promos = this.getPromotions();
    promos.unshift(promotion);
    this.savePromotions(promos);
  },
  updatePromotion(promotion: Promotion): void {
    const promos = this.getPromotions();
    const idx = promos.findIndex((p) => p.id === promotion.id);
    if (idx >= 0) promos[idx] = promotion;
    this.savePromotions(promos);
  },
  deletePromotion(id: string): void {
    const promos = this.getPromotions().filter((p) => p.id !== id);
    this.savePromotions(promos);
  },

  // LOYALTY REWARDS
  getLoyaltyRewards(): LoyaltyReward[] {
    return getStored<LoyaltyReward[]>(KEYS.LOYALTY, initialLoyaltyRewards);
  },
  saveLoyaltyRewards(rewards: LoyaltyReward[]): void {
    setStored(KEYS.LOYALTY, rewards);
  },
  addLoyaltyReward(reward: LoyaltyReward): void {
    const rewards = this.getLoyaltyRewards();
    rewards.push(reward);
    rewards.sort((a, b) => a.orderMilestone - b.orderMilestone);
    this.saveLoyaltyRewards(rewards);
  },
  updateLoyaltyReward(reward: LoyaltyReward): void {
    const rewards = this.getLoyaltyRewards();
    const idx = rewards.findIndex((r) => r.id === reward.id);
    if (idx >= 0) {
      rewards[idx] = reward;
      rewards.sort((a, b) => a.orderMilestone - b.orderMilestone);
      this.saveLoyaltyRewards(rewards);
    }
  },
  deleteLoyaltyReward(id: string): void {
    const rewards = this.getLoyaltyRewards().filter((r) => r.id !== id);
    this.saveLoyaltyRewards(rewards);
  },

  // CUSTOMERS & AUTH
  getCustomers(): Customer[] {
    return getStored<Customer[]>(KEYS.CUSTOMERS, initialCustomers);
  },
  saveCustomers(customers: Customer[]): void {
    setStored(KEYS.CUSTOMERS, customers);
  },
  addCustomer(customer: Customer): void {
    const customers = this.getCustomers();
    customers.unshift(customer);
    this.saveCustomers(customers);
  },
  updateCustomer(customer: Customer): void {
    const customers = this.getCustomers();
    const idx = customers.findIndex((c) => c.id === customer.id);
    if (idx >= 0) {
      customers[idx] = customer;
      this.saveCustomers(customers);
    }
  },
  getLoggedInCustomer(): Customer | null {
    return getStored<Customer | null>(KEYS.CURRENT_CUSTOMER, null);
  },
  setLoggedInCustomer(customer: Customer | null): void {
    setStored(KEYS.CURRENT_CUSTOMER, customer);
  },

  // DYNAMIC CMS PAGES (Tentang Kami, Kebijakan, Kontak, S&K)
  getCustomPages(): CustomPage[] {
    return getStored<CustomPage[]>(KEYS.CUSTOM_PAGES, initialCustomPages);
  },
  saveCustomPages(pages: CustomPage[]): void {
    setStored(KEYS.CUSTOM_PAGES, pages);
  },
  updateCustomPage(page: CustomPage): void {
    const pages = this.getCustomPages();
    const idx = pages.findIndex((p) => p.id === page.id);
    if (idx >= 0) {
      pages[idx] = page;
    } else {
      pages.push(page);
    }
    this.saveCustomPages(pages);
  },
  getCustomPageById(id: string): CustomPage | undefined {
    return this.getCustomPages().find((p) => p.id === id);
  }
};
