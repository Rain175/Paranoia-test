// Create in-memory storage for mock data
const mockStorage = {
  GameRoom: new Map(),
  RoomPlayer: new Map()
};

const createMockEntity = (entityName) => ({
  filter: async (query) => {
    const storage = mockStorage[entityName] || new Map();
    const results = [];
    for (const [key, record] of storage) {
      let matches = true;
      for (const [queryKey, queryValue] of Object.entries(query)) {
        if (record[queryKey] !== queryValue) {
          matches = false;
          break;
        }
      }
      if (matches) results.push({ id: key, ...record });
    }
    return results;
  },
  get: async (id) => {
    const storage = mockStorage[entityName] || new Map();
    const record = storage.get(id);
    return record ? { id, ...record } : null;
  },
  create: async (data) => {
    const storage = mockStorage[entityName] || new Map();
    const id = Math.random().toString(36).substr(2, 9);
    storage.set(id, data);
    mockStorage[entityName] = storage;
    // Trigger subscribers
    notifySubscribers(entityName, { type: 'create', data: { id, ...data } });
    return { id, ...data };
  },
  update: async (id, data) => {
    const storage = mockStorage[entityName] || new Map();
    const existing = storage.get(id) || {};
    const updated = { ...existing, ...data };
    storage.set(id, updated);
    mockStorage[entityName] = storage;
    // Trigger subscribers
    notifySubscribers(entityName, { type: 'update', data: { id, ...updated } });
    return { id, ...updated };
  },
  delete: async (id) => {
    const storage = mockStorage[entityName] || new Map();
    storage.delete(id);
    mockStorage[entityName] = storage;
    // Trigger subscribers
    notifySubscribers(entityName, { type: 'delete', data: { id } });
    return { id };
  },
  subscribe: (callback) => {
    const subscribers = window.__b44Subscribers__ = window.__b44Subscribers__ || {};
    if (!subscribers[entityName]) subscribers[entityName] = [];
    subscribers[entityName].push(callback);
    // Return unsubscribe function
    return () => {
      const idx = subscribers[entityName].indexOf(callback);
      if (idx > -1) subscribers[entityName].splice(idx, 1);
    };
  }
});

const notifySubscribers = (entityName, event) => {
  const subscribers = window.__b44Subscribers__ = window.__b44Subscribers__ || {};
  if (subscribers[entityName]) {
    subscribers[entityName].forEach(cb => {
      try { cb(event); } catch (e) { console.error('Subscriber error:', e); }
    });
  }
};

export const db = {
  auth: {
    isAuthenticated: async () => false,
    me: async () => null
  },
  entities: new Proxy({}, {
    get: (target, entityName) => createMockEntity(entityName)
  }),
  integrations: {
    Core: {
      UploadFile: async () => ({ file_url: '' })
    }
  }
};

export const base44 = db;
export default db;
