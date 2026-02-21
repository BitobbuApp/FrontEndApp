const makeEntityMock = (entityName) => {
  const store = [];

  return {
    list: async (_order) => [...store],
    filter: async (_filters, _order, _limit) => [...store],
    get: async (id) => store.find(item => item.id === id) ?? null,
    create: async (data) => {
      const newItem = {
        id: crypto.randomUUID(),
        created_date: new Date().toISOString(),
        created_by: 'dev@bitobbu.com',
        ...data,
      };
      store.push(newItem);
      return newItem;
    },
    update: async (id, data) => {
      const index = store.findIndex(item => item.id === id);
      if (index !== -1) {
        store[index] = { ...store[index], ...data };
        return store[index];
      }
      return { id, ...data };
    },
    delete: async (_id) => {},
  };
};

// Proxy to intercept any entity name (Solicitud, Oferta, Company, etc.)
const entitiesProxy = new Proxy({}, {
  get: (cache, entityName) => {
    if (!cache[entityName]) {
      cache[entityName] = makeEntityMock(entityName);
    }
    return cache[entityName];
  }
});

export const base44 = {
  appLogs: {
    logUserInApp: async (_pageName) => {},
  },
  auth: {
    me: async () => ({
      id: 'dummy-user-1',
      email: 'dev@bitobbu.com',
      full_name: 'Dev User',
      avatar: null,
    }),
    logout: (_redirectUrl) => {
      console.info('[mock] auth.logout called');
    },
    redirectToLogin: (_redirectUrl) => {
      console.info('[mock] auth.redirectToLogin called');
    },
  },
  entities: entitiesProxy,
  integrations: {
    Core: {
      UploadFile: async (_args) => ({
        file_url: 'https://placehold.co/400x400/D2FC31/1E293B?text=IMG',
      }),
    },
  },
};
